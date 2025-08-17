/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import type { CellTower, FilterProps } from '../../types/dashboard';
import SmFilters from '../Filters/SmFilters/SmFilters';
import DataCards from './DataCards/DataCards';
import DataTable, { type Column } from './DataTable/DataTable';
import { MdGridOn } from 'react-icons/md';
import { CiGrid2H } from 'react-icons/ci';

type SortConfig = {
  key: keyof CellTower;
  direction: 'asc' | 'desc';
} | null;

interface MobileViewProps {
  data: CellTower[];
  filters: FilterProps;
  cities: string[];
  sortConfig: SortConfig;
  onFiltersChange: (filters: FilterProps) => void;
  onClearFilters: () => void;
  onRowClick: (row: CellTower) => void;
  onSelectionChange: (selected: CellTower[]) => void;
  loading: boolean;
  columns: Column<CellTower>[];
}

const MobileView: React.FC<MobileViewProps> = ({
  data,
  filters,
  cities,
  sortConfig,
  onFiltersChange,
  onClearFilters,
  onRowClick,
  onSelectionChange,
  loading,
  columns,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table'); // Default to cards

  return (
    <div style={{ marginBottom: 100 }}>
      <SmFilters
        data={data}
        filters={filters as unknown as FilterProps['filters']}
        cities={cities}
        sortConfig={sortConfig}
        //@ts-ignore
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        onRowClick={onRowClick}
        pageSize={10}
      />

      {/* Toggle buttons */}
      <div style={{ margin: '10px 0', display: 'flex', gap: 10 }}>
      <button
          onClick={() => setViewMode('table')}
          style={{
            padding: '6px 12px',
            fontWeight: viewMode === 'table' ? 'bold' : 'lighter',

          }}
        >
          Table View <MdGridOn />
        </button>
        <button
          onClick={() => setViewMode('cards')}
          style={{
            padding: '6px 12px',
            fontWeight: viewMode === 'cards' ? 'bold' : 'lighter',
          }}
        >
          Card View <CiGrid2H />
        </button>
       
      </div>

      {/* Conditional rendering */}
      {viewMode === 'cards' ? (
        <DataCards data={data} onRowClick={onRowClick} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          pageSize={10}
          //@ts-ignore
          filters={filters}
          selectable
          onRowClick={onRowClick}
          onSelectionChange={onSelectionChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default MobileView;
