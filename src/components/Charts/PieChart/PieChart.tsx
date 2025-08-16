
// src/components/Charts/PieChart/PieChart.tsx
import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';
import type { ChartProps, StatusCount, ChartDimensions } from '../../../types/dashboard.types';
import { useResponsive } from '../../../hooks/useResponsive';
import './PieChart.scss';

interface PieChartProps extends Omit<ChartProps, 'data'> {
  data: StatusCount[];
  dimensions?: Partial<ChartDimensions>;
}

const PieChart: React.FC<PieChartProps> = memo(({
  data,
  dimensions,
  className = '',
  testId = 'pie-chart'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { isMobile } = useResponsive();
  
  const defaultDimensions: ChartDimensions = {
    width: isMobile ? 300 : 400,
    height: 300,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  };

  const chartDimensions = { ...defaultDimensions, ...dimensions };
  const { width, height, margin } = chartDimensions;
  const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create pie generator
    const pie = d3
      .pie<StatusCount>()
      .value(d => d.count)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<StatusCount>>()
      .innerRadius(0)
      .outerRadius(radius - 10);

    // Create outer arc for labels
    const outerArc = d3
      .arc<d3.PieArcDatum<StatusCount>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'pie-chart__tooltip')
      .style('opacity', 0);

    // Create slices
    const slices = g
      .selectAll('.pie-chart__slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'pie-chart__slice');

    // Add paths
    slices
      .append('path')
      .attr('class', 'pie-chart__path')
      .attr('fill', d => d.data.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        // Highlight slice
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', function() {
            const centroid = arc.centroid(d);
            const x = centroid[0] * 0.1;
            const y = centroid[1] * 0.1;
            return `translate(${x},${y})`;
          });

        // Show tooltip
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip
          .html(`
            <div class="pie-chart__tooltip-content">
              <strong>${d.data.status === 'active' ? 'Active' : 'Offline'}</strong><br/>
              ${d.data.count} towers (${d.data.percentage}%)
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        // Reset slice
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)');

        // Hide tooltip
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      });

    // Animate slices
    slices.selectAll('path')
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Add percentage labels
    slices
      .append('text')
      .attr('class', 'pie-chart__label')
      .attr('transform', d => {
        const pos = arc.centroid(d);
        pos[0] = pos[0] * 1.4;
        pos[1] = pos[1] * 1.4;
        return `translate(${pos})`;
      })
      .attr('text-anchor', d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('opacity', 0)
      .text(d => `${d.data.percentage}%`)
      .transition()
      .duration(1000)
      .delay(500)
      .style('opacity', 1);

    // Add polylines for labels
    slices
      .append('polyline')
      .attr('class', 'pie-chart__polyline')
      .style('opacity', 0)
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        pos[0] = pos[0] * 1.2;
        pos[1] = pos[1] * 1.2;
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos].join(',');
      })
      .transition()
      .duration(1000)
      .delay(500)
      .style('opacity', 0.7);

    // Add legend
    const legend = svg
      .append('g')
      .attr('class', 'pie-chart__legend')
      .attr('transform', `translate(${width - 120}, 20)`);

    const legendItems = legend
      .selectAll('.pie-chart__legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'pie-chart__legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => d.color)
      .attr('rx', 2);

    legendItems
      .append('text')
      .attr('x', 18)
      .attr('y', 6)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.status === 'active' ? 'Active' : 'Offline');

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [data, width, height, radius]);

  if (!data.length) {
    return (
      <div className={`pie-chart pie-chart--empty ${className}`} data-testid={testId}>
        <div className="pie-chart__empty-state">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pie-chart ${className}`} data-testid={testId}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="pie-chart__svg"
        role="img"
        aria-label="Pie chart showing tower status distribution"
      >
        {/* Accessibility description */}
        <desc>
          Pie chart displaying the distribution of cell tower statuses: {
            data.map(d => `${d.status}: ${d.count} (${d.percentage}%)`).join(', ')
          }
        </desc>
      </svg>
    </div>
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;
