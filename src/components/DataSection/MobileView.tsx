/* eslint-disable @typescript-eslint/ban-ts-comment */
// Dashboard/MobileView.tsx
import React from 'react';
import type { CellTower, FilterProps } from '../../types/dashboard';
import SmFilters from '../Filters/SmFilters/SmFilters';
import DataCards from './DataCards/DataCards';

type SortConfig = {
  key: keyof CellTower;
  direction: "asc" | "desc";
} | null;

interface MobileViewProps {
  data: CellTower[];
  filters: FilterProps;
  cities: string[];
  sortConfig: SortConfig;
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
}

const MobileView: React.FC<MobileViewProps> = ({ 
  data, 
  filters, 
  cities, 
  sortConfig, 
  onFiltersChange, 
  onClearFilters, 
  onRowClick 
}) => (
  <div style={{
    marginBottom:100,
   }}>
    <SmFilters
      data={data}
      filters={filters as unknown as FilterProps["filters"]}
      cities={cities}
      sortConfig={sortConfig}
      //@ts-ignore
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      onRowClick={onRowClick}
      pageSize={10}
    />
    <DataCards data={data} onRowClick={onRowClick} />
  </div>
);

export default MobileView;