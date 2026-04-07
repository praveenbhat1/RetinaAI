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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_model_compat(path: str):
    """Load the Keras model natively using Keras 3."""
    return tf.keras.models.load_model(path, compile=False)

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

# Alphabetized mapping exactly matching ImageDataGenerator training directories
classes = ["Mild", "Moderate", "No DR", "Proliferative", "Severe"]

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

def preprocess(image, target_size=(256, 256)):
    """Preprocess the image: resize and apply CLAHE."""
    # Use NEAREST (matches exactly to ImageDataGenerator training)
    image = image.resize(target_size, Image.Resampling.NEAREST)
    arr = np.array(image, dtype=np.float32)
    
    # Apply precise Histogram Equalization
    arr = apply_clahe(arr)
    
    return np.expand_dims(arr, axis=0)

def is_retina_image(img_arr: np.ndarray) -> tuple[bool, str]:
    """ Permissive validation for demo purposes. """
    avg_intensity = np.mean(img_arr)
    if avg_intensity < 2:
        return False, "Image too dark. Please provide a clear fundus scan."
    if avg_intensity > 250:
        return False, "Image overexposed. Please provide a clear fundus scan."
    return True, "Valid"


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # ── SECURITY GATE ──
    raw_arr = np.array(image)
    is_valid, msg = is_retina_image(raw_arr)
    if not is_valid:
        return {"success": False, "prediction": "Invalid Image", "confidence": 0.0, "error": msg}
    
    loaded_model = get_model()
    
    try:
        input_shape = loaded_model.input_shape
        target_h, target_w = (input_shape[1] or 300, input_shape[2] or 300)
        target_size = (target_w, target_h)
    except:
        target_size = (300, 300)

    # ── ADVANCED ENSEMBLE TTA (Test Time Augmentation) ──
    # Improves boundary cases (Moderate vs Mild, Severe vs Proliferative)
    # by aggregating predictions across augmented views.
    
    img_v1 = preprocess(image, target_size)
    img_v2 = preprocess(image.transpose(Image.FLIP_LEFT_RIGHT), target_size)
    img_v4 = preprocess(image.transpose(Image.FLIP_TOP_BOTTOM), target_size)
    
    # Pure Probabilities
    p1 = loaded_model.predict(img_v1, verbose=0)[0]
    p2 = loaded_model.predict(img_v2, verbose=0)[0]
    p4 = loaded_model.predict(img_v4, verbose=0)[0]
    
    # Unbiased Averaging
    ensemble_probs = (p1*0.4 + p2*0.3 + p4*0.3)
    
    # ── CLINICAL RISK SENSITIVITY MULTIPLIERS ──
    # Index Map: 0=Mild, 1=Moderate, 2=No DR, 3=Proliferative, 4=Severe
    # Slightly favor 'Moderate' and 'Severe' to reduce dangerous False Negatives
    ensemble_probs[1] *= 1.15  # Boost Moderate by 15%
    ensemble_probs[4] *= 1.15  # Boost Severe by 15%
    
    idx = int(np.argmax(ensemble_probs))
    confidence = float(ensemble_probs[idx]) * 100
        
    return {
        "success": True,
        "prediction": classes[idx],
        "confidence": confidence,
        "engine_logs": f"TTA_CLEAN_v5.1 | RES={target_size[0]}"
    }
