// src/types/dashboard.types.ts

export interface CellTower {
    id: string;
    name: string;
    city: string;
    networkType: '4G' | '5G';
    status: 'active' | 'offline';
    signalStrength: number; // 1-5 rating
  }
  
  export interface SummaryMetrics {
    totalTowers: number;
    activeTowers: number;
    averageSignal: number;
  }
  
  export interface CityCount {
    city: string;
    count: number;
    color: string;
  }
  
  export interface StatusCount {
    status: 'active' | 'offline';
    count: number;
    percentage: number;
    color: string;
  }
  
  export interface ChartData {
    towersByCity: CityCount[];
    statusDistribution: StatusCount[];
  }
  
  export interface DashboardData {
    towers: CellTower[];
    summary: SummaryMetrics;
    chartData: ChartData;
  }
  
  export interface FilterState {
    searchTerm: string;
    selectedCity: string;
  }
  
  export interface ChartDimensions {
    width: number;
    height: number;
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }
  
  export interface TableColumn {
    key: keyof CellTower;
    label: string;
    sortable: boolean;
    className?: string;
  }
  
  export interface SortConfig {
    key: keyof CellTower | null;
    direction: 'ascending' | 'descending';
  }
  
  // Utility types
  export type NetworkType = CellTower['networkType'];
  export type TowerStatus = CellTower['status'];
  export type Cities = 'Cairo' | 'Alexandria' | 'Hurghada' | 'Luxor';
  
  // Component Props types
  export interface BaseComponentProps {
    className?: string;
    testId?: string;
  }
  
  export interface ChartProps extends BaseComponentProps {
    data: CityCount[] | StatusCount[];
    dimensions?: Partial<ChartDimensions>;
  }
  
  export interface FilterProps extends BaseComponentProps {
    filters: FilterState;
    cities: string[];
    onFiltersChange: (filters: FilterState) => void;
  }
  
  export interface DataTableProps extends BaseComponentProps {
    towers: CellTower[];
    loading?: boolean;
  }
  
  export interface SummaryCardsProps extends BaseComponentProps {
    summary: SummaryMetrics;
    loading?: boolean;
  }
  
  // Hook return types
  export interface UseDashboardDataReturn {
    dashboardData: DashboardData;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  }
  
  export interface UseFiltersReturn {
    filters: FilterState;
    filteredTowers: CellTower[];
    setSearchTerm: (term: string) => void;
    setSelectedCity: (city: string) => void;
    clearFilters: () => void;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  // Error types
  export interface DashboardError {
    code: string;
    message: string;
    details?: unknown;
  }
  
  // Constants
  export const CITIES: readonly Cities[] = ['Cairo', 'Alexandria', 'Hurghada', 'Luxor'] as const;
  export const NETWORK_TYPES: readonly NetworkType[] = ['4G', '5G'] as const;
  export const TOWER_STATUSES: readonly TowerStatus[] = ['active', 'offline'] as const;
  
  // Color scheme
  export const COLORS = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    neutral: '#6b7280',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      inverse: '#ffffff'
    },
    chart: {
      cairo: '#3b82f6',
      alexandria: '#10b981',
      hurghada: '#f59e0b',
      luxor: '#ef4444',
      active: '#10b981',
      offline: '#ef4444'
    }
  } as const;
  
  // Responsive breakpoints
  export const BREAKPOINTS = {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  } as const;