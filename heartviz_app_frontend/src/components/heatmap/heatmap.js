import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import mockCorrelationMatrix from "../../mockDataM.json";

const CorrelationMatrixHeatmap = () => {
  const [matrixData, setMatrixData] = useState(null);

  useEffect(() => {
    // Simulate API call by loading mock data
    setMatrixData(mockCorrelationMatrix.correlation_matrix);
  }, []);

  if (!matrixData) {
    return <p>Loading...</p>;
  }

  // Extract feature names and matrix values
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
            x: features, // Columns
            y: features, // Rows
            type: "heatmap",
            colorscale: "Portland", // Red to blue scale
            reversescale: true, // Reverse the scale to match your example
            zmid: 0, // Center the scale around 0
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
