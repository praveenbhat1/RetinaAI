# RetinaAI - Diabetic Retinopathy Detection System

## Project Overview

Full-stack medical imaging application that uses deep learning (EfficientNetB3) to detect diabetic retinopathy from retinal fundus images. The system provides classification into 5 severity levels: No DR, Mild, Moderate, Severe, and Proliferative.

**Tech Stack:**
- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS, Three.js for 3D visualizations)
- **Backend**: FastAPI (Python) with TensorFlow/Keras for ML inference
- **Database**: Firebase (authentication and data storage)

## Repository Structure

```
/                    # Next.js frontend root
├── app/            # Next.js App Router pages
├── components/     # React components
├── lib/            # Utility functions
├── context/        # React context providers
└── backend/        # Python FastAPI ML server
    ├── app.py           # FastAPI server with inference endpoint
    ├── train.py         # Model training pipeline (CPU)
    ├── train_gpu.py     # GPU-accelerated training
    ├── model/           # Trained model artifacts (.h5 files)
    └── Dockerfile       # Backend containerization
```

## Build, Run, and Test Commands

### Frontend (Next.js)
```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

### Backend (FastAPI)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server (http://localhost:8000)
uvicorn app:app --reload

# Run in Docker
docker build -t retina-backend .
docker run -p 10000:10000 retina-backend

# Train new model (CPU)
python train.py

# Train with GPU support
python train_gpu.py
```

### Testing Model Predictions
```bash
# Test prediction endpoint
curl -X POST "http://localhost:8000/predict" \
  -F "file=@path/to/retina_image.png"

# Health check
curl http://localhost:8000/
```

## Architecture

### Frontend → Backend Flow
1. User uploads retinal image through Next.js UI
2. Image sent to FastAPI `/predict` endpoint via multipart form-data
3. Backend validates image (brightness, complexity, color signature)
4. If valid, applies CLAHE preprocessing and Test-Time Augmentation (TTA)
5. EfficientNetB3 model runs 4 predictions (original, h-flip, v-flip, rotated)
6. Results averaged and returned with confidence score
7. Frontend displays diagnosis + confidence percentage

### ML Pipeline Components

**Image Preprocessing (Critical for accuracy):**
- CLAHE (Contrast Limited Adaptive Histogram Equalization) applied in LAB color space
- Enhances blood vessel visibility in retinal images
- Must match preprocessing used during training

**Model Architecture:**
- Base: EfficientNetB3 (pretrained on ImageNet)
- Custom head: GlobalAveragePooling2D → BatchNorm → Dense(256) → Dropout(0.5) → Dense(5, softmax)
- Input size: 256×256 (configurable in train.py CONFIG)
- Output: 5-class softmax (No DR, Mild, Moderate, Severe, Proliferative)

**Test-Time Augmentation (TTA):**
- 4-pass prediction strategy in production
- Augmentations: original, horizontal flip, vertical flip, 15° rotation
- Final prediction = average of 4 model outputs
- Improves robustness and reduces false positives

**Training Strategy (train.py):**
1. **Phase 1**: Freeze EfficientNetB3 base, train classification head (5 epochs)
2. **Phase 2**: Unfreeze top 50 layers, fine-tune with very low LR (15 epochs)
3. Class weights applied to handle imbalanced dataset
4. Callbacks: ModelCheckpoint (best val_accuracy), EarlyStopping, ReduceLROnPlateau

## Key Conventions

### Backend (app.py)

1. **Model Loading**: Uses lazy loading pattern with `get_model()` to prevent deployment timeouts on platforms like Render
2. **Version Compatibility Fix**: `load_model_compat()` patches H5 model configs to handle TensorFlow version mismatches (batch_shape vs batch_input_shape)
3. **Image Validation**: `is_retina_image()` performs multi-stage validation before inference:
   - Brightness check (30-220 avg intensity)
   - Structural complexity (std > 15)
   - Color signature (red channel dominance for fundus images)
4. **CLAHE Preprocessing**: Must be applied to match training pipeline - converts RGB→LAB, equalizes L-channel, converts back to RGB
5. **No Rescaling in Preprocessing**: EfficientNetB3 has internal Rescaling layer; preprocessing returns [0-255] range

### Training (train.py)

1. **APTOS Dataset Format**: Uses CSV with columns `id_code` (filename without extension) and `diagnosis` (0-4)
2. **No Manual Rescaling**: ImageDataGenerator does NOT include rescale=1/255 - handled by model's internal layer
3. **CLAHE as preprocessing_function**: Applied during data loading via `preprocessing_function=apply_clahe`
4. **Class Weights**: Hardcoded safe weights {0:1.0, 1:1.5, 2:1.5, 3:2.0, 4:2.0} to prevent model collapse
5. **Two-Phase Training**: Always warm up frozen base before fine-tuning to prevent catastrophic forgetting
6. **Model Output**: Saved as `model/retina_model.h5` or `model/retina_87_model.h5` (higher accuracy checkpoint)

### Frontend (Next.js)

1. **Firebase Integration**: Authentication and data persistence via `context/` providers
2. **3D Visualizations**: Uses React Three Fiber (@react-three/fiber) and Drei (@react-three/drei)
3. **Styling**: Tailwind CSS v4 with custom utilities via clsx and tailwind-merge
4. **TypeScript**: All components should use TypeScript with proper typing
5. **App Router**: Using Next.js 16 App Router (app/ directory, not pages/)

### Deployment

1. **Backend Port**: Environment variable `PORT` defaults to 10000 (Render requirement)
2. **CORS**: Backend allows all origins (`allow_origins=["*"]`) - restrict in production
3. **Model Files**: Must be committed to repo or uploaded separately (not in .gitignore)
4. **Docker**: Backend Dockerfile includes OpenCV system dependencies (libgl1-mesa-glx, libglib2.0-0)

## Important Files

- `backend/app.py`: Main inference server - DO NOT change preprocessing logic without retraining
- `backend/train.py`: Training pipeline - CONFIG dict controls all hyperparameters
- `backend/model/`: Contains trained .h5 models (87% accuracy target)
- `app/layout.tsx`: Root layout with Firebase providers
- `package.json`: Frontend dependencies and scripts
- `backend/requirements.txt`: Python dependencies (TensorFlow CPU by default)

## Medical Context

This is a **medical diagnostic tool** for screening diabetic retinopathy. Code changes should:
- Maintain or improve diagnostic accuracy
- Never bypass image validation checks
- Preserve CLAHE preprocessing pipeline
- Keep confidence threshold warnings (< 20% triggers low-confidence alert)
- Document any changes to model architecture or preprocessing
