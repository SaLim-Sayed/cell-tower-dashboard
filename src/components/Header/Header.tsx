// src/components/Header/Header.tsx
import React, { memo } from 'react';
import './Header.scss';
import type { BaseComponentProps } from '../../types/dashboard';
interface HeaderProps extends BaseComponentProps {
  title?: string;
  totalTowers?: number;
  activeTowers?: number;
  avgSignal?: string | number;
}

const Header: React.FC<HeaderProps> = memo(({ 
  title = "Cell Tower Dashboard",
  totalTowers = 0,
  activeTowers = 0,
  avgSignal = 0,
  className = '',
  testId = 'dashboard-header'
}) => {
  return (
    <header 
      className={`header ${className}`}
      data-testid={testId}
    >
      <div data-testid="header-container" className="container">
        <div data-testid="header-content" className="header__content">
          <div data-testid="header-brand" className="header__brand">
            <div data-testid="header-logo" className="header__logo">
              {/* svg logo */}
              <img role="img" src={'../../../public/antenna.png'} alt="" width={50} height={50} />
            </div>
            <h1 className="header__title">{title}</h1>
          </div>
          
          <div data-testid="header-summary" className="header__summary">
            <div className="summary-card">
              <span className="summary-card__label">Total</span>
              <span className="summary-card__value">{totalTowers}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Active</span>
              <span className="summary-card__value">{activeTowers}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Signal</span>
              <span className="summary-card__value">{avgSignal}/5</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;