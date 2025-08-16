/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import type { CellTower, FilterProps } from '../../types/dashboard';
import type { Column } from './DataTable/DataTable';
import Filters from '../Filters/Filters';
import DataTable from './DataTable/DataTable';

interface DesktopViewProps {
  filters: FilterProps;
  cities: string[];
  data: CellTower[];
  columns: Column<CellTower>[];
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
  onSelectionChange: (selected: CellTower[]) => void;
  loading: boolean;
}

const DesktopView: React.FC<DesktopViewProps> = ({ 
  filters, 
  cities, 
  data, 
  columns, 
  onFiltersChange, 
  onClearFilters, 
  onRowClick, 
  onSelectionChange, 
  loading 
}) => (
  <>
    <Filters
      filters={filters as unknown as FilterProps["filters"]}
      cities={cities}
      //@ts-ignore
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

export default DesktopView;
