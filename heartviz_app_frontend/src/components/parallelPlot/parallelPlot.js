import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DimensionItem = ({ dimension, index, moveDimension, toggleDimension, selected }) => {
  const ref = useRef();

  const [, drop] = useDrop({
    accept: "DIMENSION",
    hover(item) {
      if (item.index !== index) {
        moveDimension(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "DIMENSION",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: "8px",
        margin: "4px 0",
        backgroundColor: selected ? "#1976D2" : "#e0e0e0",
        color: selected ? "#fff" : "#000",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        borderRadius: "4px",
        textAlign: "center",
      }}
      onClick={() => toggleDimension(dimension)}
    >
      {dimension}
    </div>
  );
};

const ParallelCoordinatesPlot = ({ subspaceId }) => {
  const containerRef = useRef();
  const [data, setData] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subspaceId) throw new Error("Subspace ID is missing.");
        const response = await fetch(
          `http://127.0.0.1:5000/fetch_data_with_features?sub_ind=${subspaceId}`
        );
        const result = await response.json();

        if (result.data) {
          const rawData = result.data;

          const formattedData = Object.keys(
            rawData[Object.keys(rawData)[0]]
          ).map((_, i) =>
            Object.fromEntries(
              Object.entries(rawData).map(([key, values]) => [
                key,
                Number(values[i]) || 0,
              ])
            )
          );

          setData(formattedData);
          setDimensions(Object.keys(rawData));
          setSelectedDimensions(Object.keys(rawData));
        } else {
          throw new Error(result.error || "Failed to fetch data.");
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subspaceId]);

  useEffect(() => {
    if (!data.length) return;
  
    d3.select(containerRef.current).selectAll("*").remove();
  
    if (!selectedDimensions.length) {
      d3.select(containerRef.current)
        .append("text")
        .attr("x", 200)
        .attr("y", 200)
        .style("font-size", "16px")
        .text("No dimensions selected. Please select at least one.");
      return;
    }
  
    const margin = { top: 30, right: 80, bottom: 10, left: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const yScales = {};
    selectedDimensions.forEach((dimension) => {
      yScales[dimension] = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[dimension]))
        .range([height, 0]);
    });
  
    const xScale = d3
      .scalePoint()
      .domain(selectedDimensions)
      .range([0, width])
      .padding(0.5);
  
    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(data, (d) => d[selectedDimensions[0]]));
  
    const paths = svg
      .append("g")
      .selectAll(".path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d) =>
        d3.line()(
          selectedDimensions.map((dimension) => [
            xScale(dimension),
            yScales[dimension](d[dimension]),
          ])
        )
      )
      .style("fill", "none")
      .style("stroke", (d) => colorScale(d[selectedDimensions[0]]))
      .style("stroke-width", 2)
      .style("opacity", 0.7);
  
    paths
      .on("mouseover", function () {
        d3.select(this)
          .raise()
          .style("stroke-width", 4)
          .style("opacity", 1);
  
        paths.filter((p) => p !== this.__data__).style("opacity", 0.1);
      })
      .on("mouseout", function () {
        d3.select(this).style("stroke-width", 2).style("opacity", 0.7);
  
        paths.style("opacity", 0.7);
      });
  
    svg
      .selectAll(".dimension")
      .data(selectedDimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", (d) => `translate(${xScale(d)})`)
      .each(function (dimension) {
        d3.select(this)
          .call(d3.axisLeft(yScales[dimension]).ticks(6))
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", -9)
          .text(dimension)
          .style("fill", "black")
          .style("font-size", "12px");
      });
  }, [data, selectedDimensions]);

  const toggleDimension = (dimension) => {
    setSelectedDimensions((prev) => {
      if (prev.includes(dimension)) {
        return prev.filter((d) => d !== dimension);
      } else {
        const newSelection = [...prev, dimension];
        return dimensions.filter((dim) => newSelection.includes(dim));
      }
    });
  };

  const moveDimension = (fromIndex, toIndex) => {
    setDimensions((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      setSelectedDimensions((selected) =>
        updated.filter((dim) => selected.includes(dim))
      );
      return updated;
    });
  };

  if (loading) return <div>Loading Parallel Coordinates Plot...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.length || !dimensions.length) {
    return <div>No data available for the Parallel Coordinates Plot.</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div ref={containerRef} style={{ flex: 1 }}></div>
        <div
          style={{
            width: "200px",
            padding: "10px",
            background: "#f8f9fa",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginLeft: "10px",
          }}
        >
          <h3>Reorder & Toggle Dimensions</h3>
          {dimensions.map((dimension, index) => (
            <DimensionItem
              key={dimension}
              dimension={dimension}
              index={index}
              moveDimension={moveDimension}
              toggleDimension={toggleDimension}
              selected={selectedDimensions.includes(dimension)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default ParallelCoordinatesPlot;