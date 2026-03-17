import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import '../styles/SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 2.5 seconds before starting fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for the fade out animation to finish before calling onComplete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // 500ms should match the transition duration in CSS
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      {/* Subtle background elements */}
      <div className="bg-elements">
        <div className="bg-bubble bubble-1"></div>
        <div className="bg-bubble bubble-2"></div>
        <div className="bg-bubble bubble-3"></div>
      </div>

      <div className="splash-content">
        <div className="icon-container">
          <div className="bot-icon">
            <FaHome />
          </div>
        </div>
        
        <h1 className="splash-title">HostelBot</h1>
        <p className="splash-subtitle">Welcome to your Smart Hostel Assistant</p>
        
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
