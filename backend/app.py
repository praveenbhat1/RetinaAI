from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom InputLayer to handle version differences in saved models
class CompatInputLayer(tf.keras.layers.InputLayer):
    def __init__(self, **kwargs):
        # 'batch_shape' is an alias for 'input_shape' in older TF versions
        if 'batch_shape' in kwargs:
            kwargs['input_shape'] = kwargs.pop('batch_shape')[1:]
        super().__init__(**kwargs)

# Load model with custom objects for version compatibility
model = tf.keras.models.load_model(
    "model/retina_model.h5",
    compile=False,
    custom_objects={"InputLayer": CompatInputLayer}
)

classes = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]

def preprocess(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    img = preprocess(image)
    pred = model.predict(img)

    return {
        "prediction": classes[np.argmax(pred)],
        "confidence": float(np.max(pred)) * 100
    }
