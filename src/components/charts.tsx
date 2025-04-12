import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ChartData {
  month: string;
  sales?: number;
  orders?: number;
}

interface ChartProps {
  data: ChartData[];
}

export function LineChart({ data }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d: ChartData) => d.month))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.sales || 0) || 0])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "var(--text-light-secondary)");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "var(--text-light-secondary)");

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "var(--primary-color)")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line<ChartData>()
          .x((d: ChartData) => x(d.month)! + x.bandwidth() / 2)
          .y((d: ChartData) => y(d.sales || 0))
      );

    // Add dots
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: ChartData) => x(d.month)! + x.bandwidth() / 2)
      .attr("cy", (d: ChartData) => y(d.sales || 0))
      .attr("r", 4)
      .attr("fill", "var(--primary-color)");
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
}

export function BarChart({ data }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d: ChartData) => d.month))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.orders || 0) || 0])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "var(--text-light-secondary)");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "var(--text-light-secondary)");

    // Add bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: ChartData) => x(d.month)!)
      .attr("y", (d: ChartData) => y(d.orders || 0))
      .attr("width", x.bandwidth())
      .attr("height", (d: ChartData) => height - y(d.orders || 0))
      .attr("fill", "var(--primary-color)")
      .attr("opacity", 0.8);
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
