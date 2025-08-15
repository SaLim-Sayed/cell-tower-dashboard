// src/data/mockData.ts

import type { CellTower } from "../types/dashboard.types";

 
export const MOCK_TOWERS: CellTower[] = [
  {
    id: 'tower-001',
    name: 'Cairo Central Tower',
    city: 'Cairo',
    networkType: '5G',
    status: 'active',
    signalStrength: 5
  },
  {
    id: 'tower-002',
    name: 'Cairo North Station',
    city: 'Cairo',
    networkType: '4G',
    status: 'active',
    signalStrength: 4
  },
  {
    id: 'tower-003',
    name: 'Cairo East Hub',
    city: 'Cairo',
    networkType: '5G',
    status: 'offline',
    signalStrength: 3
  },
  {
    id: 'tower-004',
    name: 'Alexandria Port Tower',
    city: 'Alexandria',
    networkType: '5G',
    status: 'active',
    signalStrength: 5
  },
  {
    id: 'tower-005',
    name: 'Alexandria Beach Station',
    city: 'Alexandria',
    networkType: '4G',
    status: 'active',
    signalStrength: 4
  },
  {
    id: 'tower-006',
    name: 'Alexandria City Center',
    city: 'Alexandria',
    networkType: '4G',
    status: 'offline',
    signalStrength: 2
  },
  {
    id: 'tower-007',
    name: 'Hurghada Resort Tower',
    city: 'Hurghada',
    networkType: '5G',
    status: 'active',
    signalStrength: 5
  },
  {
    id: 'tower-008',
    name: 'Hurghada Marina Hub',
    city: 'Hurghada',
    networkType: '4G',
    status: 'active',
    signalStrength: 3
  },
  {
    id: 'tower-009',
    name: 'Hurghada Airport Station',
    city: 'Hurghada',
    networkType: '5G',
    status: 'offline',
    signalStrength: 4
  },
  {
    id: 'tower-010',
    name: 'Luxor Valley Tower',
    city: 'Luxor',
    networkType: '4G',
    status: 'active',
    signalStrength: 4
  },
  {
    id: 'tower-011',
    name: 'Luxor Temple Station',
    city: 'Luxor',
    networkType: '5G',
    status: 'active',
    signalStrength: 5
  },
  {
    id: 'tower-012',
    name: 'Luxor West Bank Hub',
    city: 'Luxor',
    networkType: '4G',
    status: 'offline',
    signalStrength: 2
  }
];
