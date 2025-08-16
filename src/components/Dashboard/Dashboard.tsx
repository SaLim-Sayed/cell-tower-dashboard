/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo, useState, useMemo, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import StarRatings from 'react-star-ratings';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useFilters } from '../../hooks/useFilters';
import { dataService } from '../../services/dataService';
import type { CellTower, CityCount, FilterProps, StatusCount } from '../../types/dashboard';
import BarChart from '../Charts/BarChart/BarChart';
import PieChart from '../Charts/PieChart/PieChart';
import SmFilters from '../common/SmFilters/SmFilters';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import DataCards from '../DataTable/DataCards';
import DataTable, { type Column } from '../DataTable/DataTable';
import Filters from '../Filters/Filters';
import Header from '../Header/Header';
import './Dashboard.scss';

type SortConfig = {
  key: keyof CellTower;
  direction: "asc" | "desc";
} | null;

const Dashboard: React.FC = memo(() => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { dashboardData, loading, error, refetch } = useDashboardData();
  const { filters, filteredTowers, setSearchTerm, setSelectedCity, clearFilters } = useFilters(dashboardData.towers);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  // Memoized derived data
  const cities = useMemo(() => dataService.getUniqueCities(dashboardData.towers), [dashboardData.towers]);
  const summary = useMemo(() => dataService.calculateSummaryMetrics(dashboardData.towers), [dashboardData.towers]);
  
  // Table columns configuration
  const columns: Column<CellTower>[] = useMemo(() => [
    { header: 'Name', accessor: 'name', sortable: true, sortKey: 'name' },
    { header: 'City', accessor: 'city', sortable: true, sortKey: 'city' },
    { header: 'Network Type', accessor: 'networkType', sortable: true, sortKey: 'networkType' },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      sortKey: 'status',
      render: (row: CellTower) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Signal Strength",
      accessor: 'signalStrength',
      sortable: true,
      sortKey: 'signalStrength',
      render: (row: CellTower) => (
        <StarRating value={row.signalStrength} id={row.id} />
      ),
    },
  ], []);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig) return [...filteredTowers];
    
    return [...filteredTowers].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTowers, sortConfig]);

  // Event handlers
  const handleRowClick = useCallback((row: CellTower) => {
    console.log('Row clicked:', row);
  }, []);

  const handleSelectionChange = useCallback((selected: CellTower[]) => {
    console.log('Selected rows:', selected);
  }, []);

  const handleFiltersChange = useMemo(() => ({
    setSearchTerm,
    setSelectedCity,
    setSortConfig,
  }), [setSearchTerm, setSelectedCity]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <ErrorBoundary> <Header
          totalTowers={summary.totalTowers}
          activeTowers={summary.activeTowers}
          avgSignal={summary.averageSignal.toFixed(1)}
        />
      <div className="dashboard">
       

        <main className="dashboard__main">
          <div className="container">
            <ChartsSection 
              towersByCity={dashboardData.chartData.towersByCity}
              statusDistribution={dashboardData.chartData.statusDistribution}
            />

            <div className="dashboard__content">
              <div className="dashboard__data-section">
                <div className="dashboard__table-container">
                  {isMobile ? (
                    <MobileView
                      data={sortedData}
                      filters={filters as unknown as FilterProps}
                      cities={cities}
                      sortConfig={sortConfig}
                      // @ts-ignore
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={clearFilters}
                      onRowClick={handleRowClick}
                    />
                  ) : (
                    <DesktopView
                      filters={filters as unknown as FilterProps}
                      cities={cities}
                      data={filteredTowers}
                      columns={columns}
                      // @ts-ignore
                      onFiltersChange={{ setSearchTerm, setSelectedCity }}
                      onClearFilters={clearFilters}
                      onRowClick={handleRowClick}
                      onSelectionChange={handleSelectionChange}
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

// Sub-components for better organization
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`dashboard__status dashboard__status--${status.toLowerCase()}`}>
    {status}
  </span>
);

const StarRating: React.FC<{ value: number; id: string | number }> = ({ value, id }) => (
  <StarRatings
    rating={value}
    starRatedColor="gold"
    numberOfStars={5}
    starDimension="20px"
    starSpacing="2px"
    name={`signal-${id}`}
  />
);

const LoadingSpinner: React.FC = () => (
  <div className="dashboard dashboard__loading">
    <FaSpinner style={{ fontSize: '2rem', color: 'blue' }} />
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="dashboard dashboard--error">
    <div className="container">
      <div className="error-state">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button
          className="button button--primary"
          onClick={onRetry}
          aria-label="Retry loading dashboard data"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const ChartsSection: React.FC<{
  towersByCity: CityCount[];
  statusDistribution: StatusCount[];
}> = ({ towersByCity, statusDistribution }) => (
  <div className="dashboard__charts-container">
    <div className="dashboard__chart">
      <h3 className="dashboard__chart-title">Towers by City</h3>
      <BarChart data={towersByCity} testId="towers-by-city-chart" />
    </div>

    <div className="dashboard__chart">
      <h3 className="dashboard__chart-title">Status Distribution</h3>
      <PieChart data={statusDistribution} testId="status-distribution-chart" />
    </div>
  </div>
);

const MobileView: React.FC<{
  data: CellTower[];
  filters: FilterProps;
  cities: string[];
  sortConfig: SortConfig;
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
}> = ({ data, filters, cities, sortConfig, onFiltersChange, onClearFilters, onRowClick }) => (
  <>
    <SmFilters
      data={data}
      filters={filters as unknown as  FilterProps["filters"]}
      cities={cities}
      sortConfig={sortConfig}
      // @ts-ignore
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      onRowClick={onRowClick}
      pageSize={10}
    />
    <DataCards data={data} onRowClick={onRowClick} />
  </>
);

const DesktopView: React.FC<{
  filters: FilterProps;
  cities: string[];
  data: CellTower[];
  columns: Column<CellTower>[];
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
  onSelectionChange: (selected: CellTower[]) => void;
  loading: boolean;
}> = ({ filters, cities, data, columns, onFiltersChange, onClearFilters, onRowClick, onSelectionChange, loading }) => (
  <>
    <Filters
      filters={filters as unknown as FilterProps["filters"]}
      cities={cities}
      // @ts-ignore
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      testId="dashboard-filters"
    />
    <DataTable
      columns={columns}
      data={data}
      keyField="id"
      pageSize={10}
      selectable
      onRowClick={onRowClick}
      onSelectionChange={onSelectionChange}
      loading={loading}
    />
  </>
);

export default Dashboard;