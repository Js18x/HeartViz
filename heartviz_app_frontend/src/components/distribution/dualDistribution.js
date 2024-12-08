import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const DualSubspaceDistributionPlot = ({ subspace1Id, subspace2Id }) => {
  const [attribute, setAttribute] = useState("");
  const [label, setLabel] = useState("0");
  const [attributes, setAttributes] = useState([]);
  const [binSize, setBinSize] = useState(1);
  const [tempBinSize, setTempBinSize] = useState("1");
  const [subspace1Distribution, setSubspace1Distribution] = useState(null);
  const [subspace2Distribution, setSubspace2Distribution] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/feature_ranges", {
          params: { sub_ind: subspace1Id },
        });
        const attributes = Object.keys(response.data.feature_ranges);
        setAttributes(attributes);
        setAttribute(attributes[0]);
      } catch (err) {
        setError("Failed to fetch attributes.");
      }
    };

    fetchAttributes();
  }, [subspace1Id]);

  useEffect(() => {
    if (attribute) {
      const fetchDistributions = async () => {
        try {
          const subspace1Response = await axios.get(
            "http://127.0.0.1:5000/distribution_by_feature",
            {
              params: {
                sub_ind: subspace1Id,
                feature: attribute,
                by_label: true,
              },
            }
          );
          const subspace2Response = await axios.get(
            "http://127.0.0.1:5000/distribution_by_feature",
            {
              params: {
                sub_ind: subspace2Id,
                feature: attribute,
                by_label: true,
              },
            }
          );

          setSubspace1Distribution(subspace1Response.data);
          setSubspace2Distribution(subspace2Response.data);
        } catch (err) {
          setError("Failed to fetch distributions.");
        }
      };

      fetchDistributions();
    }
  }, [attribute, subspace1Id, subspace2Id]);

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
    if (!attribute || !subspace1Distribution || !subspace2Distribution) return [];

    const data1 = subspace1Distribution[label];
    const data2 = subspace2Distribution[label];

    if (!data1 || !data2) return [];

    const getBinnedData = (data) => {
      const keys = Object.keys(data).map((k) => parseFloat(k));
      if (keys.length === 0) {
        return {
          x: [],
          y: [],
        };
      }

      const min = Math.min(...keys);
      const max = Math.max(...keys);

      const bins = Math.ceil((max - min) / binSize);
      if (bins <= 0 || isNaN(bins)) {
        return {
          x: [],
          y: [],
        };
      }

      const binEdges = Array.from({ length: bins + 1 }, (_, i) => min + i * binSize);
      const binCounts = Array(bins).fill(0);

      keys.forEach((key) => {
        const binIndex = Math.min(Math.floor((key - min) / binSize), bins - 1);
        binCounts[binIndex] += data[key];
      });

      return {
        x: binEdges.slice(0, -1).map((edge, i) => `${edge.toFixed(2)} - ${(edge + binSize).toFixed(2)}`),
        y: binCounts,
      };
    };

    const binnedData1 = getBinnedData(data1);
    const binnedData2 = getBinnedData(data2);

    return [
      {
        x: binnedData1.x,
        y: binnedData1.y,
        name: `Subspace ${subspace1Id}`,
        type: "bar",
        marker: { color: "green" },
      },
      {
        x: binnedData2.x,
        y: binnedData2.y,
        name: `Subspace ${subspace2Id}`,
        type: "bar",
        marker: { color: "orange" },
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
        <label style={{ marginLeft: "20px", marginRight: "10px" }}>Severity level diagnosed:</label>
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          {subspace1Distribution &&
            Object.keys(subspace1Distribution).map((lbl) => (
              <option key={lbl} value={lbl}>
                {lbl}
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
            title: `Distribution of ${attribute} for Subspaces ${subspace1Id} and ${subspace2Id} given severity level diagnosed`,
            xaxis: {
              title: { text: attribute },
              tickangle: 45,
            },
            yaxis: {
              title: "Number of Diagnoses",
            },
            barmode: "group",
            margin: { b: 100 },
          }}
        />
      )}
    </div>
  );
};

export default DualSubspaceDistributionPlot;
