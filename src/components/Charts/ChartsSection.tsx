import React from 'react';
import type { CityCount, StatusCount } from '../../types/dashboard';
import BarChart from './BarChart/BarChart';
import PieChart from './PieChart/PieChart';

interface ChartsSectionProps {
  towersByCity: CityCount[];
  statusDistribution: StatusCount[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ 
  towersByCity, 
  statusDistribution 
}) => (
  <div className="dashboard__charts-container">
    <div className="dashboard__chart">
      <h3 className="dashboard__chart-title">Towers by City</h3>
      <BarChart data={towersByCity} testId="towers-by-city-chart" />
    </div>

    <div className="dashboard__chart">
      <h3 className="dashboard__chart-title">Status Distribution</h3>
      <PieChart data={statusDistribution} testId="status-distribution-chart" />
    </div>
  </div>
);

export default ChartsSection;
