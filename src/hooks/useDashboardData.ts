// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import type { DashboardData, UseDashboardDataReturn } from '../types/dashboard.types';
import dataService from '../services/dataService';
 
export const useDashboardData = (): UseDashboardDataReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    towers: [],
    summary: { totalTowers: 0, activeTowers: 0, averageSignal: 0 },
    chartData: { towersByCity: [], statusDistribution: [] }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dataService.getDashboardData();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refetch
  };
};
