import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryCards from './SummaryCards';

describe('SummaryCards Component', () => {
  const mockCards = [
    {
      title: 'Total Towers',
      value: '1,234',
      icon: '🏗️',
      trend: {
        value: 12.5,
        isPositive: true,
      },
    },
    {
      title: 'Active Alerts',
      value: '24',
      icon: '⚠️',
      trend: {
        value: 5.2,
        isPositive: false,
      },
    },
  ];

  it('renders the correct number of cards', () => {
    render(<SummaryCards cards={mockCards} />);
    const cards = screen.getAllByTestId('summary-card');
    expect(cards).toHaveLength(mockCards.length);
  });

  it('displays the correct card titles and values', () => {
    render(<SummaryCards cards={mockCards} />);
    
    mockCards.forEach(card => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.value)).toBeInTheDocument();
    });
  });

  it('shows trend indicators when provided', () => {
    render(<SummaryCards cards={mockCards} />);
    
    mockCards.forEach(card => {
      if (card.trend) {
        const trendText = `${card.trend.isPositive ? '↑' : '↓'} ${Math.abs(card.trend.value)}%`;
        expect(screen.getByText(trendText)).toBeInTheDocument();
      }
    });
  });

  it('renders icons correctly', () => {
    render(<SummaryCards cards={mockCards} />);
    
    mockCards.forEach(card => {
      expect(screen.getByText(card.icon)).toBeInTheDocument();
    });
  });
});
