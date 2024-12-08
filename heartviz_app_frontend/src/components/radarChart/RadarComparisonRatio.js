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

const RadarComparisonRatio = ({ subInd1, subInd2, metric }) => {
  const [dataSubspace1, setDataSubspace1] = useState(null);
  const [dataSubspace2, setDataSubspace2] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp1 = await fetch(
          `http://127.0.0.1:5000/get_feature_metric?sub_ind=${subInd1}&metric=${metric}`
        );
        const result1 = await resp1.json();

        const resp2 = await fetch(
          `http://127.0.0.1:5000/get_feature_metric?sub_ind=${subInd2}&metric=${metric}`
        );
        const result2 = await resp2.json();

        setDataSubspace1(result1);
        setDataSubspace2(result2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (subInd1 && subInd2) {
      fetchData();
    }
  }, [subInd1, subInd2, metric]);

  useEffect(() => {
    if (dataSubspace1 && dataSubspace2) {
      const features = Object.keys(dataSubspace1);

      const combinedData = features.map((feature) => {
        const val1 = dataSubspace1[feature];
        const val2 = dataSubspace2[feature];
        const sum = val1 + val2;

        const ratio1 = sum === 0 ? 0.5 : val1 / sum;
        const ratio2 = sum === 0 ? 0.5 : val2 / sum;

        return {
          feature,
          Subspace1: ratio1,
          Subspace2: ratio2,
          Subspace1_orig: val1,
          Subspace2_orig: val2,
        };
      });

      setChartData(combinedData);
    }
  }, [dataSubspace1, dataSubspace2]);

  if (!subInd1 || !subInd2) {
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
            <strong>Subspace {subInd1}:</strong> Original:{" "}
            {dataPoint.Subspace1_orig}, Ratio: {dataPoint.Subspace1.toFixed(2)}
          </p>
          <p>
            <strong>Subspace {subInd2}:</strong> Original:{" "}
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
          name={`Subspace ${subInd1}`}
          dataKey="Subspace1"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name={`Subspace ${subInd2}`}
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
