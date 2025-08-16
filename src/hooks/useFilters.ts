
// src/hooks/useFilters.ts
import { useState, useMemo, useCallback } from 'react';
import type { CellTower, FilterState, UseFiltersReturn } from '../types/dashboard';
import dataService from '../services/dataService';
 
export const useFilters = (towers: CellTower[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCity: ''
  });

  const filteredTowers = useMemo(() => {
    return dataService.filterTowers(towers, filters.searchTerm, filters.selectedCity);
  }, [towers, filters]);

  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term
    }));
  }, []);

  const setSelectedCity = useCallback((city: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCity: city
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      selectedCity: ''
    });
  }, []);

  return {
    filters,
    filteredTowers,
    setSearchTerm,
    setSelectedCity,
    clearFilters
  };
};

