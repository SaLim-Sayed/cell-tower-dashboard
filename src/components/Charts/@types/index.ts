import type { ChartProps } from "../../../types";
import type { CityCount, StatusCount } from "../../../types/dashboard";
import type { ChartDimensions } from "../../../types/dashboard";

export interface IBarChartProps extends Omit<ChartProps, 'data'> {
  data: CityCount[];
  dimensions?: Partial<ChartDimensions>;
  showValues?: boolean;
  showGridLines?: boolean;
  animationDuration?: number;
  colorScheme?: 'default' | 'gradient' | 'categorical';
  sortBy?: 'value' | 'name' | 'none';
  maxBars?: number;
}

export interface IPieChartProps extends Omit<ChartProps, "data"> {
  data: StatusCount[];
  dimensions?: Partial<ChartDimensions>;
}