@echo off
echo ----------------------------------------
echo   🏏 Setting up IPL Backend Environment
echo ----------------------------------------

:: Step 1: Create virtual environment using Python 3.10
echo [1/5] Creating virtual environment with Python 3.10...
""C:\Users\Admin\AppData\Local\Programs\Python\Python310\python.exe"" -m venv venv

:: Step 2: Activate virtual environment
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

:: Step 3: Upgrade pip
echo [3/5] Upgrading pip...
python -m pip install --upgrade pip

:: Step 4: Install dependencies
echo [4/5] Installing required libraries...
pip install flask==2.3.2 flask-cors==3.0.10 numpy==1.24.3 scikit-learn==1.3.0

:: Step 5: Launching Flask app
echo [5/5] Running your Flask app...
python app.py

pause
