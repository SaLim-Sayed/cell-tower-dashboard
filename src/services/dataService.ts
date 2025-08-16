/* eslint-disable @typescript-eslint/no-explicit-any */
import { MOCK_TOWERS } from '../data/mockData';
import { type ApiResponse, type CellTower, type ChartData, type CityCount, type DashboardData, type StatusCount, type SummaryMetrics } from '../types';
import { COLORS } from '../constant';

class DataService {
  private towers: CellTower[] = MOCK_TOWERS;
  private simulateNetworkDelay = true;
  private delayMs = 800;


  private async delay(ms: number): Promise<void> {
    if (!this.simulateNetworkDelay) return;
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  public async getTowers(): Promise<ApiResponse<CellTower[]>> {
    try {
      await this.delay(this.delayMs);
      
      return {
        data: [...this.towers],
        success: true,
        message: 'Towers fetched successfully'
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch towers'
      };
    }
  }


  public calculateSummaryMetrics(towers: CellTower[]): SummaryMetrics {
    const totalTowers = towers.length;
    const activeTowers = towers.filter(tower => tower.status === 'active').length;
    const averageSignal = totalTowers > 0 
      ? Math.round((towers.reduce((sum, tower) => sum + tower.signalStrength, 0) / totalTowers) * 10) / 10
      : 0;

    return {
      totalTowers,
      activeTowers,
      averageSignal
    };
  }

  public generateChartData(towers: CellTower[]): ChartData {
    const cityColors = {
      'Cairo': COLORS.chart.cairo,
      'Alexandria': COLORS.chart.alexandria,
      'Hurghada': COLORS.chart.hurghada,
      'Luxor': COLORS.chart.luxor
    };

    const cityGroups = towers.reduce((acc, tower) => {
      acc[tower.city] = (acc[tower.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const towersByCity: CityCount[] = Object.entries(cityGroups).map(([city, count]) => ({
      city,
      count,
      color: cityColors[city as keyof typeof cityColors] || COLORS.neutral
    }));

    const statusGroups = towers.reduce((acc, tower) => {
      acc[tower.status] = (acc[tower.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTowers = towers.length;
    const statusDistribution: StatusCount[] = Object.entries(statusGroups).map(([status, count]) => ({
      status: status as 'active' | 'offline',
      count,
      percentage: totalTowers > 0 ? Math.round((count / totalTowers) * 100) : 0,
      color: status === 'active' ? COLORS.chart.active : COLORS.chart.offline
    }));

    return {
      towersByCity,
      statusDistribution
    };
  }

  public async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      const towersResponse = await this.getTowers();
      
      if (!towersResponse.success) {
        throw new Error(towersResponse.message);
      }

      const towers = towersResponse.data;
      const summary = this.calculateSummaryMetrics(towers);
      const chartData = this.generateChartData(towers);

      return {
        data: {
          towers,
          summary,
          chartData
        },
        success: true,
        message: 'Dashboard data fetched successfully'
      };
    } catch (error) {
      return {
        data: {
          towers: [],
          summary: { totalTowers: 0, activeTowers: 0, averageSignal: 0 },
          chartData: { towersByCity: [], statusDistribution: [] }
        },
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public filterTowers(
    towers: CellTower[], 
    searchTerm: string, 
    selectedCity: string
  ): CellTower[] {
    return towers.filter(tower => {
      const matchesSearch = tower.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === '' || tower.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }

  public getUniqueCities(towers: CellTower[]): string[] {
    const cities = [...new Set(towers.map(tower => tower.city))];
    return cities.sort();
  }

  public sortTowers(
    towers: CellTower[], 
    key: keyof CellTower, 
    direction: 'ascending' | 'descending'
  ): CellTower[] {
    const sortedTowers = [...towers].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'ascending' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sortedTowers;
  }

  public setNetworkSimulation(enabled: boolean, delayMs: number = 800): void {
    this.simulateNetworkDelay = enabled;
    this.delayMs = delayMs;
  }
}

export const dataService = new DataService();
export default dataService;