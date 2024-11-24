import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" name={xFeature} />
          <YAxis dataKey="y" name={yFeature} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Data" data={filteredData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
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
