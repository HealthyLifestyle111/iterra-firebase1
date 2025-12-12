import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Iterra Oils</h1>
        <p className="tagline">Discover Natural Wellness with doTERRA Essential Oils</p>
      </header>

      <section className="teasers">
        <div className="teaser-card">
          <h3>🌿 Pure Essential Oils</h3>
          <p>Experience the highest quality essential oils sourced from around the world.</p>
        </div>
        <div className="teaser-card">
          <h3>💚 Natural Wellness</h3>
          <p>Support your health naturally with therapeutic-grade essential oils.</p>
        </div>
        <div className="teaser-card">
          <h3>🏠 Home & Family</h3>
          <p>Create a healthier home environment with pure, effective solutions.</p>
        </div>
      </section>

      <section className="cta-section">
        <button 
          className="shop-button"
          onClick={() => navigate('/go/default')}
        >
          Shop Oils
        </button>
        <p className="associate-link">
          Are you an associate? <a href="/associate">Sign up here</a>
        </p>
      </section>
    </div>
  );
}

export default Home;
