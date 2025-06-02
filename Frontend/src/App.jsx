// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ScorePrediction from "./pages/ScorePrediction";
import WinnerPrediction from "./pages/WinnerPrediction";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/score-prediction" element={<ScorePrediction />} />
        <Route path="/winner-prediction" element={<WinnerPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
