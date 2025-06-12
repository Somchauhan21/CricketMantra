# CricketMantra

**CricketMantra** is a real-time IPL (Indian Premier League) prediction platform—built for cricket fans who want live analytics on match outcomes and final scores. Powered by machine learning (scikit-learn) on the backend (Flask) and a dynamic React frontend, CricketMantra gives you winner-probability and score forecasts at the click of a button.

Live demo: https://cricketmantra-617n.onrender.com

---

## 🚀 Features

- **Winner Prediction**  
  Machine-learning model trained on historical IPL data to estimate each team’s win probability in real time.

- **Score Prediction**  
  Regression model forecasts final total (±5 runs) based on current runs, overs, wickets, and recent momentum.

- **Match Dashboard**  
  Tabbed view of Upcoming, Live, and Completed matches—so you never miss a moment.

- **Parallax Hero & Animations**  
  Interactive UI with parallax hero section and animated cards to keep you engaged.

- **Easy Deployment**  
  Deployed on Render for zero-devops overhead—just push your code and it scales automatically.

---

## 🛠️ Tech Stack

| Layer        | Technology            |
| ------------ | --------------------- |
| **Backend**  | Python, Flask         |
| **ML Models**| scikit-learn, pickle  |
| **Frontend** | React, Vite           |
| **Styling**  | CSS animations        |
| **Deployment** | Render              |
| **Versioning** | Git & Git LFS        |

---

## 📋 Prerequisites

- **Node.js** v16 or higher  
- **npm** (comes with Node)  
- **Python** 3.8 or higher  
- **pip** (Python package manager)  

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Somchauhan21/CricketMantra.git
cd CricketMantra
2. Install Git LFS & pull models
We use Git LFS to store the large .pkl model files.

bash
Copy
# Install Git LFS (one-time per machine)
git lfs install

# Fetch LFS objects (your model .pkl files)
git lfs pull
3. Backend setup
bash
Copy
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Create a .env file in backend/ if you need to override defaults
# For example, to run on a custom port:
# FLASK_RUN_PORT=5000

# Run the Flask API
flask run
# By default, it runs on http://127.0.0.1:5000
4. Frontend setup
In a new terminal:

bash
Copy
cd ../frontend

# Install dependencies
npm install

# If you want to point to a custom API URL, create .env in frontend/:
# REACT_APP_API_URL=http://localhost:5000

# Run the React dev server
npm run dev
# The app opens at http://localhost:5173
Open your browser to http://localhost:5173 to view CricketMantra!

📂 Project Structure
lua
Copy
CricketMantra/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── winner_model.pkl
│   │   └── score_model.pkl
│   └── (other backend files…)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── WinnerPrediction.jsx
│   │   │   └── ScorePrediction.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitattributes      # Git LFS config
├── .gitignore
├── README.md
└── LICENSE
🎉 Enjoy & Contribute
Feel free to explore, give feedback, or open issues if you find bugs. If you’d like to extend the models or improve the UI, forks and Pull Requests are very welcome!

© 2025 CricketMantra. All rights reserved.
