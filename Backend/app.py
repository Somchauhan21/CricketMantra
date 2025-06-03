from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import requests

app = Flask(__name__)
CORS(app, origins=["https://cricketmantra-617n.onrender.com"])

# Load models
with open("models/winner_model.pkl", "rb") as f:
    winner_model = pickle.load(f)

with open("models/score_model.pkl", "rb") as f:
    score_model = pickle.load(f)
#api integration 
app = Flask(__name__)
CORS(app)

API_KEY = '2ddff439-58de-4c1c-b6a6-71c09dd5d01c'
BASE_URL = 'https://api.cricapi.com/v1'

@app.route('/api/upcoming-matches', methods=['GET'])
def get_upcoming_matches():
    url = f"{BASE_URL}/matches?apikey={API_KEY}&offset=0"
    try:
        response = requests.get(url)
        print("Raw response:", response.text)  # Add this line
        response.raise_for_status()  # Will raise an exception for HTTP errors
        data = response.json()
        matches = data.get('data', [])
        return jsonify(matches)
    except Exception as e:
        print("Error in /api/upcoming-matches:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/live-scores', methods=['GET'])
def get_live_scores():
    url = f"{BASE_URL}/cricScore?apikey={API_KEY}"
    try: 
        response = requests.get(url)
        print("Raw response:", response.text)  # Add this line
        response.raise_for_status()  # Will raise an exception for HTTP errors
        data = response.json()
        matches = data.get('data', [])
        return jsonify(matches)
    except Exception as e:
        print("Error in /api/upcoming-matches:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/current-matches', methods=['GET'])
def get_current_matches():
    url = f"{BASE_URL}/currentMatches?apikey={API_KEY}&offset=0"
    try:
        response = requests.get(url)
        print("Raw response:", response.text)  # Add this line
        response.raise_for_status()  # Will raise an exception for HTTP errors
        data = response.json()
        matches = data.get('data', [])
        return jsonify(matches)
    except Exception as e:
        print("Error in /api/upcoming-matches:", e)
        return jsonify({'error': str(e)}), 500
    



@app.route('/predict-winner', methods=['POST'])
def predict_winner():
    try:
        data = request.get_json()
        print("Received data:", data)

        batting_team = data['batting_team']
        bowling_team = data['bowling_team']
        city = data['city']
        target = int(data['target'])
        score = int(data['score'])
        overs = float(data['overs'])
        wickets_out = int(data['wickets'])

        runs_left = target - score
        balls_left = 120 - int(overs * 6)
        wickets_left = 10 - wickets_out
        crr = score / overs
        rrr = (runs_left * 6) / balls_left

        input_df = pd.DataFrame({
            'batting_team': [batting_team],
            'bowling_team': [bowling_team],
            'city': [city],
            'runs_left': [runs_left],
            'balls_left': [balls_left],
            'wickets': [wickets_left],
            'total_runs_x': [target],
            'crr': [crr],
            'rrr': [rrr]
        })

        prediction = winner_model.predict_proba(input_df)
        win = prediction[0][1]
        loss = prediction[0][0]

        return jsonify({
            'batting_team': batting_team,
            'bowling_team': bowling_team,
            'win_percent': round(win * 100),
            'loss_percent': round(loss * 100),
            'runs_left': runs_left,
            'balls_left': balls_left,
            'wickets_left': wickets_left
        })

    except Exception as e:
        print("Error in backend:", e)
        return jsonify({'error': str(e)}), 400
    
@app.route('/predict-score', methods=['POST'])
def predict_score():
    try:
        data = request.get_json()
        print("Received Score Data:", data)

        # One-hot encoding for batting team
        teams = ['Chennai Super Kings', 'Delhi Daredevils', 'Kings XI Punjab', 'Kolkata Knight Riders',
                 'Mumbai Indians', 'Rajasthan Royals', 'Royal Challengers Bangalore', 'Sunrisers Hyderabad']

        batting_encoding = [1 if data['batting_team'] == team else 0 for team in teams]
        bowling_encoding = [1 if data['bowling_team'] == team else 0 for team in teams]

        current_runs = int(data['current_runs'])
        wickets_fallen = int(data['wickets_fallen'])
        current_over = float(data['current_over'])
        runs_in_prev_5 = int(data['runs_in_prev_5'])
        wickets_in_prev_5 = int(data['wickets_in_prev_5'])

        # Final input array
        input_data = np.array([batting_encoding + bowling_encoding + [
            current_runs, wickets_fallen, current_over, runs_in_prev_5, wickets_in_prev_5
        ]])

        # Prediction
        prediction = score_model.predict(input_data)
        predicted_score = int(round(prediction[0]))

        return jsonify({'predicted_score': predicted_score})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

if __name__ == '__main__':
    app.run(debug=True)
