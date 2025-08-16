// Dashboard/Dashboard.tsx
import React, { memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useFilters } from '../../hooks/useFilters';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import Header from '../Header/Header';
import DashboardContent from './DashboardContent';

import './Dashboard.scss';
import dataService from '../../services/dataService';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import ErrorState from '../common/ErrorBoundary/ErrorState';

const Dashboard: React.FC = memo(() => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { dashboardData, loading, error, refetch } = useDashboardData();
  const { filters, filteredTowers, setSearchTerm, setSelectedCity, clearFilters } = useFilters(dashboardData.towers);
  const summary = dataService.calculateSummaryMetrics(dashboardData.towers);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <ErrorBoundary>
      <Header
        totalTowers={summary.totalTowers}
        activeTowers={summary.activeTowers}
        avgSignal={summary.averageSignal.toFixed(1)}
      />
      <div className="dashboard">
        <main className="dashboard__main">
          <div className="container">
            <DashboardContent
              dashboardData={dashboardData}
              filteredTowers={filteredTowers}
              filters={filters}
              isMobile={isMobile}
              setSearchTerm={setSearchTerm}
              setSelectedCity={setSelectedCity}
              clearFilters={clearFilters}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
});

export default Dashboard;
