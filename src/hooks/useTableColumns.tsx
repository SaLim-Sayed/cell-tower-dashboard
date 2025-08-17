import { useMemo } from 'react';
 
import type { CellTower } from '../types';
import type { Column } from '../components/DataSection/DataTable/DataTable';
import StarRating from '../components/common/StarRating/StarRating';
import StatusBadge from '../components/common/StatusBadge';

export const useTableColumns = (): Column<CellTower>[] => {
  return useMemo(() => [
    { header: 'Name', accessor: 'name', sortable: true, sortKey: 'name' },
    { header: 'City', accessor: 'city', sortable: true, sortKey: 'city' },
    { header: 'Network Type', accessor: 'networkType', sortable: true, sortKey: 'networkType' },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      sortKey: 'status',
      render: (row: CellTower) => <StatusBadge status={row.status} />,
    },
    {
      header: "Signal Strength",
      accessor: 'signalStrength',
      sortable: true,
      sortKey: 'signalStrength',
      render: (row: CellTower) => <StarRating value={row.signalStrength} id={row.id} />,
    },
  ], []);
};