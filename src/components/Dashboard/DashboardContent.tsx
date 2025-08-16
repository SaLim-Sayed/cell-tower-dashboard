/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useCallback } from 'react';
import type { CellTower, DashboardData, FilterProps, FilterState } from '../../types/dashboard';
import { dataService } from '../../services/dataService';
import ChartsSection from '../Charts/ChartsSection';
import DataSection from '../DataSection/DataSection';

type SortConfig = {
  key: keyof CellTower;
  direction: "asc" | "desc";
} | null;

interface DashboardContentProps {
  dashboardData:  DashboardData;
  filteredTowers: CellTower[];
  filters: FilterState;
  isMobile: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedCity: (city: string) => void;
  clearFilters: () => void;
  loading: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  dashboardData,
  filteredTowers,
  filters,
  isMobile,
  setSearchTerm,
  setSelectedCity,
  clearFilters,
  loading
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  const cities = useMemo(() => dataService.getUniqueCities(dashboardData.towers), [dashboardData.towers]);

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

  return (
    <>
      <ChartsSection
        towersByCity={dashboardData.chartData.towersByCity}
        statusDistribution={dashboardData.chartData.statusDistribution}
      />

      <div className="dashboard__content">
        <div className="dashboard__data-section">
          <div className="dashboard__table-container">
            <DataSection
              isMobile={isMobile}
              sortedData={sortedData}
              filteredTowers={filteredTowers}
              filters={filters as unknown as FilterProps}
              cities={cities}
              sortConfig={sortConfig}
              //@ts-ignore
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
              onRowClick={handleRowClick}
              onSelectionChange={handleSelectionChange}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
