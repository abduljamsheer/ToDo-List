import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">📝 To-Do List</div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="/">Login</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Stay Organized, Stay Productive</h1>
          <p>Track your daily tasks, set priorities, and complete your goals efficiently with our simple and elegant To-Do app.</p>
          <a href="/" className="cta-button">Get Started</a>
        </div>
        <div className="hero-image">
          <img src="https://cdn-icons-png.flaticon.com/512/6190/6190946.png" alt="Task Illustration" />
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 To-Do Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;