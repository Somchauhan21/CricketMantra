// src/components/Navbar.jsx
// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Create this file or move to Home.css if preferred

const Navbar = () => {
  return (
    <nav className="global-navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/winner-prediction" className="nav-link">Winner Prediction</Link>
      <Link to="/score-prediction" className="nav-link">Score Prediction</Link>
    </nav>
  );
};

export default Navbar;
