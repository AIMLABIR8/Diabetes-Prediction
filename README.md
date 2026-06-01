# 🩺 DiaSense AI - Diabetes Prediction App

A full-stack web application for predicting diabetes risk using Machine Learning. Built with a **FastAPI backend** and a **modern frontend** featuring Firebase authentication, animations, and responsive UI.

---

## 🚀 Features

* 🤖 **Machine Learning Model**
  Random Forest classifier trained on diabetes dataset (high accuracy)

* ⚡ **FastAPI Backend**
  Lightweight and high-performance REST API

* 🎨 **Modern Landing Page**
  Glassmorphism UI with particle animations

* 🔐 **Firebase Authentication**

  * Email/Password login
  * Google Sign-In

* 🌌 **3D Loading Animation**
  Three.js-based universe transition screen

* 📊 **Real-time Prediction**
  Instant diabetes risk analysis

* 📱 **Responsive Design**
  Works across desktop and mobile devices

* 🌈 **RGB Effects**
  Dynamic animated branding visuals

* ℹ️ **Information Modal**
  Explains app functionality and usage

* 🧠 **Session Management**
  Secure login state using Firebase + localStorage

---

## 📁 Project Structure

```
Diabetes_Prediction/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── diabetes.csv
│
└── frontend/
    ├── main.html
    ├── main-style.css
    ├── login.html
    ├── login-style.css
    ├── loading.html
    ├── index.html
    ├── styles.css
    └── script.js
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

* Python 3.8+
* Web Browser (Chrome recommended)

---

## 🧠 Backend Setup

```bash
cd backend
```

### 1. Create virtual environment

```bash
python -m venv venv
```

### 2. Activate environment

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add dataset

Place `diabetes.csv` inside `/backend` folder.

### 5. Run server

```bash
python main.py
```

📍 Server runs at:

```
http://localhost:8000
```

---

## 🌐 Frontend Setup

### Option 1: Direct Open

Open:

```
frontend/main.html
```

### Option 2: Run Local Server

```bash
cd frontend
python -m http.server 3000
```

Visit:

```
http://localhost:3000
```

---

## 🔄 Application Flow

1. **Landing Page** → `main.html`
2. **Login Page** → `login.html`
3. **Loading Animation** → `loading.html`
4. **Dashboard** → `index.html`

---

## 📡 API Endpoints

### 🔹 GET `/`

API info

### 🔹 GET `/health`

Health check

### 🔹 POST `/predict`

#### Request:

```json
{
  "pregnancies": 6,
  "glucose": 148,
  "blood_pressure": 72,
  "skin_thickness": 35,
  "insulin": 0,
  "bmi": 33.6,
  "diabetes_pedigree_function": 0.627,
  "age": 50
}
```

#### Response:

```json
{
  "prediction": 1,
  "probability": 0.85,
  "result": "Diabetic"
}
```

---

### 🔹 POST `/retrain`

Retrains the ML model

---

## 🧠 Model Information

* **Algorithm**: Random Forest Classifier
* **Features**: 8 health metrics
* **Target**: Binary (Diabetic / Not Diabetic)
* **Scaler**: StandardScaler

---

## 📊 Dataset Format

| Pregnancies | Glucose | BloodPressure | SkinThickness | Insulin | BMI  | DPF   | Age | Outcome |
| ----------- | ------- | ------------- | ------------- | ------- | ---- | ----- | --- | ------- |
| 6           | 148     | 72            | 35            | 0       | 33.6 | 0.627 | 50  | 1       |

---

## ⚠️ Notes

* If dataset is missing → sample data is used
* Model auto-trains on startup
* Saved files:

  * `diabetes_model.joblib`
  * `scaler.joblib`

---

## ⚠️ Disclaimer

This project is for **educational purposes only**.
It should NOT replace professional medical advice.

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* Python
* scikit-learn
* pandas, numpy

### Frontend

* HTML, CSS, JavaScript

### ML

* Random Forest
* StandardScaler

### Auth

* Firebase Authentication

### Animations

* Three.js
* CSS animations

---

## 📄 License

This project is for educational use only.

---

## 🌟 Author

Developed with ❤️ by **Abir Rakshit**

AI, Machine Learning, Python & Data Science Enthusiast

I built this project to showcase:

* Full-stack development skills
* AI/ML integration capability
* Real-world problem solving
* Scalable system design

---

## ⭐ Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 📢 Share it

---
