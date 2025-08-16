// src/components/Header/Header.tsx
import React, { memo } from 'react';
import './Header.scss';
import type { BaseComponentProps } from '../../types/dashboard.types';
import logo from '../../../public/antenna.svg';
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
      <div className="container">
        <div className="header__content">
          <div className="header__brand">
            <div className="header__logo">
              {/* svg logo */}
              <img src={logo} alt="" />
            </div>
            <h1 className="header__title">{title}</h1>
          </div>
          
          <div className="header__summary">
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