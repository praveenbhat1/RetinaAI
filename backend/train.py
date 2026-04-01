"""
==============================================================================
  Retinex — EfficientNetB3 Retinal Disease Detection Pipeline
  Compatible with: TensorFlow 2.x, APTOS 2019 / folder-based datasets
  Output: retina_model.h5  (drop-in replacement for FastAPI backend)
==============================================================================
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.utils.class_weight import compute_class_weight
from PIL import Image
import cv2  # for CLAHE preprocessing

# ─────────────────────────────────────────────
# 0.  CONFIGURATION  (edit these paths)
# ─────────────────────────────────────────────
CONFIG = {
    # ── Dataset ──
    # Using APTOS-style CSV (id_code, diagnosis)
    "use_csv":     True,
    "csv_path":    "model/train_1.csv",
    "img_dir":     "model/train_images/train_images",   # where the .png files are

    # Unused when use_csv=True
    "dataset_dir": "dataset/images",

    # ── Model ──
    "img_size":    (256, 256),  # Higher resolution for micro-details
    "batch_size":  16,          # Smaller batch for more gradient updates
    "epochs_p1":   5,           # Stronger warm-up
    "epochs_p2":   15,          # Deep fine-tuning
    "val_split":   0.2,
    "dropout":     0.5,
    "dense_units": 256,         # Prevent overfitting
    "fine_tune":   True,
    "learning_rate": 0.0001,

    # ── Output ──
    "model_path":  "model/retina_model.h5",
    "history_png": "training_history.png",
    "history_csv": "training_history.csv",
}

CLASSES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]
NUM_CLASSES = len(CLASSES)

# ─────────────────────────────────────────────
# 1.  APTOS CSV → folder helper
# ─────────────────────────────────────────────
APTOS_MAP = {0: "No DR", 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Proliferative"}

def build_dataframe_from_csv(csv_path: str, img_dir: str) -> pd.DataFrame:
    """Convert APTOS CSV to a DataFrame compatible with flow_from_dataframe."""
    df = pd.read_csv(csv_path)
    df["filename"] = df["id_code"].apply(
        lambda x: os.path.join(img_dir, f"{x}.png")
    )
    df = df[df["filename"].apply(os.path.exists)].copy()
    df["label"] = df["diagnosis"].map(APTOS_MAP)
    print(f"[DATA] Loaded {len(df)} images from CSV.")
    return df[["filename", "label"]]


# ─────────────────────────────────────────────
# 1.5.  ADVANCED PREPROCESSING (CLAHE)
# ─────────────────────────────────────────────
def apply_clahe(img):
    """
    Enhance blood vessels using histogram equalization (PRO Strategy).
    """
    # Convert to uint8 [0-255] if float from Keras
    if img.dtype != np.uint8:
        img_u8 = (img * 255.0).astype(np.uint8) if np.max(img) <= 1.0 else img.astype(np.uint8)
    else:
        img_u8 = img

    # Use RGB to LAB since Keras loads as RGB
    lab = cv2.cvtColor(img_u8, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.equalizeHist(l)                 # The REAL paper upgrade
    lab_merged = cv2.merge((l,a,b))
    enhanced_rgb = cv2.cvtColor(lab_merged, cv2.COLOR_LAB2RGB)
    
    return enhanced_rgb.astype(np.float32)


# ─────────────────────────────────────────────
# 2.  DATA GENERATORS
# ─────────────────────────────────────────────
def build_generators(config: dict):
    """Return (train_gen, val_gen, class_names)."""
    img_size = config["img_size"]
    batch    = config["batch_size"]
    val_frac = config["val_split"]

    # Balanced Augmentation (NOT too strong)
    # Note: No rescaling here because EfficientNet has its own Rescaling layer.
    train_datagen = ImageDataGenerator(
        rotation_range=15,
        zoom_range=0.1,
        brightness_range=[0.9, 1.1],
        horizontal_flip=True,
        validation_split=val_frac,
        preprocessing_function=apply_clahe, 
    )

    # Validation datagen also uses CLAHE for consistency
    val_datagen = ImageDataGenerator(
        validation_split=val_frac,
        preprocessing_function=apply_clahe,
    )

    generator_kwargs = dict(
        target_size=img_size,
        batch_size=batch,
        class_mode="categorical",
        shuffle=True,
        seed=42,
    )

    if config["use_csv"]:
        df = build_dataframe_from_csv(config["csv_path"], config["img_dir"])
        train_gen = train_datagen.flow_from_dataframe(
            df, x_col="filename", y_col="label",
            classes=CLASSES, subset="training", **generator_kwargs
        )
        val_gen = val_datagen.flow_from_dataframe(
            df, x_col="filename", y_col="label",
            classes=CLASSES, subset="validation", **generator_kwargs
        )
    else:
        train_gen = train_datagen.flow_from_directory(
            config["dataset_dir"], classes=CLASSES,
            subset="training", **generator_kwargs
        )
        val_gen = val_datagen.flow_from_directory(
            config["dataset_dir"], classes=CLASSES,
            subset="validation", **generator_kwargs
        )

    print(f"[DATA] Train batches: {len(train_gen)}  |  Val batches: {len(val_gen)}")
    print(f"[DATA] Class indices: {train_gen.class_indices}")
    return train_gen, val_gen


# ─────────────────────────────────────────────
# 3.  MODEL DEFINITION
# ─────────────────────────────────────────────
def build_model(img_size=(224, 224), num_classes=5, dropout=0.5, dense_units=128):
    """EfficientNetB3 + custom classification head."""
    base = EfficientNetB3(
        include_top=False,
        weights="imagenet",
        input_shape=(*img_size, 3),
    )

    # Phase 1: freeze base for warm-up
    base.trainable = False

    inputs  = tf.keras.Input(shape=(*img_size, 3))
    x       = base(inputs, training=False)
    x       = layers.GlobalAveragePooling2D()(x)
    x       = layers.BatchNormalization()(x)
    x       = layers.Dense(dense_units, activation="relu")(x)
    x       = layers.Dropout(dropout)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs, name="RetinexEfficientNetB3")
    model.summary()
    return model, base


# ─────────────────────────────────────────────
# 4.  COMPILE
# ─────────────────────────────────────────────
def compile_model(model, lr=1e-3):
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=lr),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


# ─────────────────────────────────────────────
# 5.  CALLBACKS
# ─────────────────────────────────────────────
def make_callbacks(model_path: str):
    return [
        callbacks.ModelCheckpoint(
            model_path, monitor="val_accuracy",
            save_best_only=True, verbose=1
        ),
        callbacks.EarlyStopping(
            monitor="val_loss", patience=3,
            restore_best_weights=True, verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.3,
            patience=2, min_lr=1e-6, verbose=1
        ),
    ]


# ─────────────────────────────────────────────
# 6.  TRAINING HISTORY PLOT
# ─────────────────────────────────────────────
def plot_history(history, out_path: str):
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle("Retinex — EfficientNetB3 Training", fontsize=14, fontweight="bold")

    for ax, metric, title in zip(
        axes,
        [("accuracy", "val_accuracy"), ("loss", "val_loss")],
        ["Accuracy", "Loss"],
    ):
        ax.plot(history.history[metric[0]],  label="Train",      linewidth=2)
        ax.plot(history.history[metric[1]],  label="Validation", linewidth=2, linestyle="--")
        ax.set_title(title)
        ax.set_xlabel("Epoch")
        ax.legend()
        ax.grid(alpha=0.3)

    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()
    print(f"[PLOT] History saved → {out_path}")


# 7.  FINE-TUNING  (THE KEY TO 70%+)
# ─────────────────────────────────────────────
def fine_tune_model(model, base, train_gen, val_gen, config, class_weights=None, unfreeze_from=50):
    """Unfreeze top portion of the base to specialize on retinal features."""
    print(f"\n[FINE-TUNE] Phase 2 — Top Specialization (unfreezing {unfreeze_from} layers)…")
    base.trainable = True
    
    # Freeze the foundational layers to prevent catastrophic forgetting
    for layer in base.layers[:-unfreeze_from]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5), # Keep LR very low for full unfreeze
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    ft_history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=config["epochs_p2"],
        class_weight=class_weights,
        callbacks=make_callbacks(config["model_path"]),
    )
    return ft_history


# 8.  PREDICTION FUNCTION
#     (drop-in compatible with FastAPI /predict)
# ─────────────────────────────────────────────
def predict_image(model, image_input, img_size=(224, 224)):
    """
    Parameters
    ----------
    model       : loaded Keras model
    image_input : PIL.Image  OR  str (file path)  OR  np.ndarray (H,W,3) [0–255]

    Returns
    -------
    dict with 'prediction' (class name) and 'confidence' (0–100 %)
    """
    if isinstance(image_input, str):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, np.ndarray):
        img = Image.fromarray(image_input.astype(np.uint8)).convert("RGB")
    else:
        img = image_input.convert("RGB")

    img = img.resize(img_size)
    arr = np.array(img, dtype=np.float32)
    arr = apply_clahe(arr)                       # Apply CLAHE for consistency
    # No rescaling here - EfficientNet handles it internally
    arr = np.expand_dims(arr, axis=0)           # (1, 256, 256, 3)

    probs = model.predict(arr, verbose=0)[0]    # (5,)
    idx   = int(np.argmax(probs))

    return {
        "prediction": CLASSES[idx],
        "confidence": round(float(probs[idx]) * 100, 2),
        "all_scores": {cls: round(float(p) * 100, 2) for cls, p in zip(CLASSES, probs)},
    }


# ─────────────────────────────────────────────
# 9.  MAIN
# ─────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  Retinex — EfficientNetB3 Training Pipeline")
    print(f"  TensorFlow {tf.__version__}")
    print("=" * 60)

    # GPU check
    gpus = tf.config.list_physical_devices("GPU")
    print(f"[HW] GPUs available: {len(gpus)}")
    if gpus:
        tf.config.experimental.set_memory_growth(gpus[0], True)

    # ── Data ──
    train_gen, val_gen = build_generators(CONFIG)

    # ── Model ──
    model, base = build_model(
        img_size=CONFIG["img_size"],
        num_classes=NUM_CLASSES,
        dropout=CONFIG["dropout"],
        dense_units=CONFIG["dense_units"],
    )
    model = compile_model(model, lr=CONFIG["learning_rate"])

    # ── Safe Class Weights (Stops collapse) ──
    print("\n[INFO] Using Safe Class Weights to prevent bias…")
    class_weights = {
        0: 1.0,
        1: 1.5,
        2: 1.5,
        3: 2.0,
        4: 2.0
    }
    print(f"[INFO] Class Weights: {class_weights}")

    # ── Phase 1: Stable Warm-up (frozen base) ──
    print(f"\n[TRAIN] Phase 1 — Head Warm-up (3 epochs, LR={CONFIG['learning_rate']})…")
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=CONFIG["epochs_p1"],
        class_weight=class_weights,
        callbacks=make_callbacks(CONFIG["model_path"]),
    )

    # ── Phase 2: The Breakthrough (unfrozen layers) ──
    if CONFIG.get("fine_tune", False):
        ft_history = fine_tune_model(model, base, train_gen, val_gen, CONFIG, class_weights=class_weights)
    else:
        print("\n[INFO] Fine-tuning skipped (set fine_tune=True to reach 70%+).")

    # ── Results ──
    plot_history(history, CONFIG["history_png"])

    val_loss, val_acc = model.evaluate(val_gen, verbose=1)
    print(f"\n[RESULT] Validation Accuracy : {val_acc * 100:.2f}%")
    print(f"[RESULT] Validation Loss     : {val_loss:.4f}")

    # ── Save (ensure it's the best checkpoint) ──
    if not os.path.exists(CONFIG["model_path"]):
        model.save(CONFIG["model_path"])
    print(f"\n[SAVE] Model saved → {CONFIG['model_path']}")

    # ── Quick test prediction ──
    print("\n[TEST] Running a dummy prediction to verify the saved model…")
    saved_model = tf.keras.models.load_model(CONFIG["model_path"], compile=False)
    dummy_img   = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
    result      = predict_image(saved_model, dummy_img, img_size=CONFIG["img_size"])
    print(f"[TEST] Result: {json.dumps(result, indent=2)}")
    print("\n✅ Pipeline complete.")


if __name__ == "__main__":
    main()
