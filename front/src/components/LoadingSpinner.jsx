import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-text">Yüklənir...</p>
    </div>
  );
};

export default LoadingSpinner;

