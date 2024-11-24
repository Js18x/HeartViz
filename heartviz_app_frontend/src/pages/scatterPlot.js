import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const [xFeature, setXFeature] = useState('');
  const [yFeature, setYFeature] = useState('');
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Replace with your actual URL
    axios.get('http://127.0.0.1:5000/fetch_data_with_features')
      .then(response => {
        console.log('Fetched data:', response.data); // Debug log to inspect fetched data

        const rawData = response.data.data;
        const keys = Object.keys(rawData);
        const transformedData = rawData[keys[0]].map((_, i) => {
          const obj = {};
          keys.forEach(key => {
            obj[key] = rawData[key][i];
          });
          return obj;
        });

        console.log('Transformed data:', transformedData); // Debug log to inspect transformed data

        setData(transformedData);
        setFeatures(keys);
        if (keys.length > 1) {
          setXFeature(keys[0]);
          setYFeature(keys[1]);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleXFeatureChange = (event) => {
    setXFeature(event.target.value);
  };

  const handleYFeatureChange = (event) => {
    setYFeature(event.target.value);
  };

  const filteredData = data.map(item => ({
    x: item[xFeature],
    y: item[yFeature]
  }));

  return (
    <div>
      <Plot
        data={[
          {
            x: filteredData.map(item => item.x),
            y: filteredData.map(item => item.y),
            mode: 'markers',
            type: 'scatter',
            marker: { color: 'red' }
          }
        ]}
        layout={{
          width: 1000,
          height: 600,
          title: 'Scatter Plot',
          xaxis: { title: xFeature },
          yaxis: { title: yFeature },
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <label>
          X Axis:
          <select value={xFeature} onChange={handleXFeatureChange}>
            {features.map(feature => (
              <option key={feature} value={feature}>{feature}</option>
            ))}
          </select>
        </label>
        <label>
          Y Axis:
          <select value={yFeature} onChange={handleYFeatureChange}>
            {features.map(feature => (
              <option key={feature} value={feature}>{feature}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ScatterPlot;
