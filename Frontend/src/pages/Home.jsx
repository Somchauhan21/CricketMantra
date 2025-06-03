// // src/pages/Home.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Home.css';

// const Home = () => {
//   const [upcomingMatches, setUpcomingMatches] = useState([]);
//   const [liveScores, setLiveScores] = useState([]);
//   const [currentMatches, setCurrentMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [upcomingRes, liveRes, currentRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upcoming-matches`),
//           axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/live-scores`),
//           axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/current-matches`),
//         ]);

//         setUpcomingMatches(upcomingRes.data);
//         setLiveScores(liveRes.data);
//         setCurrentMatches(currentRes.data);
//         setError('');
//       } catch (err) {
//         console.error('API Error:', err);
//         setError('Failed to fetch data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>

//       <div className="home-container">
//         <h1>🏏 IPL Dashboard 2025</h1>

//         {loading ? (
//           <p className="loading">Loading data...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <>
//             <section>
//               <h2>Upcoming Matches</h2>
//               <ul>
//                 {upcomingMatches.slice(0, 5).map((match, idx) => (
//                   <li key={idx}>
//                     {match.name} — {match.date}
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             <section>
//               <h2>Live Scores</h2>
//               <ul>
//                 {liveScores.slice(0, 5).map((match, idx) => (
//                   <li key={idx}>
//                     {match.t1} vs {match.t2} — {match.status}
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             <section>
//               <h2>Current Matches</h2>
//               <ul>
//                 {currentMatches.slice(0, 5).map((match, idx) => (
//                   <li key={idx}>
//                     {match.name} — {match.status}
//                   </li>
//                 ))}
//               </ul>
//             </section>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // export default Home;
// src/pages/Home.jsx
// src/pages/Home.jsx
// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';      // ← for navigation
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState({
    upcoming: [], 
    live: [], 
    completed: []
  });
  const heroRef = useRef(null);

  // Fetch matches once on mount
  useEffect(() => {
    (async () => {
      try {
        const [upRes, liveRes, compRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upcoming-matches`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/live-scores`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/current-matches`),
        ]);
        const now = Date.now();
        const upcoming = upRes.data
          .filter(m => new Date(m.date || m.dateTimeGMT) > now)
          .sort((a,b) => new Date(a.date || a.dateTimeGMT) - new Date(b.date || b.dateTimeGMT))
          .slice(0, 4);

        setMatches({
          upcoming,
          live: liveRes.data.slice(0,4),
          completed: compRes.data.slice(0,4),
        });
      } catch (err) {
        console.error('Error fetching matches', err);
      }
    })();
  }, []);

  // Parallax effect for the hero background
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      heroRef.current.style.backgroundPositionY = `${y * 0.5}px`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Renders a single match card depending on the active tab
  const renderCard = (m, i) => {
    if (activeTab === 'live') {
      return (
        <div className="matchCard" key={i}>
          <h3 className="card-title">{m.t1} vs {m.t2}</h3>
          <p className="card-date">{m.dateTimeGMT}</p>
          <p className="card-status live">LIVE</p>
        </div>
      );
    }

    if (activeTab === 'completed') {
      return (
        <div className="matchCard" key={i}>
          <h3 className="card-title">{m.name}</h3>
          <p className="card-date">{m.dateTimeGMT || m.date}</p>
          {Array.isArray(m.score) &&
            m.score.map((inn, idx) => (
              <p className="card-score" key={idx}>
                {inn.inning}: {inn.r}/{inn.w} ({inn.o} ov)
              </p>
            ))
          }
          <p className="card-status done">DONE</p>
        </div>
      );
    }

    // Upcoming matches
    return (
      <div className="matchCard" key={i}>
        <h3 className="card-title">{m.name || m.teams}</h3>
        <p className="card-date">{m.date || m.dateTimeGMT}</p>
        <p className="card-venue">{m.venue || m.venueInfo?.name}</p>
      </div>
    );
  };

  return (
    <div className="home-page">

      {/* Top header (brand + avatar) */}
      <header className="header-top">
        <h1 className="brand">CricketMantra</h1>
        <div className="userAvatar" />
      </header>

      <Navbar />

      {/* Parallax hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>CricketMantra:<br/>Your Ultimate Cricket Prediction Hub</h2>
          <p>Make predictions on upcoming matches with cutting-edge analytics. Earn XP and climb the leaderboard.</p>
          <button
            className="cta"
            onClick={() => navigate('/winner-prediction')}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Tabs (on top of the hero overlay) */}
      <nav className="tabs">
        {['upcoming', 'live', 'completed'].map(tab => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Match cards overlap the bottom of the hero */}
      <main className="cards-grid-container">
        <div className="cards-grid">
          {matches[activeTab]?.length
            ? matches[activeTab].map(renderCard)
            : <p className="loading-text">Loading {activeTab} matches…</p>
          }
        </div>
      </main>

    </div>
  );
}
