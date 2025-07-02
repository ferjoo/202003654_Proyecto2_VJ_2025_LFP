import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string | null;
  onClear: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-display">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        <button className="error-close" onClick={onClear}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay; 