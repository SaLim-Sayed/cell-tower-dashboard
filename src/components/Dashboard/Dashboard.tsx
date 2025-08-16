/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useFilters } from '../../hooks/useFilters';
import Header from '../Header/Header';
import Filters from '../Filters/Filters';
import DataTable, { type Column } from '../DataTable/DataTable';
import BarChart from '../Charts/BarChart/BarChart';
import PieChart from '../Charts/PieChart/PieChart';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import { dataService } from '../../services/dataService';
import './Dashboard.scss';
import StarRatings from 'react-star-ratings';
import type { CellTower } from '../../types/dashboard';
import { useMediaQuery } from 'react-responsive';
import DataCards from '../DataTable/DataCards';
import { FaSpinner } from 'react-icons/fa';

const Dashboard: React.FC = memo(() => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { dashboardData, loading, error, refetch } = useDashboardData();
  const { filters, filteredTowers, setSearchTerm, setSelectedCity, clearFilters } = useFilters(dashboardData.towers);
   const cities = dataService.getUniqueCities(dashboardData.towers);
   const summary = dataService.calculateSummaryMetrics(dashboardData.towers);

  const columns: Column<CellTower>[] = [
    { header: 'Name', accessor: 'name', sortable: true, sortKey: 'name' },
    { header: 'City', accessor: 'city', sortable: true, sortKey: 'city' },
    { header: 'Network Type', accessor: 'networkType', sortable: true, sortKey: 'networkType' },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      sortKey: 'status',
      render: (row: CellTower) => (
        <span className={`dashboard__status dashboard__status--${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Signal Strength",
      accessor: 'signalStrength',
      sortable: true,
      sortKey: 'signalStrength',
      render: (row: CellTower) => (
        <StarRatings
          rating={row.signalStrength}
          starRatedColor="gold"
          numberOfStars={5}
          starDimension="20px"
          starSpacing="2px"
          name={`signal-${row.id}`}
        />
      ),
    },
  ];


  if (loading) {
    return (
      <div className="dashboard dashboard__loading">
        <FaSpinner style={{ fontSize: '2rem', color: 'blue' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard dashboard--error">
        <div className="container">
          <div className="error-state">
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <button
              className="button button--primary"
              onClick={refetch}
              aria-label="Retry loading dashboard data"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <ErrorBoundary>
       <div className="dashboard">
        <Header
          totalTowers={summary.totalTowers}
          activeTowers={summary.activeTowers}
          avgSignal={summary.averageSignal.toFixed(1)}
        />

        <main className="dashboard__main">
          <div className="container">
          <div className="dashboard__charts-container">
                  <div className="dashboard__chart">
                    <h3 className="dashboard__chart-title">Towers by City</h3>
                    <BarChart
                      data={dashboardData.chartData.towersByCity}
                      testId="towers-by-city-chart"
                    />
                  </div>

                  <div className="dashboard__chart">
                    <h3 className="dashboard__chart-title">Status Distribution</h3>
                    <PieChart
                      data={dashboardData.chartData.statusDistribution}
                      testId="status-distribution-chart"
                    />
                  </div>
                </div>

            <div className="dashboard__content">
              <Filters
                filters={filters}
                cities={cities}
                // @ts-ignore
                onFiltersChange={{
                  setSearchTerm,
                  setSelectedCity
                }}
                onClearFilters={clearFilters}
                testId="dashboard-filters"
              />


              <div className="dashboard__data-section">
                <div className="dashboard__table-container">
                  {isMobile ? (
                    <DataCards data={filteredTowers} onRowClick={(row) => console.log('Row clicked:', row)} />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredTowers}
                      keyField="id"
                      pageSize={10}
                      selectable
                      onRowClick={(row) => console.log('Row clicked:', row)}
                      onSelectionChange={(selected) => console.log('Selected rows:', selected)}
                      loading={loading}
                    />
                  )}
                </div>

                
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
   );
});

export default Dashboard;




