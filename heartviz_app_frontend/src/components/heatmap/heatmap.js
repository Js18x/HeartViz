import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useSearchParams } from "react-router-dom";

const CorrelationMatrixHeatmap = () => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const subspaceId = searchParams.get("id");

  useEffect(() => {
    const fetchCorrelationMatrix = async () => {
      try {
        console.log("Subspace ID being sent:", subspaceId);
        if (!subspaceId) {
          throw new Error("Subspace ID is missing from the URL.");
        }

        const response = await fetch(
          `http://127.0.0.1:5000/correlation_matrix?sub_ind=${subspaceId}`
        );
        console.log(
          "API call URL:",
          `http://127.0.0.1:5000/correlation_matrix?sub_ind=${subspaceId}`
        );
        const data = await response.json();

        console.log("Response data:", data);
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
  const zValues = features.map((rowKey) =>
    features.map((colKey) => matrixData[rowKey][colKey])
  );

  return (
    <div>
      <h1>Correlation Matrix Heatmap</h1>
      <Plot
        data={[
          {
            z: zValues,
            x: features,
            y: features,
            type: "heatmap",
            colorscale: "Portland",
            reversescale: true,
            zmid: 0,
          },
        ]}
        layout={{
          title: "Correlation Matrix",
          xaxis: {
            title: "Features",
            side: "bottom",
          },
          yaxis: {
            title: "Features",
            automargin: true,
          },
          width: 700,
          height: 700,
        }}
      />
    </div>
  );
};

export default CorrelationMatrixHeatmap;
