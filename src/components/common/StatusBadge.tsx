import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`dashboard__status dashboard__status--${status.toLowerCase()}`}>
    {status}
  </span>
);

export default StatusBadge;
