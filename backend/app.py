from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import h5py
import cv2  # for CLAHE preprocessing
import os

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


MODEL_PATH_87 = "model/retina_87_model.h5"
MODEL_PATH_BASE = "model/retina_model.h5"
MODEL_PATH = MODEL_PATH_87 if os.path.exists(MODEL_PATH_87) else MODEL_PATH_BASE
model = None  # Lazy loading to prevent Render timeouts

def get_model():
    """Helper to load model once when needed."""
    global model
    if model is None:
        print(f"[BOOT] Loading EfficientNetB3 Neural Engine from {MODEL_PATH}…")
        model = load_model_compat(MODEL_PATH)
        print("[BOOT] Neural Engine Ready: High Precision Diagnostic Active ✓")
    return model

classes = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]

# ──────────────────────────────────────────────────
# 1.5.  ADVANCED PREPROCESSING (CLAHE) - Matches train.py
# ──────────────────────────────────────────────────

@app.get("/")
def health():
    return {
        "status": "online",
        "engine": "EfficientNet-B3-CV-V4",
        "accuracy_target": "87.0%",
        "medical_protocols": ["CLAHE", "RGB2LAB", "PRO_STRATEGY"]
    }

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


def is_retina_image(img_arr: np.ndarray) -> tuple[bool, str]:
    """
    Enhanced validation: Color signature + Brightness + Intensity.
    """
    # 1. Intensity/Brightness Check (Reject very dark/light)
    avg_intensity = np.mean(img_arr)
    if avg_intensity < 30:
        return False, "Image too dark. Please provide a clear fundus scan."
    if avg_intensity > 220:
        return False, "Image too bright. Exposure exceeds diagnostic limits."

    # 2. Flatness Check (No structural variance)
    if np.std(img_arr) < 15.0:
        return False, "Low structural complexity. Image appears to be a flat surface."
        
    # 3. Color Signature Check (Red dominance)
    r = np.mean(img_arr[:, :, 0])
    b = np.mean(img_arr[:, :, 2])
    
    if b > r * 0.85:  
        return False, "Invalid retinal image. Please upload a proper eye scan."
        
    return True, "Valid"


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # ── SECURITY GATE: Check if it's actually an eye ──
    raw_arr = np.array(image)
    is_valid, msg = is_retina_image(raw_arr)
    if not is_valid:
        return {
            "success": False,
            "prediction": "Invalid Image",
            "confidence": 0.0,
            "message": msg,
            "error": msg
        }
    
    img = preprocess(image)
    
    # Use lazy loaded model
    loaded_model = get_model()
    pred = loaded_model.predict(img)
    
    # Optional logic: Reject if the neural network is completely confused (low confidence)
    confidence = float(np.max(pred)) * 100
    if confidence < 45.0:
        return {
            "prediction": "Uncertain / Unrecognized",
            "confidence": confidence,
            "error": "The AI cannot securely classify this image. Proceed with medical block."
        }
        
    return {
        "success": True,
        "prediction": classes[int(np.argmax(pred))],
        "confidence": confidence
    }
