// src/components/Charts/PieChart/PieChart.tsx
import React, { useRef, useEffect, memo } from "react";
import * as d3 from "d3";
import type { ChartProps, StatusCount, ChartDimensions } from "../../../types/dashboard.types";
import { useResponsive } from "../../../hooks/useResponsive";
import "./PieChart.scss";

interface PieChartProps extends Omit<ChartProps, "data"> {
  data: StatusCount[];
  dimensions?: Partial<ChartDimensions>;
}

const PieChart: React.FC<PieChartProps> = memo(
  ({ data, dimensions, className = "", testId = "pie-chart" }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const { isMobile } = useResponsive();

    const defaultDimensions: ChartDimensions = {
      width: isMobile ? 300 : 400,
      height: 300,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const chartDimensions = { ...defaultDimensions, ...dimensions };
    const { width, height, margin } = chartDimensions;
    const radius =
      Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

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

      // Tooltip (once)
      if (!tooltipRef.current) {
        tooltipRef.current = document.createElement("div");
        tooltipRef.current.className = "pie-chart__tooltip";
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
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", () => {
              const [x, y] = arc.centroid(d);
              return `translate(${x * 0.1},${y * 0.1})`;
            });

          tooltip
            .style("opacity", "1")
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
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).attr("transform", "translate(0,0)");
          tooltip.transition().duration(200).style("opacity", "0");
        })
        .transition()
        .duration(1000)
        .attrTween("d", (d) => {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return (t) => arc(i(t)) || "";
        });

      // Labels
      slices
        .append("text")
        .attr("class", "pie-chart__label")
        .attr("transform", (d) => {
          const [x, y] = arc.centroid(d);
          return `translate(${x * 1.4}, ${y * 1.4})`;
        })
        .attr("text-anchor", (d) =>
          d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI ? "start" : "end"
        )
        .style("opacity", 0)
        .text((d) => `${d.data.percentage}%`)
        .transition()
        .delay(500)
        .duration(1000)
        .style("opacity", 1);

      // Polylines
      slices
        .append("polyline")
        .attr("class", "pie-chart__polyline")
        .attr("points", (d) => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos].toString();
        })
        .style("opacity", 0)
        .transition()
        .delay(500)
        .duration(1000)
        .style("opacity", 0.7);

      // Legend
      const legend = svg
        .append("g")
        .attr("class", "pie-chart__legend")
        .attr("transform", `translate(${width - 120}, 20)`);

      const legendItems = legend
        .selectAll(".pie-chart__legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "pie-chart__legend-item")
        .attr("transform", (_, i) => `translate(0, ${i * 25})`);

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
        .text((d) => (d.status === "active" ? "Active" : "Offline"));

      return () => {
        tooltip.remove();
        tooltipRef.current = null;
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
          <desc>
            {data.map((d) => `${d.status}: ${d.count} (${d.percentage}%)`).join(", ")}
          </desc>
        </svg>
      </div>
    );
  }
);

PieChart.displayName = "PieChart";
export default PieChart;
