import * as d3 from 'd3';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import type { ChartDimensions, CityCount } from '../../../types/dashboard';
import type { IBarChartProps } from '../@types';
import './BarChart.scss';
 

const BarChart: React.FC<IBarChartProps> = memo(({
  data,
  dimensions,
  className = '',
  testId = 'bar-chart',
  showValues = true,
  showGridLines = true,
  animationDuration = 800,
  colorScheme = 'default',
  sortBy = 'none',
  maxBars = 20
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isInitialized = useRef(false);
  const animationInProgress = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const  isMobile  = useMediaQuery({ query: '(max-width: 768px)' });
  
  // Memoize dimensions to prevent unnecessary recalculations
  const chartDimensions = useMemo(() => {
    const defaultDimensions: ChartDimensions = {
      width: isMobile ? 300 : 500,
      height: isMobile ? 280 : 350,
      margin: {
        top: isMobile ? 20 : 30,
        right: isMobile ? 20 : 30,
        bottom: isMobile ? 100 : 60,
        left: isMobile ? 60 : 70
      }
    };
    return { ...defaultDimensions, ...dimensions };
  }, [dimensions, isMobile]);

  const { width, height, margin } = chartDimensions;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Memoize processed data to prevent unnecessary recalculations
  const processedData = useMemo(() => {
    if (!data.length) return [];
    
    let processedData = [...data];
    
    // Sort data if requested
    if (sortBy === 'value') {
      processedData.sort((a, b) => b.count - a.count);
    } else if (sortBy === 'name') {
      processedData.sort((a, b) => a.city.localeCompare(b.city));
    }
    
    // Limit number of bars
    if (maxBars && processedData.length > maxBars) {
      processedData = processedData.slice(0, maxBars);
    }
    
    return processedData;
  }, [data, sortBy, maxBars]);

  // Memoize data hash to detect actual data changes
  const dataHash = useMemo(() => {
    return JSON.stringify(processedData.map(d => `${d.city}-${d.count}`));
  }, [processedData]);

  // Color scheme generator
  const getBarColor = useCallback((d: CityCount, index: number) => {
    if (colorScheme === 'gradient') {
      const intensity = d.count / Math.max(...processedData.map(item => item.count));
      return `hsl(200, 70%, ${85 - intensity * 35}%)`;
    } else if (colorScheme === 'categorical') {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
      return colors[index % colors.length];
    }
    return d.color || '#3b82f6';
  }, [colorScheme, processedData]);

  // Enhanced cleanup tooltip function
  const cleanupTooltip = useCallback(() => {
    if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
      try {
        document.body.removeChild(tooltipRef.current);
      } catch (error) {
        // Element might already be removed, ignore the error
        console.debug('Tooltip cleanup: element already removed');
      }
    }
    tooltipRef.current = null;
  }, []);

  // Create or ensure tooltip exists
  const ensureTooltip = useCallback(() => {
    // Check if tooltip exists and is still in the DOM
    if (!tooltipRef.current || !document.body.contains(tooltipRef.current)) {
      // Clean up any orphaned reference
      tooltipRef.current = null;
      
      // Create new tooltip
      const tooltipElement = document.createElement('div');
      tooltipElement.className = 'bar-chart__tooltip';
      tooltipElement.style.cssText = `
        position: absolute;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `;
      
      document.body.appendChild(tooltipElement);
      tooltipRef.current = tooltipElement;
    }
    return d3.select(tooltipRef.current);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !processedData.length || animationInProgress.current) return;

    // Only show loading on first render or actual data changes
    if (!isInitialized.current) {
      setIsLoading(true);
    }

    animationInProgress.current = true;
    
    const svg = d3.select(svgRef.current);
    
    // Only clear if this is first initialization or data actually changed
    if (!isInitialized.current) {
      svg.selectAll('*').remove();
    }

    // Create scales with better domain handling
    const xScale = d3
      .scaleBand()
      .domain(processedData.map(d => d.city))
      .range([0, innerWidth])
      .padding(0.3);

    const maxValue = d3.max(processedData, d => d.count) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1]) // Add 10% padding to top
      .range([innerHeight, 0])
      .nice();

    let chartGroup = svg.select('.bar-chart__main-group');
    if (chartGroup.empty()) {
      // Create main group only once
      chartGroup = svg
        .append('g')
        .attr('class', 'bar-chart__main-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

    // Update existing elements or create new ones
    const updateChart = () => {
      // Clear existing content for updates
      chartGroup.selectAll('*').remove();

      // Add grid lines if enabled
      if (showGridLines) {
        const gridLines = chartGroup
          .append('g')
          .attr('class', 'bar-chart__grid');

        // Horizontal grid lines
        gridLines
          .selectAll('.bar-chart__grid-line')
          .data(yScale.ticks(5))
          .enter()
          .append('line')
          .attr('class', 'bar-chart__grid-line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', d => yScale(d))
          .attr('y2', d => yScale(d))
          .style('stroke', '#f1f5f9')
          .style('stroke-width', 1)
          .style('stroke-dasharray', '2,2')
          .style('opacity', isInitialized.current ? 0.6 : 0)
          .transition()
          .duration(isInitialized.current ? 200 : 0)
          .style('opacity', 0.6);
      }

  
      // Create bars with enhanced interactions
      const barsGroup = chartGroup
        .append('g')
        .attr('class', 'bar-chart__bars');

      const bars = barsGroup
        .selectAll('.bar-chart__bar')
        .data(processedData)
        .enter()
        .append('rect')
        .attr('class', 'bar-chart__bar')
        .attr('x', d => xScale(d.city) || 0)
        .attr('width', xScale.bandwidth())
        .attr('y', isInitialized.current ? d => yScale(d.count) : innerHeight)
        .attr('height', isInitialized.current ? d => innerHeight - yScale(d.count) : 0)
        .attr('fill', (d, i) => getBarColor(d, i))
        .attr('rx', isMobile ? 3 : 6)
        .attr('ry', isMobile ? 3 : 6)
        .style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
        .on('mouseover', function(event, d) {
          // Enhanced bar hover effect
          d3.select(this)
            .transition()
            .duration(200)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1)');

          // Ensure tooltip exists and show it
          const currentTooltip = ensureTooltip();
          currentTooltip
            .transition()
            .duration(200)
            .style('opacity', '1')
            .style('visibility', 'visible');
          
          currentTooltip
            .html(`
              <div class="bar-chart__tooltip-content">
                <div class="tooltip-title" style="font-weight: 600; margin-bottom: 4px;">${d.city}</div>
                <div class="tooltip-value" style="margin-bottom: 2px;">${d.count} ${d.count === 1 ? 'tower' : 'towers'}</div>
                <div class="tooltip-percentage" style="font-size: 11px; opacity: 0.8;">${((d.count / processedData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}% of total</div>
              </div>
            `)
            .style('left', `${Math.min(event.pageX + 15, window.innerWidth - 150)}px`)
            .style('top', `${Math.max(event.pageY - 10, 10)}px`);

          // Highlight corresponding x-axis label
          chartGroup
            .selectAll('.bar-chart__x-axis .tick text')
            .filter(function() {
              return d3.select(this).text() === d.city;
            })
            .transition()
            .duration(200)
            .style('font-weight', '600')
            .style('fill', '#1f2937');
        })
        .on('mousemove', (event) => {
          const currentTooltip = ensureTooltip();
          currentTooltip
            .style('left', `${Math.min(event.pageX + 15, window.innerWidth - 150)}px`)
            .style('top', `${Math.max(event.pageY - 10, 10)}px`);
        })
        .on('mouseout', function() {
          // Reset bar
          d3.select(this)
            .transition()
            .duration(200)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

          // Hide tooltip if it exists
          if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
            const currentTooltip = d3.select(tooltipRef.current);
            currentTooltip
              .transition()
              .duration(200)
              .style('opacity', '0')
              .style('visibility', 'hidden');
          }

          // Reset x-axis labels
          chartGroup
            .selectAll('.bar-chart__x-axis .tick text')
            .transition()
            .duration(200)
            .style('font-weight', '400')
            .style('fill', '#6b7280');
        });

      // Animate bars only on first load
      if (!isInitialized.current) {
        bars
          .transition()
          .duration(animationDuration)
          .delay((d, i) => i * (animationDuration / processedData.length / 4))
          .ease(d3.easeBackOut.overshoot(0.1))
          .attr('y', d => yScale(d.count))
          .attr('height', d => innerHeight - yScale(d.count))
          .on('end', (d, i) => {
            if (i === processedData.length - 1) {
              setIsLoading(false);
              animationInProgress.current = false;
              isInitialized.current = true;
            }
          });
      } else {
        // For updates, just set final positions
        animationInProgress.current = false;
      }

      // Add value labels on bars if enabled
      if (showValues) {
        const labelsGroup = chartGroup
          .append('g')
          .attr('class', 'bar-chart__labels');

        const labels = labelsGroup
          .selectAll('.bar-chart__label')
          .data(processedData)
          .enter()
          .append('text')
          .attr('class', 'bar-chart__label')
          .attr('x', d => (xScale(d.city) || 0) + xScale.bandwidth() / 2)
          .attr('y', d => yScale(d.count) - 8)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'bottom')
          .style('opacity', isInitialized.current ? 1 : 0)
          .style('font-weight', '600')
          .style('font-size', isMobile ? '11px' : '12px')
          .style('fill', '#374151')
          .text(d => d.count);

        if (!isInitialized.current) {
          labels
            .transition()
            .duration(animationDuration)
            .delay((d, i) => i * (animationDuration / processedData.length / 4) + animationDuration / 2)
            .style('opacity', 1);
        }
      }

      // Create enhanced X axis
      const xAxis = d3.axisBottom(xScale)
        .tickSize(0)
        .tickPadding(10)

      const xAxisGroup = chartGroup
        .append('g')
        .attr('class', 'bar-chart__x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);


      // Style x-axis text with better mobile handling
      xAxisGroup
        .selectAll('text')
        .style('text-anchor', isMobile ? 'end' : 'middle')
        .style('font-size', isMobile ? '9px' : '12px')
        .style('font-weight', '400')
        .style('fill', '#6b7280')
        .attr('dx', isMobile ? '-.8em' : '0')
        .attr('dy', isMobile ? '.15em' : '.71em')
        .attr('transform', isMobile ? 'rotate(-45)' : 'rotate(0)')
        .each(function(d) {
          // Truncate long city names on mobile
          if (isMobile && d.length > 8) {
            d3.select(this).text(d.substring(0, 8) + '...');
          }
        });

      
      // Create enhanced Y axis
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(0)
        .tickPadding(10)
        .tickFormat(d => {
          if (d >= 1000) return `${(d / 1000).toFixed(1)}k`;
          return d.toString();
        });

      const yAxisGroup = chartGroup
        .append('g')
        .attr('class', 'bar-chart__y-axis')
        .call(yAxis);

        yAxisGroup
        .selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', '400')
        .style('fill', '#6b7280');

      // Add Y axis label with better positioning (hide on very small screens)
      if (!isMobile || innerWidth > 200) {
        chartGroup
          .append('text')
          .attr('class', 'bar-chart__y-label')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left + 15)
          .attr('x', -innerHeight / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', isMobile ? '10px' : '12px')
          .style('font-weight', '500')
          .style('fill', '#6b7280')
          .text(isMobile ? 'Towers' : 'Number of Towers');
      }

      // Add chart title if there's space
      if (!isMobile && margin.top > 25) {
        const titleGroup = svg.select('.bar-chart__title');
        if (titleGroup.empty()) {
          svg
            .append('text')
            .attr('class', 'bar-chart__title')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .style('fill', '#1f2937')
         }
      }
    };

    updateChart();

    // Cleanup function
    return cleanupTooltip;
  }, [dataHash, innerWidth, innerHeight, margin, isMobile, showValues, showGridLines, animationDuration, getBarColor, cleanupTooltip, processedData, width, ensureTooltip]);

  // Cleanup on unmount and ensure tooltip is properly removed
  useEffect(() => {
    return () => {
      cleanupTooltip();
    };
  }, [cleanupTooltip]);

  // Additional effect to handle page visibility changes and refreshes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible again, ensure tooltip state is reset
        if (tooltipRef.current && !document.body.contains(tooltipRef.current)) {
          tooltipRef.current = null;
        }
      }
    };

    const handleBeforeUnload = () => {
      cleanupTooltip();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupTooltip();
    };
  }, [cleanupTooltip]);

  if (!data.length) {
    return (
      <div className={`bar-chart bar-chart--empty ${className}`} data-testid={testId}>
        <div className="bar-chart__empty-state">
          <div className="icon">📊</div>
          <h4>No Data Available</h4>
          <p>There are no towers to display at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bar-chart ${className} ${isMobile ? 'bar-chart--mobile' : ''}`} data-testid={testId}>
      {isLoading && !isInitialized.current && (
        <div className="bar-chart__loading">
          <div className="spinner"></div>
          <span className="text">Loading chart...</span>
        </div>
      )}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bar-chart__svg"
        role="img"
        aria-label="Bar chart showing tower count by city"
        style={{ 
          opacity: isLoading && !isInitialized.current ? 0.3 : 1,
          maxWidth: '100%',
          height: 'auto'
        }}
        viewBox={isMobile ? `0 0 ${width} ${height}` : undefined}
        preserveAspectRatio={isMobile ? "xMidYMid meet" : undefined}
      >
        <desc>
          Bar chart displaying the number of cell towers in each city: {
            processedData.map(d => `${d.city}: ${d.count}`).join(', ')
          }
        </desc>
      </svg>
    </div>
  );
});

export default BarChart;