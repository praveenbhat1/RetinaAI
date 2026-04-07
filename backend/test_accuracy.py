import os
import csv
import random
import requests

MODEL_DIR = "/Users/praveenbhat/Documents/RetinaAI/backend/model"
CSV_PATH = os.path.join(MODEL_DIR, "train_1.csv")
IMG_DIR = os.path.join(MODEL_DIR, "train_images", "train_images")

APTOS_MAP = {"0": "No DR", "1": "Mild", "2": "Moderate", "3": "Severe", "4": "Proliferative"}

data_by_class = {v: [] for v in APTOS_MAP.values()}

with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        class_name = APTOS_MAP.get(row['diagnosis'])
        if class_name:
            data_by_class[class_name].append(row['id_code'])

print("=== Retina AI Model Accuracy Testing ===")
url = "http://localhost:8000/predict"
results = []
correct = 0

for class_name, id_codes in data_by_class.items():
    if not id_codes:
        continue
    
    # Sample 4 images per class
    sampled_ids = random.sample(id_codes, min(4, len(id_codes)))
    for sample_id in sampled_ids:
        img_path = os.path.join(IMG_DIR, f"{sample_id}.png")
        
        if not os.path.exists(img_path):
            continue
            
        with open(img_path, "rb") as f:
            files = {"file": (os.path.basename(img_path), f, "image/png")}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            data = response.json()
            pred_label = data.get("prediction")
            conf = data.get("confidence")
            
            is_match = (pred_label == class_name)
            if is_match:
                correct += 1
                
            print(f"[{'PASS' if is_match else 'FAIL'}] True: {class_name:<15} | Predicted: {pred_label:<15} (Conf: {conf:.2f}%)")
            
print(f"\nFinal Test Accuracy: {correct}/20")
