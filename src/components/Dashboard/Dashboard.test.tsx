import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  it('renders the dashboard with title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Cell Tower Dashboard')).toBeInTheDocument();
  });

  it('has the correct class names', () => {
    const { container } = render(<Dashboard />);
    expect(container.querySelector('.dashboard')).toBeInTheDocument();
    expect(container.querySelector('.dashboard-content')).toBeInTheDocument();
  });
});
