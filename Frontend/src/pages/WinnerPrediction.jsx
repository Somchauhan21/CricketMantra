// frontend/src/pages/WinnerPrediction.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import logos from '../utils/logoMap';
import './WinnerPrediction.css';

const displayTeams = [
  'Chennai Super Kings',
  'Delhi Capitals',
  'Punjab Kings',
  'Kolkata Knight Riders',
  'Mumbai Indians',
  'Rajasthan Royals',
  'Royal Challengers Bangalore',
  'Sunrisers Hyderabad',
  'Gujarat Titans',
  'Lucknow Super Giants'
];

const cities = [
  'Hyderabad','Bangalore','Mumbai','Indore','Kolkata','Delhi','Chandigarh',
  'Jaipur','Chennai','Cape Town','Port Elizabeth','Durban','Centurion',
  'East London','Johannesburg','Kimberley','Bloemfontein','Ahmedabad',
  'Cuttack','Nagpur','Dharamsala','Visakhapatnam','Pune','Raipur','Ranchi',
  'Abu Dhabi','Sharjah','Mohali'
];

// Friendly → model team‐name conversions
const backendTeamMap = {
  'Delhi Capitals':         'Delhi Daredevils',
  'Punjab Kings':           'Kings XI Punjab',
  'Gujarat Titans':         'Chennai Super Kings',
  'Lucknow Super Giants':   'Kings XI Punjab'
};

// Friendly → model city‐name conversions (add or override as needed)
const backendCityMap = {
  // If the model expects exactly "Ahmedabad", this maps it correctly.
  // If your backend expects a different string, change the right‐hand side.
  'Ahmedabad': 'Mumbai',
  // Example: if backend needed lowercase or a code (uncomment and adapt):
  // 'Dubai': 'dubai_code',
  // 'Sharjah': 'Sharjah',
  // You can add more overrides here if the backend’s expected city name differs.
};

export default function WinnerPrediction() {
  const [form, setForm] = useState({
    batting_team: '',
    bowling_team: '',
    city: '',
    target: '',
    score: '',
    overs: '',
    wickets: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Splash‐screen loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    // Prevent same‐team selection
    if (form.batting_team === form.bowling_team) {
      setError("Batting and bowling teams must differ");
      return;
    }
    if (!form.city) {
      setError("Please select a city");
      return;
    }
    setError('');
    setSubmitting(true);

    // Remap display → backend for teams and city
    const payload = {
      // Team name remaps
      batting_team: backendTeamMap[form.batting_team] || form.batting_team,
      bowling_team: backendTeamMap[form.bowling_team] || form.bowling_team,

      // City remap (Ahmedabad or any other override)
      city: backendCityMap[form.city] || form.city,

      target: form.target,
      score: form.score,
      overs: form.overs,
      wickets: form.wickets
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/predict-winner`,
        payload
      );
      setPrediction(data);
    } catch (e) {
      console.error("Prediction error:", e.response || e);
      setError('Failed to fetch prediction. Please check inputs/backend.');
      setPrediction(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p className="loading-text">Loading Predictor…</p>
      </div>
    );
  }

  return (
    <div className="winner-prediction-page">
      <h2 className="page-title">🏆 IPL Winner Predictor 2025</h2>
      <Navbar />

      <div className="winner-content">
        {/* ⚾ Batting logo on LEFT */}
        <div className="team-box batting-box">
          {form.batting_team && (
            <img src={logos[form.batting_team]} alt={form.batting_team} />
          )}
        </div>

        {/* 📝 The form */}
        <div className="form-section">
          {/* TEAM & CITY SELECTORS */}
          {['batting_team','bowling_team','city'].map(field => (
            <div className="input-row" key={field}>
              <label>
                {field.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
              </label>
              <select
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select</option>
                {(field === 'city' ? cities : displayTeams).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* NUMERIC INPUTS */}
          {['target','score','overs','wickets'].map(field => (
            <div className="input-row" key={field}>
              <label>
                {field.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
              </label>
              <input
                type="number"
                name={field}
                step={field==='overs' ? '0.1' : '1'}
                value={form[field]}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          ))}

          {/* PREDICT BUTTON */}
          <button
            className="predict-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Predicting…' : '⚡ Predict Winner'}
          </button>

          {/* ERROR MESSAGE */}
          {error && <p className="error">{error}</p>}

          {/* PREDICTION RESULT */}
          {prediction && (
            <div className="prediction-result">
              <h3>Prediction Summary:</h3>
              <p>
                <b>{form.batting_team}</b> needs{' '}
                <b>{prediction.runs_left}</b> runs in{' '}
                <b>{prediction.balls_left}</b> balls with{' '}
                <b>{prediction.wickets_left}</b> wickets left.
              </p>
              <p>
                <b>{form.batting_team}</b>: {prediction.win_percent}% —{' '}
                <b>{form.bowling_team}</b>: {prediction.loss_percent}%
              </p>
            </div>
          )}
        </div>

        {/* 🎳 Bowling logo on RIGHT */}
        <div className="team-box bowling-box">
          {form.bowling_team && (
            <img src={logos[form.bowling_team]} alt={form.bowling_team} />
          )}
        </div>
      </div>
    </div>
  );
}
