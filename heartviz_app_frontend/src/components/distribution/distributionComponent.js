import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const DistributionPlot = ({ subspaceId }) => {
  const [attribute, setAttribute] = useState("");
  const [label, setLabel] = useState("global");
  const [attributes, setAttributes] = useState([]);
  const [binSize, setBinSize] = useState(10);
  const [tempBinSize, setTempBinSize] = useState("10");
  const [globalDistribution, setGlobalDistribution] = useState(null);
  const [labelWiseDistribution, setLabelWiseDistribution] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/feature_ranges", {
          params: { sub_ind: subspaceId },
        });
        const attributes = Object.keys(response.data.feature_ranges);
        setAttributes(attributes);
        setAttribute(attributes[0]);
      } catch (err) {
        setError("Failed to fetch attributes.");
      }
    };

    fetchAttributes();
  }, [subspaceId]);

  useEffect(() => {
    if (attribute) {
      const fetchGlobalDistribution = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/distribution_by_feature", {
            params: { sub_ind: subspaceId, feature: attribute, by_label: false },
          });
          setGlobalDistribution(response.data);
        } catch (err) {
          setError("Failed to fetch global distribution.");
        }
      };

      const fetchLabelWiseDistribution = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/distribution_by_feature", {
            params: { sub_ind: subspaceId, feature: attribute, by_label: true },
          });
          setLabelWiseDistribution(response.data);
        } catch (err) {
          setError("Failed to fetch label-wise distribution.");
        }
      };

      fetchGlobalDistribution();
      fetchLabelWiseDistribution();
    }
  }, [attribute, subspaceId]);

  const handleBinSizeChange = (e) => {
    setTempBinSize(e.target.value);
  };

  const handleBinSizeBlur = () => {
    const value = parseInt(tempBinSize, 10);
    if (!value || value <= 0) {
      setBinSize(1);
      setTempBinSize("1");
    } else {
      setBinSize(value);
      setTempBinSize(String(value));
    }
  };

  const plotData = () => {
    if (!attribute) return [];

    let data = globalDistribution;
    if (label !== "global" && labelWiseDistribution[label]) {
      data = labelWiseDistribution[label];
    }

    if (!data) return [];

    const keys = Object.keys(data).map((k) => parseFloat(k));
    const min = Math.min(...keys);
    const max = Math.max(...keys);
    const bins = Math.ceil((max - min) / binSize);

    const binEdges = Array.from({ length: bins + 1 }, (_, i) => min + i * binSize);
    const binCounts = Array(bins).fill(0);

    keys.forEach((key) => {
      const binIndex = Math.min(Math.floor((key - min) / binSize), bins - 1);
      binCounts[binIndex] += data[key];
    });

    return [
      {
        x: binEdges.slice(0, -1).map((edge, i) => `${edge.toFixed(2)} - ${(edge + binSize).toFixed(2)}`),
        y: binCounts,
        type: "bar",
        marker: { color: "green" },
      },
    ];
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Attribute:</label>
        <select value={attribute} onChange={(e) => setAttribute(e.target.value)}>
          {attributes.map((attr) => (
            <option key={attr} value={attr}>
              {attr}
            </option>
          ))}
        </select>
        <label style={{ marginLeft: "20px", marginRight: "10px" }}>Label:</label>
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          <option value="global">Global</option>
          {Object.keys(labelWiseDistribution).map((lbl) => (
            <option key={lbl} value={lbl}>
              Label {lbl}
            </option>
          ))}
        </select>
        <label style={{ marginLeft: "20px", marginRight: "10px" }}>Bin Size:</label>
        <input
          type="number"
          value={tempBinSize}
          onChange={handleBinSizeChange}
          onBlur={handleBinSizeBlur}
          style={{ width: "60px" }}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {plotData().length > 0 && (
        <Plot
          data={plotData()}
          layout={{
            title: `Distribution of ${attribute} in relation to ${label === "global" ? "Global" : `severity rate ${label}`}`,
            xaxis: {
              title: { text: attribute, standoff: 40 },
              tickangle: 45,
            },
            yaxis: {
              title: "Number of diagnoses",
            },
            margin: { b: 100 },
          }}
        />
      )}
    </div>
  );
};

export default DistributionPlot;