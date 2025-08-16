import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner: React.FC = () => (
  <div className="dashboard dashboard__loading">
    <FaSpinner style={{ fontSize: '2rem', color: 'blue' }} />
  </div>
);

export default LoadingSpinner;
