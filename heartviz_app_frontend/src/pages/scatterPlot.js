import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import axios from 'axios';

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const [xFeature, setXFeature] = useState('');
  const [yFeatures, setYFeatures] = useState([]);
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
          setYFeatures([keys[1]]);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleXFeatureChange = (event) => {
    setXFeature(event.target.value);
  };

  const handleYFeaturesChange = (selectedOptions) => {
    setYFeatures(selectedOptions.map(option => option.value));
  };

  const normalize = (arr) => {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    return arr.map(value => (value - min) / (max - min));
  };

  const plotData = yFeatures.map((yFeature, index) => {
    const yValues = data.map(item => item[yFeature]);
    const normalizedYValues = normalize(yValues);
    return {
      x: data.map(item => item[xFeature]),
      y: normalizedYValues,
      mode: 'markers',
      type: 'scatter',
      name: yFeature,
      marker: { color: `hsl(${index * 360 / yFeatures.length}, 70%, 50%)` }
    };
  });

  return (
    <div>
      <Plot
        data={plotData}
        layout={{
          width: 1000,
          height: 600,
          title: 'Scatter Plot',
          xaxis: { title: xFeature },
          yaxis: { title: 'Normalized Values' },
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <label>
          X Axis 
          <select value={xFeature} onChange={handleXFeatureChange}>
            {features.map(feature => (
              <option key={feature} value={feature}>{feature}</option>
            ))}
          </select>
        </label>
        
      </div>

      


      <div style={{ marginTop: '20px' }}>   
        
        <label>
          Y Axis 
          <Select
            isMulti
            value={yFeatures.map(feature => ({ value: feature, label: feature }))}
            options={features.map(feature => ({ value: feature, label: feature }))}
            onChange={handleYFeaturesChange}
          />
        </label>
      </div>


    </div>
  );
};

export default ScatterPlot;
