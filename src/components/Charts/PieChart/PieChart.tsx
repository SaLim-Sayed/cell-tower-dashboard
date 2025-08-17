import * as d3 from "d3";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import type { ChartDimensions, StatusCount } from "../../../types/dashboard";
import type { IPieChartProps } from "../@types";
import "./PieChart.scss";



const PieChart: React.FC<IPieChartProps> = memo(
  ({ data, dimensions, className = "", testId = "pie-chart" }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const { isMobile } = useResponsive();

    const defaultDimensions: ChartDimensions = {
      width: isMobile ? 350 : 500,
      height: isMobile ? 280 : 350,
      margin: { top: 90, right: 20, bottom: 20, left: 20 },
    };

    const chartDimensions = { ...defaultDimensions, ...dimensions };
    const { width, height, margin } = chartDimensions;
    const radius =
      Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

    // Cleanup function to remove tooltip
    const cleanupTooltip = useCallback(() => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (!svgRef.current || !data.length) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Create group
      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie<StatusCount>().value((d) => d.count).sort(null);

      const arc = d3
        .arc<d3.PieArcDatum<StatusCount>>()
        .innerRadius(0)
        .outerRadius(radius - 10);

      const outerArc = d3
        .arc<d3.PieArcDatum<StatusCount>>()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      // Create tooltip if it doesn't exist
      if (!tooltipRef.current) {
        tooltipRef.current = document.createElement("div");
        tooltipRef.current.className = "pie-chart__tooltip";
        tooltipRef.current.style.opacity = "0";
        document.body.appendChild(tooltipRef.current);
      }
      const tooltip = d3.select(tooltipRef.current);

      // Slices
      const slices = g
        .selectAll(".pie-chart__slice")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "pie-chart__slice");

      slices
        .append("path")
        .attr("class", "pie-chart__path")
        .attr("fill", (d) => d.data.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
          // Enhance slice on hover
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", () => {
              const [x, y] = arc.centroid(d);
              return `translate(${x * 0.1},${y * 0.1})`;
            });

          // Show tooltip
          tooltip
            .transition()
            .duration(200)
            .style("opacity", "1")
            .style("visibility", "visible");

          tooltip
            .html(
              `<div class="pie-chart__tooltip-content">
                <strong>${d.data.status === "active" ? "Active" : "Offline"}</strong><br/>
                ${d.data.count} towers (${d.data.percentage}%)
              </div>`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mousemove", (event) => {
          if (tooltipRef.current) {
            tooltip
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 10}px`);
          }
        })
        .on("mouseout", function () {
          // Reset slice position
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", "translate(0,0)");
          
          // Hide tooltip
          tooltip
            .transition()
            .duration(200)
            .style("opacity", "0")
            .style("visibility", "hidden");
        })
        .transition()
        .duration(1000)
        .attrTween("d", (d) => {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return (t) => arc(i(t)) || "";
        });

      // Only show labels and polylines if there's enough space and data
      const showLabels = radius > 80 && data.length <= 6;

      if (showLabels) {
        // Labels with better positioning
        slices
          .append("text")
          .attr("class", "pie-chart__label")
          .attr("transform", (d) => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            const isRightSide = midAngle < Math.PI;
            const outerPoint = outerArc.centroid(d);
            
            // Position labels at the end of arrows with some padding
            const labelX = radius * 0.95 * (isRightSide ? 1 : -1) + (isRightSide ? 10 : -10);
            const labelY = outerPoint[1];
            
            return `translate(${labelX}, ${labelY})`;
          })
          .attr("text-anchor", (d) => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midAngle < Math.PI ? "start" : "end";
          })
          .attr("dominant-baseline", "middle")
          .style("opacity", 0)
          .style("font-weight", "600")
          .text((d) => `${d.data.percentage}%`)
          .transition()
          .delay(800)
          .duration(1000)
          .style("opacity", 1);

        // Polylines (arrows)
        slices
          .append("polyline")
          .attr("class", "pie-chart__polyline")
          .attr("points", (d) => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            const isRightSide = midAngle < Math.PI;
            
            // Start point: edge of the pie slice
            const startPoint = arc.centroid(d);
            
            // Middle point: on the outer arc
            const outerPoint = outerArc.centroid(d);
            
            // End point: extended horizontally for better label positioning
            const endPoint = [
              radius * 0.95 * (isRightSide ? 1 : -1),
              outerPoint[1]
            ];
            
            // Create a smooth curve by adding control points
            const controlPoint1 = [
              startPoint[0] * 1.2,
              startPoint[1] * 1.2
            ];
            
            return [startPoint, controlPoint1, outerPoint, endPoint]
              .map(point => point.join(","))
              .join(" ");
          })
          .style("opacity", 0)
          .style("stroke-dasharray", "2,2") // Add dashed line style
          .transition()
          .delay(500)
          .duration(1000)
          .style("opacity", 0.7);

        // Add arrow heads to polylines
        slices
          .append("polygon")
          .attr("class", "pie-chart__arrow-head")
          .attr("points", (d) => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            const isRightSide = midAngle < Math.PI;
            const outerPoint = outerArc.centroid(d);
            
            // Arrow head position
            const arrowX = radius * 0.95 * (isRightSide ? 1 : -1);
            const arrowY = outerPoint[1];
            
            // Arrow head size
            const arrowSize = 4;
            
            // Create arrow head points
            if (isRightSide) {
              // Right-pointing arrow
              return `${arrowX},${arrowY} ${arrowX - arrowSize},${arrowY - arrowSize/2} ${arrowX - arrowSize},${arrowY + arrowSize/2}`;
            } else {
              // Left-pointing arrow
              return `${arrowX},${arrowY} ${arrowX + arrowSize},${arrowY - arrowSize/2} ${arrowX + arrowSize},${arrowY + arrowSize/2}`;
            }
          })
          .style("opacity", 0)
          .style("fill", "currentColor")
          .transition()
          .delay(700)
          .duration(800)
          .style("opacity", 0.8);
      }

      // Legend
      const legendWidth = 120;
      const legendX = Math.max(width - legendWidth - 10, width * 0.7);
      
      const legend = svg
        .append("g")
        .attr("class", "pie-chart__legend")
        .attr("transform", `translate(${legendX}, 20)`);

      const legendItems = legend
        .selectAll(".pie-chart__legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "pie-chart__legend-item")
        .attr("transform", (_, i) => `translate(0, ${i * 25})`)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          // Highlight corresponding slice
          const sliceIndex = data.indexOf(d);
          g.selectAll(".pie-chart__slice")
            .filter((_, i) => i === sliceIndex)
            .select("path")
            .transition()
            .duration(200)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr("transform", function(sliceData: any) {
              const [x, y] = arc.centroid(sliceData);
              return `translate(${x * 0.1},${y * 0.1})`;
            });
        })
        .on("mouseout", function(event, d) {
          // Reset slice
          const sliceIndex = data.indexOf(d);
          g.selectAll(".pie-chart__slice")
            .filter((_, i) => i === sliceIndex)
            .select("path")
            .transition()
            .duration(200)
            .attr("transform", "translate(0,0)");
        });

      legendItems
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("rx", 2)
        .attr("fill", (d) => d.color);

      legendItems
        .append("text")
        .attr("x", 18)
        .attr("y", 6)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("fill", "currentColor")
        .text((d) => (d.status === "active" ? "Active" : "Offline"));

      // Cleanup function
      return cleanupTooltip;
    }, [data, width, height, radius, cleanupTooltip]);

    // Cleanup on unmount
    useEffect(() => {
      return cleanupTooltip;
    }, [cleanupTooltip]);

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
          <desc>
            {data.map((d) => `${d.status}: ${d.count} (${d.percentage}%)`).join(", ")}
          </desc>
        </svg>
      </div>
    );
  }
);


export default PieChart;