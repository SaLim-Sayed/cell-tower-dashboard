import React from 'react';
import type { CellTower, FilterProps } from '../../types/dashboard';
 
import { useTableColumns } from '../../hooks/useTableColumns';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
 
type SortConfig = {
  key: keyof CellTower;
  direction: "asc" | "desc";
} | null;

interface DataSectionProps {
  isMobile: boolean;
  sortedData: CellTower[];
  filteredTowers: CellTower[];
  filters: FilterProps;
  cities: string[];
  sortConfig: SortConfig;
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
  onSelectionChange: (selected: CellTower[]) => void;
  loading: boolean;
}

const DataSection: React.FC<DataSectionProps> = ({
  isMobile,
  sortedData,
  filteredTowers,
  filters,
  cities,
  sortConfig,
  onFiltersChange,
  onClearFilters,
  onRowClick,
  onSelectionChange,
  loading
}) => {
  const columns = useTableColumns();

  if (isMobile) {
    return (
      <MobileView
        data={sortedData}
        filters={filters}
        cities={cities}
        sortConfig={sortConfig}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        onRowClick={onRowClick}
      />
    );
  }

  return (
    <DesktopView
      filters={filters}
      cities={cities}
      data={filteredTowers}
      columns={columns}
      onFiltersChange={onFiltersChange}
      onClearFilters={onClearFilters}
      onRowClick={onRowClick}
      onSelectionChange={onSelectionChange}
      loading={loading}
    />
  );
};

export default DataSection;
