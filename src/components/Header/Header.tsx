// src/components/Header/Header.tsx
import React, { memo } from 'react';
 import './Header.scss';
import type { BaseComponentProps } from '../../types/dashboard.types';

interface HeaderProps extends BaseComponentProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = memo(({ 
  title = "Cell Tower Dashboard",
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="header__title">{title}</h1>
          </div>
          
          <nav className="header__nav" role="navigation" aria-label="Main navigation">
            <div className="header__status">
              <span className="header__status-indicator header__status-indicator--online" />
              <span className="header__status-text">System Online</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;