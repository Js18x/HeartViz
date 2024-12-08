import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip
} from 'recharts';

const RadarComparisonRatio = () => {
  const location = useLocation();
  const [dataSubspace1, setDataSubspace1] = useState(null);
  const [dataSubspace2, setDataSubspace2] = useState(null);
  const [chartData, setChartData] = useState([]);

  const params = new URLSearchParams(location.search);
  const subInd1 = params.get('sub_ind1');
  const subInd2 = params.get('sub_ind2');
  const metric = params.get('metric') || 'max';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp1 = await fetch(`http://localhost:5000/get_feature_metric?sub_ind=${subInd1}&metric=${metric}`);
        const result1 = await resp1.json();

        const resp2 = await fetch(`http://localhost:5000/get_feature_metric?sub_ind=${subInd2}&metric=${metric}`);
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

      const combinedData = features.map(feature => {
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
          Subspace2_orig: val2
        };
      });

      setChartData(combinedData);
    }
  }, [dataSubspace1, dataSubspace2]);

  if (!subInd1 || !subInd2) {
    return <div>Please provide sub_ind1 and sub_ind2 in the query parameters.</div>;
  }

  if (chartData.length === 0) {
    return <div>Loading data...</div>;
  }

  const domain = [0, 1];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: '5px' }}>
          <h4>{dataPoint.feature}</h4>
          <p><strong>Subspace {subInd1}:</strong> Original: {dataPoint.Subspace1_orig}, Ratio: {dataPoint.Subspace1.toFixed(2)}</p>
          <p><strong>Subspace {subInd2}:</strong> Original: {dataPoint.Subspace2_orig}, Ratio: {dataPoint.Subspace2.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <h2>Radar Comparison for Subspace {subInd1} vs Subspace {subInd2} ({metric.toUpperCase()})</h2>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" width={500} height={500} data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="feature" />
        <PolarRadiusAxis angle={30} domain={domain} />
        <Radar name={`Subspace ${subInd1}`} dataKey="Subspace1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name={`Subspace ${subInd2}`} dataKey="Subspace2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
      <p>
        Each feature value is represented as a ratio of that subspace's value to the sum of both subspace values for that feature.
        This highlights the proportional contribution of each subspace without absolute scaling.
      </p>
    </div>
  );
};

export default RadarComparisonRatio;
