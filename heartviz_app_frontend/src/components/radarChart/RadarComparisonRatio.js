import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";
import "./RadarComparisonRatio.css";

const RadarComparisonRatio = ({ subInd1, subInd2, metric, subspace1Name, subspace2Name }) => {
  const [dataSubspace1, setDataSubspace1] = useState(null);
  const [dataSubspace2, setDataSubspace2] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricCleaned = metric.trim();
        console.log("Fetching data for Subspaces:", subInd1, subInd2);

        const resp1 = await fetch(
          `http://127.0.0.1:5000/get_feature_metric?sub_ind=${subInd1}&metric=${encodeURIComponent(metricCleaned)}`
        );
        const result1 = await resp1.json();
        console.log("API Response for Subspace 1:", result1);

        const resp2 = await fetch(
          `http://127.0.0.1:5000/get_feature_metric?sub_ind=${subInd2}&metric=${encodeURIComponent(metricCleaned)}`
        );
        const result2 = await resp2.json();
        console.log("API Response for Subspace 2:", result2);

        if (!result1 || !result2) {
          console.error("Empty data returned from API");
          setDataSubspace1(null);
          setDataSubspace2(null);
          return;
        }

        setDataSubspace1(result1);
        setDataSubspace2(result2);
      } catch (error) {
        console.error("Error fetching radar data:", error);
      }
    };

    if (subInd1 !== null && subInd1 !== undefined && subInd2 !== null && subInd2 !== undefined) {
      fetchData();
    }
  }, [subInd1, subInd2, metric]);

  useEffect(() => {
    if (dataSubspace1 && dataSubspace2) {
      console.log("Processing chart data for Subspaces:", subInd1, subInd2);
      const allFeatures = new Set([...Object.keys(dataSubspace1), ...Object.keys(dataSubspace2)]);
  
      const combinedData = Array.from(allFeatures).map((feature) => {
        const val1 = dataSubspace1[feature] || 0;
        const val2 = dataSubspace2[feature] || 0;
        const sum = val1 + val2;
  
        const ratio1 = sum === 0 ? 0 : val1 / sum; 
        const ratio2 = sum === 0 ? 0 : val2 / sum;
  
        return {
          feature,
          Subspace1: ratio1,
          Subspace2: ratio2,
          Subspace1_orig: val1,
          Subspace2_orig: val2,
        };
      });
  
      console.log("Chart Data:", combinedData);
      setChartData(combinedData);
    }
  }, [dataSubspace1, dataSubspace2]);

  console.log("SubInd1:", subInd1, "SubInd2:", subInd2);

  if (subInd1 === null || subInd1 === undefined || subInd2 === null || subInd2 === undefined) {
    return <div>Please provide valid subspace indices.</div>;
  }

  if (chartData.length === 0) {
    return <div>Loading data...</div>;
  }

  const domain = [0, 1];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "5px",
          }}
        >
          <h4>{dataPoint.feature}</h4>
          <p>
            <strong>{subspace1Name}:</strong> Original:{" "}
            {dataPoint.Subspace1_orig}, Ratio: {dataPoint.Subspace1.toFixed(2)}
          </p>
          <p>
            <strong>{subspace2Name}:</strong> Original:{" "}
            {dataPoint.Subspace2_orig}, Ratio: {dataPoint.Subspace2.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 500 }}>
      <RadarChart
        className="custom-radar-chart"
        cx="50%"
        cy="50%"
        outerRadius="70%"
        width={500}
        height={500}
        data={chartData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="feature" className="axis-label" />
        <PolarRadiusAxis angle={30} domain={domain} className="axis-label" />
        <Radar
          name={subspace1Name}
          dataKey="Subspace1"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name={subspace2Name}
          dataKey="Subspace2"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </div>
  );
};

export default RadarComparisonRatio;
