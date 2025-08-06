import React, { useState, useEffect } from 'react';
import "./Intro.css";
import { Link } from 'react-router-dom';

const Intro = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const animatedTexts = [
    "Share your wildest thoughts...",
    "Spill the tea anonymously...",
    "Connect with strangers...",
    "Be completely honest...",
    "No judgment zone..."
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="intro-container">

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🔥 Random Threads
          </h1>
          <div className="animated-subtitle">
            <span className="typing-text">
              {animatedTexts[currentText]}
            </span>
          </div>
          <p className="hero-description">
            The best anonymous platform for babcock students. Where your thoughts matter.
            No filters, no limits, just pure authenticity.
          </p>
          <div className="cta-buttons">
            <Link to="/thread">
            <button className="primary-btn">
              🚀 Start Sharing
            </button>
            </Link>
            <Link to="/thread">
            <button className="secondary-btn">
              👀 Explore Threads
            </button>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="card card-1">💭</div>
            <div className="card card-2">🔥</div>
            <div className="card card-3">💬</div>
            <div className="card card-4">⚡</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Why Random Threads?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🕵️</div>
            <h3>100% Anonymous</h3>
            <p>Share without fear. Your identity stays hidden.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Connection</h3>
            <p>Real-time conversations with other babcock students.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔥</div>
            <h3>Trending Topics</h3>
            <p>Upvote system brings the best content to the top.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💭</div>
            <h3>No Filters</h3>
            <p>Express yourself freely without restrictions.</p>
          </div>
        </div>
      </div>


      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Threads Shared</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100K+</div>
          <div className="stat-label">Upvotes Given</div>
        </div>
      </div>


      <div className="cta-section">
        <h2>Ready to spill the tea?</h2>
        <p>Join other babcock students sharing their thoughts anonymously</p>
        <Link to="/thread">
        <button className="cta-button">
          🚀 Get Started Now
        </button>
        </Link>
      </div>


      <div className="footer">
        <p>🔥 Random Threads - Where authenticity meets anonymity</p>
      </div>
    </div>
  );
};

export default Intro;
