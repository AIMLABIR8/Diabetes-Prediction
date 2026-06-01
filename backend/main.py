from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

app = FastAPI(title="Diabetes Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input model
class DiabetesInput(BaseModel):
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int

# Global variables for model and scaler
model = None
scaler = None

def train_model():
    """Train the model using the diabetes dataset"""
    global model, scaler
    
    # Load the dataset
    try:
        df = pd.read_csv('diabetes.csv', on_bad_lines='skip')
    except FileNotFoundError:
        # If file doesn't exist, create sample data for demonstration
        print("diabetes.csv not found. Using sample data for demonstration.")
        # This is sample data - in production, you should have the actual dataset
        data = {
            'Pregnancies': [6, 1, 8, 1, 0, 5, 3, 10, 2, 0],
            'Glucose': [148, 85, 183, 89, 137, 116, 78, 115, 197, 118],
            'BloodPressure': [72, 66, 64, 66, 40, 74, 50, 0, 70, 84],
            'SkinThickness': [35, 29, 0, 23, 35, 0, 32, 0, 45, 0],
            'Insulin': [0, 0, 0, 94, 168, 0, 88, 0, 543, 0],
            'BMI': [33.6, 26.6, 23.3, 28.1, 43.1, 25.6, 31.0, 35.3, 30.5, 45.8],
            'DiabetesPedigreeFunction': [0.627, 0.351, 0.672, 0.167, 2.288, 0.201, 0.248, 0.134, 0.158, 0.551],
            'Age': [50, 31, 32, 21, 33, 30, 26, 29, 53, 40],
            'Outcome': [1, 0, 1, 0, 1, 0, 0, 0, 1, 1]
        }
        df = pd.DataFrame(data)
    
    # Separate features and target
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")
    
    # Save the model and scaler
    joblib.dump(model, 'diabetes_model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    
    return accuracy

def load_model():
    """Load the trained model and scaler"""
    global model, scaler
    
    if os.path.exists('diabetes_model.joblib') and os.path.exists('scaler.joblib'):
        model = joblib.load('diabetes_model.joblib')
        scaler = joblib.load('scaler.joblib')
        print("Model and scaler loaded successfully")
    else:
        print("Training new model...")
        train_model()

# Load model on startup
@app.on_event("startup")
def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "Diabetes Prediction API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict")
def predict_diabetes(input_data: DiabetesInput):
    """Predict diabetes based on input features"""
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Convert input to numpy array
    features = np.array([[
        input_data.pregnancies,
        input_data.glucose,
        input_data.blood_pressure,
        input_data.skin_thickness,
        input_data.insulin,
        input_data.bmi,
        input_data.diabetes_pedigree_function,
        input_data.age
    ]])
    
    # Scale the features
    features_scaled = scaler.transform(features)
    
    # Make prediction
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][1]
    
    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "result": "Diabetic" if prediction == 1 else "Not Diabetic"
    }

@app.post("/retrain")
def retrain_model():
    """Retrain the model with current data"""
    accuracy = train_model()
    return {"message": "Model retrained successfully", "accuracy": accuracy}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
