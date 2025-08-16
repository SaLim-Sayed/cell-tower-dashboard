// src/components/Charts/BarChart/BarChart.tsx
import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';
import type { ChartProps, CityCount, ChartDimensions } from '../../../types/dashboard.types';
import { useResponsive } from '../../../hooks/useResponsive';
import './BarChart.scss';

interface BarChartProps extends Omit<ChartProps, 'data'> {
  data: CityCount[];
  dimensions?: Partial<ChartDimensions>;
}

const BarChart: React.FC<BarChartProps> = memo(({
  data,
  dimensions,
  className = '',
  testId = 'bar-chart'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { isMobile } = useResponsive();
  
  const defaultDimensions: ChartDimensions = {
    width: isMobile ? 300 : 400,
    height: 300,
    margin: {
      top: 20,
      right: 20,
      bottom: isMobile ? 60 : 40,
      left: isMobile ? 40 : 60
    }
  };

  const chartDimensions = { ...defaultDimensions, ...dimensions };
  const { width, height, margin } = chartDimensions;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.city))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .range([innerHeight, 0])
      .nice();

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'bar-chart__tooltip')
      .style('opacity', 0);

    // Create bars
    const bars = g
      .selectAll('.bar-chart__bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-chart__bar')
      .attr('x', d => xScale(d.city) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .attr('ry', 4)
      .on('mouseover', function(event, d) {
        // Highlight bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1.05)');

        // Show tooltip
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip
          .html(`
            <div class="bar-chart__tooltip-content">
              <strong>${d.city}</strong><br/>
              ${d.count} ${d.count === 1 ? 'tower' : 'towers'}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        // Reset bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1)');

        // Hide tooltip
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      });

    // Animate bars
    bars
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => yScale(d.count))
      .attr('height', d => innerHeight - yScale(d.count));

    // Add value labels on bars
    g
      .selectAll('.bar-chart__label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-chart__label')
      .attr('x', d => (xScale(d.city) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('opacity', 0)
      .text(d => d.count)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 400)
      .style('opacity', 1);

    // Create X axis
    const xAxis = d3.axisBottom(xScale);
    g
      .append('g')
      .attr('class', 'bar-chart__x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', isMobile ? 'end' : 'middle')
      .attr('dx', isMobile ? '-.8em' : '0')
      .attr('dy', isMobile ? '.15em' : '.71em')
      .attr('transform', isMobile ? 'rotate(-45)' : 'rotate(0)');

    // Create Y axis
    const yAxis = d3.axisLeft(yScale).ticks(5);
    g
      .append('g')
      .attr('class', 'bar-chart__y-axis')
      .call(yAxis);

    // Add Y axis label
    g
      .append('text')
      .attr('class', 'bar-chart__y-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Towers');

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [data, innerWidth, innerHeight, margin, isMobile]);

  if (!data.length) {
    return (
      <div className={`bar-chart bar-chart--empty ${className}`} data-testid={testId}>
        <div className="bar-chart__empty-state">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bar-chart ${className}`} data-testid={testId}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bar-chart__svg"
        role="img"
        aria-label="Bar chart showing tower count by city"
      >
        <desc>
          Bar chart displaying the number of cell towers in each city: {
            data.map(d => `${d.city}: ${d.count}`).join(', ')
          }
        </desc>
      </svg>
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
