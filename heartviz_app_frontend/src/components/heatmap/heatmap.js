import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const CorrelationMatrixHeatmap = ({ subspaceId, onMatrixClick }) => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCorrelationMatrix = async () => {
      try {
        if (!subspaceId) {
          throw new Error("Subspace ID is missing.");
        }

        const response = await fetch(
          `http://127.0.0.1:5000/correlation_matrix?sub_ind=${subspaceId}`
        );
        const data = await response.json();

        if (data.correlation_matrix) {
          setMatrixData(data.correlation_matrix);
        } else {
          throw new Error(data.error || "Failed to fetch correlation matrix.");
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationMatrix();
  }, [subspaceId]);

  if (loading) {
    return <div className="loading-spinner">Loading correlation matrix...</div>;
  }

  if (error) {
    return <p>Error fetching the correlation matrix: {error}</p>;
  }

  if (!matrixData || Object.keys(matrixData).length === 0) {
    return (
      <p>No correlation matrix data available for the selected subspace.</p>
    );
  }

  const features = Object.keys(matrixData);

  // Create zValues and mask matrices
  const zValues = features.map((rowKey, rowIndex) =>
    features.map((colKey, colIndex) =>
      rowIndex === colIndex ? NaN : matrixData[rowKey][colKey]
    )
  );

  const zTooltip = features.map((rowKey, rowIndex) =>
    features.map((colKey, colIndex) =>
      rowIndex === colIndex
        ? "Self-correlation"
        : `Correlation: ${matrixData[rowKey][colKey].toFixed(2)}`
    )
  );

  const handleClick = (row, col) => {
    if (onMatrixClick) {
      onMatrixClick(features[col], features[row]);
    }
  };

  return (
    <div>
      <Plot
        data={[
          {
            z: zValues,
            x: features,
            y: features,
            text: zTooltip,
            hoverinfo: "text",
            type: "heatmap",
            colorscale: "Portland",
            reversescale: true,
            zmid: 0,
            zmin: -1,
            zmax: 1,
            showscale: true,
          },
        ]}
        layout={{
          width: 700,
          height: 700,
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
          margin: {
            l: 80,
            r: 40,
            t: 40,
            b: 40,
          },
        }}
        onClick={(data) => {
          const { points } = data;
          if (points && points[0]) {
            const { x, y } = points[0];
            handleClick(features.indexOf(y), features.indexOf(x));
          }
        }}
      />
    </div>
  );
};

export default CorrelationMatrixHeatmap;