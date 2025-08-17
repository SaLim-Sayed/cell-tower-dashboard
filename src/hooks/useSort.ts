import { useState, useMemo, useCallback } from 'react';
import type { CellTower, SortConfig } from '../types/dashboard';
import dataService from '../services/dataService';
 
interface UseSortReturn {
  sortConfig: SortConfig;
  sortedData: CellTower[];
  requestSort: (key: keyof CellTower) => void;
  getSortDirection: (key: keyof CellTower) => 'ascending' | 'descending' | null;
}

export const useSort = (data: CellTower[]): UseSortReturn => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending'
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return dataService.sortTowers(data, sortConfig.key, sortConfig.direction);
  }, [data, sortConfig]);

  const requestSort = useCallback((key: keyof CellTower) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const getSortDirection = useCallback((key: keyof CellTower): 'ascending' | 'descending' | null => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction;
  }, [sortConfig]);

  return {
    sortConfig,
    sortedData,
    requestSort,
    getSortDirection
  };
};


