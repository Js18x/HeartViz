import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const DimensionalityReductionPlot = ({ subspaceId }) => {
  const [reducedData, setReducedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReducedData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/dimension_reduce", {
          params: { sub_ind: subspaceId, n_components: 2 },
        });
        const data = response.data;

        console.log("Dimensionality Reduction Data:", data);

        if (!Array.isArray(data) && typeof data === "object") {
          const transposedData = Object.keys(data.target).map((_, idx) => ({
            compo_feature0: data.compo_feature0[idx],
            compo_feature1: data.compo_feature1[idx],
            target: data.target[idx],
          }));
          setReducedData(transposedData);
        } else {
          setReducedData(data);
        }
      } catch (err) {
        console.error("Error fetching dimensionality reduction data:", err);
        setError("Error fetching dimensionality reduction data.");
      }
    };

    fetchReducedData();
  }, [subspaceId]);

  const getPlotData = () => {
    if (!reducedData || reducedData.length === 0) return [];
    const uniqueClasses = [...new Set(reducedData.map((d) => d.target))];

    console.log("Unique Classes:", uniqueClasses);

    const colorPalette = [
      "#1f77b4", 
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
    ];

    return uniqueClasses.map((cls, index) => ({
      x: reducedData.filter((d) => d.target === cls).map((d) => d.compo_feature0),
      y: reducedData.filter((d) => d.target === cls).map((d) => d.compo_feature1),
      mode: "markers",
      type: "scatter",
      marker: {
        color: colorPalette[index % colorPalette.length],
        size: 10,
        line: { width: 1, color: "black" },
      },
      name: `Class ${cls}`,
    }));
  };

  return (
    <div>
      <h2>Dimensionality Reduction Plot</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reducedData.length > 0 ? (
        <Plot
          data={getPlotData()}
          layout={{
            height: 600,
            width: 800,
          }}
        />
      ) : (
        <p>Loading dimensionality reduction data...</p>
      )}
    </div>
  );
};

export default DimensionalityReductionPlot;
