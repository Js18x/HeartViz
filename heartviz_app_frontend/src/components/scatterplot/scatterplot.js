import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const ScatterplotComponent = ({ subspaceId, xFeature, yFeature, setXFeature, setYFeature }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!subspaceId) {
          throw new Error("Subspace ID is required for fetching data.");
        }

        const response = await fetch(
          `http://127.0.0.1:5000/fetch_data_with_features?sub_ind=${subspaceId}`
        );
        const responseData = await response.json();

        if (responseData.data) {
          setData(responseData.data);
        } else if (responseData.error) {
          throw new Error(responseData.error);
        } else {
          throw new Error("Unexpected API response.");
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subspaceId]);

  if (loading) {
    return <p>Loading data for scatterplot...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <p>No data available for this subspace.</p>;
  }

  const featureKeys = Object.keys(data);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          X-Axis:
          <select
            value={xFeature}
            onChange={(e) => setXFeature(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Select Feature</option>
            {featureKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label>
          Y-Axis:
          <select
            value={yFeature}
            onChange={(e) => setYFeature(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Select Feature</option>
            {featureKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>
      {xFeature && yFeature && (
        <Plot
          data={[
            {
              x: data[xFeature],
              y: data[yFeature],
              mode: "markers",
              type: "scatter",
              marker: { size: 10 },
            },
          ]}
          layout={{
            xaxis: { title: xFeature },
            yaxis: { title: yFeature },
            width: 700,
            height: 500,
          }}
        />
      )}
    </div>
  );
};

export default ScatterplotComponent;