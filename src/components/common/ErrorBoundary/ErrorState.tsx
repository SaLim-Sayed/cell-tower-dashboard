import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="dashboard dashboard--error">
    <div className="container">
      <div className="error-state">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button
          className="button button--primary"
          onClick={onRetry}
          aria-label="Retry loading dashboard data"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default ErrorState;
