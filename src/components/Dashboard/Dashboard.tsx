// src/components/Dashboard/Dashboard.tsx
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
import type { CellTower } from '../../types/dashboard.types';
import { useMediaQuery } from 'react-responsive';
import DataCards from '../DataTable/DataCards';

const Dashboard: React.FC = memo(() => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { dashboardData, loading, error, refetch } = useDashboardData();
  const { filters, filteredTowers, setSearchTerm, setSelectedCity, clearFilters } = useFilters(dashboardData.towers);
  const totalTowers = dashboardData.towers.length;
  const activeTowers = dashboardData.towers.filter((tower) => tower.status === 'active').length;
  const avgSignal = dashboardData.towers.reduce((acc, tower) => acc + tower.signalStrength, 0) / dashboardData.towers.length;
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

  const cities = dataService.getUniqueCities(dashboardData.towers);

  if (loading) {
    return (
      <div className="dashboard dashboard--loading">
        <div className="container">
        </div>
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
       <div className="dashboard">
        <Header
          totalTowers={totalTowers}
          activeTowers={activeTowers}
          avgSignal={avgSignal.toFixed(1)}
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
   );
});

export default Dashboard;




