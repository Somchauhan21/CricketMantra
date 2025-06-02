// src/pages/ScorePrediction.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import logos from '../utils/logoMap';
import './ScorePrediction.css';

const displayTeams = [
  'Chennai Super Kings',
  'Delhi Capitals',               // show this
  'Punjab Kings',
  'Kolkata Knight Riders',
  'Mumbai Indians',
  'Rajasthan Royals',
  'Royal Challengers Bangalore',
  'Sunrisers Hyderabad',
  'Gujarat Titans',
  'Lucknow Super Giants'
];

// map frontend label → what the backend actually expects
const backendTeamMap = {
  'Delhi Capitals': 'Delhi Daredevils',
  'Gujarat Titans' : 'Chennai Super Kings',
  'Lucknow Super Giants':'Kings XI Punjab',
  'Punjab Kings':'Kings XI Punjab' 
  // you can add more overrides here if names diverge
};

export default function ScorePrediction() {
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [currentOver, setCurrentOver] = useState('');
  const [currentRuns, setCurrentRuns] = useState('');
  const [wicketsFallen, setWicketsFallen] = useState('');
  const [runsInPrev5, setRunsInPrev5] = useState('');
  const [wicketsInPrev5, setWicketsInPrev5] = useState('');
  const [predictedScore, setPredictedScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // fake loader so we get our spin screen briefly
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    // prevent same‐team
    if (battingTeam === bowlingTeam) {
      setError("Batting and bowling teams must differ");
      return;
    }
    setError('');

    // pick override if needed
    const batForBackend = backendTeamMap[battingTeam] || battingTeam;
    const bowlForBackend = backendTeamMap[bowlingTeam] || bowlingTeam;

    try {
      const { data } = await axios.post(
        'http://127.0.0.1:5000/predict-score',
        {
          batting_team: batForBackend,
          bowling_team: bowlForBackend,
          current_over: Number(currentOver),
          current_runs: Number(currentRuns),
          wickets_fallen: Number(wicketsFallen),
          runs_in_prev_5: Number(runsInPrev5),
          wickets_in_prev_5: Number(wicketsInPrev5)
        }
      );
      setPredictedScore(data.predicted_score);
    } catch (e) {
      console.error(e);
      setError('Something went wrong – check your inputs or backend');
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
    <div className="score-prediction-page">
      <h2 className="title">🏏 IPL Score Predictor 2025</h2>
      <Navbar />

      <div className="score-content">
        {/* Left logo */}
        <div className="team-box batting-box">
          {battingTeam && <img src={logos[battingTeam]} alt={battingTeam} />}
        </div>

        {/* The form */}
        <div className="form-section">
          {/* Batting Team */}
          <div className="input-row">
            <label>Batting Team</label>
            <select
              value={battingTeam}
              onChange={e => setBattingTeam(e.target.value)}
            >
              <option value="">Select</option>
              {displayTeams.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Bowling Team */}
          <div className="input-row">
            <label>Bowling Team</label>
            <select
              value={bowlingTeam}
              onChange={e => setBowlingTeam(e.target.value)}
            >
              <option value="">Select</option>
              {displayTeams.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* The rest */}
          <div className="input-row">
            <label>Current Over</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={currentOver}
              onChange={e => setCurrentOver(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>Current Runs</label>
            <input
              type="number"
              value={currentRuns}
              onChange={e => setCurrentRuns(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>Wickets Fallen</label>
            <input
              type="number"
              min="0"
              max="10"
              value={wicketsFallen}
              onChange={e => setWicketsFallen(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>Runs in Last 5 Overs</label>
            <input
              type="number"
              value={runsInPrev5}
              onChange={e => setRunsInPrev5(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>Wickets in Last 5 Overs</label>
            <input
              type="number"
              value={wicketsInPrev5}
              onChange={e => setWicketsInPrev5(e.target.value)}
            />
          </div>

          <button className="predict-btn" onClick={handleSubmit}>
            🎯 Predict Score
          </button>
          {error && <p className="error">{error}</p>}

          {predictedScore !== null && (
            <div className="prediction-result">
              <h3>Predicted Range:</h3>
              <p>
                {predictedScore - 5} – {predictedScore + 5}
              </p>
            </div>
          )}
        </div>

        {/* Right logo */}
        <div className="team-box bowling-box">
          {bowlingTeam && <img src={logos[bowlingTeam]} alt={bowlingTeam} />}
        </div>
      </div>
    </div>
  );
}
