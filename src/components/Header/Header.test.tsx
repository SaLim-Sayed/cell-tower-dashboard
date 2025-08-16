import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  it('renders with default title', () => {
    render(<Header />);
    expect(screen.getByText('Cell Tower Dashboard')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const mockOnMenuClick = jest.fn();
    render(<Header onMenuClick={mockOnMenuClick} />);
    
    const menuButton = screen.getByText('☰');
    fireEvent.click(menuButton);
    
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('displays user profile section', () => {
    render(<Header />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });
});
