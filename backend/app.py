from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import h5py
import cv2  # for CLAHE preprocessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Permanent fix for InputLayer batch_shape deserialization error ──
# This patches the model's JSON config before loading, replacing the
# 'batch_shape' key (used by newer TF) with 'batch_input_shape' (older TF).
# Works regardless of TF version on the server.

def _fix_config(cfg):
    """Recursively fix InputLayer config dicts."""
    if isinstance(cfg, dict):
        if cfg.get("class_name") == "InputLayer":
            inner = cfg.get("config", {})
            if "batch_shape" in inner:
                inner["batch_input_shape"] = inner.pop("batch_shape")
        return {k: _fix_config(v) for k, v in cfg.items()}
    elif isinstance(cfg, list):
        return [_fix_config(item) for item in cfg]
    return cfg


def load_model_compat(path: str):
    """
    Load a Keras .h5 model in a version-agnostic way.
    1. Try standard load (works if versions match).
    2. If that fails, patch the JSON model config via h5py and retry.
    """
    # Attempt 1: standard load
    try:
        return tf.keras.models.load_model(path, compile=False)
    except Exception as e1:
        print(f"[INFO] Standard load failed ({e1}), applying config patch…")

    # Attempt 2: patch the H5 config and reload
    try:
        with h5py.File(path, "r+") as f:
            raw_config = f.attrs.get("model_config")
            if raw_config is None:
                raise RuntimeError("No model_config found in H5 file.")

            # h5py may return bytes or str depending on version
            if isinstance(raw_config, bytes):
                raw_config = raw_config.decode("utf-8")

            config = json.loads(raw_config)
            fixed_config = _fix_config(config)
            f.attrs["model_config"] = json.dumps(fixed_config)

        print("[INFO] Config patched successfully, reloading model…")
        model = tf.keras.models.load_model(path, compile=False)
        print("[INFO] Model loaded successfully after patch.")
        return model

    except Exception as e2:
        raise RuntimeError(
            f"Both load attempts failed.\n"
            f"Attempt 1: {e1}\n"
            f"Attempt 2: {e2}"
        )


MODEL_PATH = "model/retina_model.h5"
model = None  # Lazy loading to prevent Render timeouts

def get_model():
    """Helper to load model once when needed."""
    global model
    if model is None:
        print(f"[BOOT] Loading model from {MODEL_PATH}…")
        model = load_model_compat(MODEL_PATH)
        print("[BOOT] Model ready ✓")
    return model

classes = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]
# ─────────────────────────────────────────────
# 1.5.  ADVANCED PREPROCESSING (CLAHE) - Matches train.py
# ─────────────────────────────────────────────
def apply_clahe(img):
    """Enhance blood vessels using histogram equalization (PRO Strategy)."""
    if img.dtype != np.uint8:
        img_u8 = (img * 255.0).astype(np.uint8) if np.max(img) <= 1.0 else img.astype(np.uint8)
    else:
        img_u8 = img

    lab = cv2.cvtColor(img_u8, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.equalizeHist(l)
    lab_merged = cv2.merge((l, a, b))
    enhanced_rgb = cv2.cvtColor(lab_merged, cv2.COLOR_LAB2RGB)
    return enhanced_rgb.astype(np.float32)


def preprocess(image: Image.Image) -> np.ndarray:
    """Preprocess image: resize -> CLAHE -> rescale -> expand dims."""
    # Resize to 256x256 (matches the 80% accuracy model size)
    image = image.resize((256, 256))
    arr = np.array(image, dtype=np.float32)
    
    # Apply CLAHE
    arr = apply_clahe(arr)
    
    # Note: No rescaling here - EfficientNet handles it internally.
    return np.expand_dims(arr, axis=0)


@app.get("/")
def health():
    return {"status": "ok", "model": "retina_model.h5"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    img = preprocess(image)
    
    # Use lazy loaded model
    loaded_model = get_model()
    pred = loaded_model.predict(img)
    
    return {
        "prediction": classes[int(np.argmax(pred))],
        "confidence": float(np.max(pred)) * 100
    }
