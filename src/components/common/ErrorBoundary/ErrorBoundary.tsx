// src/components/common/ErrorBoundary/ErrorBoundary.tsx
 import './ErrorBoundary.scss';
import type { DashboardError } from '../../../types/dashboard';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const dashboardError: DashboardError = {
    code: 'RENDER_ERROR',
    message: error.message,
    details: error.stack || '',
  };

  return (
    <div className="error-boundary">
      <div className="error-boundary__content">
        <div className="error-boundary__icon">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="error-boundary__title">Something went wrong</h2>
        <p className="error-boundary__message">
          {dashboardError.message || 'An unexpected error occurred'}
        </p>
        <div className="error-boundary__actions">
          <button
            onClick={resetErrorBoundary}
            className="error-boundary__button error-boundary__button--primary"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="error-boundary__button error-boundary__button--secondary"
          >
            Reload Page
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={(props) =>
        fallback ? <>{fallback}</> : <DefaultFallback {...props} />
      }
      onError={(error, info) => {
        console.error('ErrorBoundary caught an error:', error, info);
        // logErrorToService(error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
