import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import varDescription from "../../varDescription.json"; // Import the JSON file


const ScatterplotComponent = ({ subspaceId, xFeature, yFeature, setXFeature, setYFeature }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [llmResponse, setLlmResponse] = useState(""); // To store the LLM response
  const [loadingLLM, setLoadingLLM] = useState(false); // To manage LLM loading state

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


  useEffect(() => {
    // Trigger LLM response fetch when both xFeature and yFeature are selected
    if (xFeature && yFeature) {
      fetchLLMResponse(xFeature, yFeature);
    }
  }, [xFeature, yFeature]);

  const fetchLLMResponse = async (feature1, feature2) => {
    try {
      setLoadingLLM(true);
      setLlmResponse(""); // Reset previous response

      // Find full names of the selected features from varDescription.json
      const feature1Desc = varDescription.find(item => item["Variable Name"] === feature1);
      const feature2Desc = varDescription.find(item => item["Variable Name"] === feature2);

      if (!feature1Desc || !feature2Desc) {
        throw new Error("Feature names not found in the description file.");
      }

      const fullName1 = feature1Desc["Full Name"].replace(/\s+/g, "%20");
      const fullName2 = feature2Desc["Full Name"].replace(/\s+/g, "%20");

      // Construct the API URL
      const apiUrl = `http://127.0.0.1:5000/get_llm_response?feature1=${fullName1}&feature2=${fullName2}&word_limit=100`;
      console.log(apiUrl)

      const response = await fetch(apiUrl);
      
      const data = await response.json();
      console.log(data)
      if (data) {
        setLlmResponse(data);
      } else {
        throw new Error("Failed to fetch LLM response.");
      }
    } catch (err) {
      setLlmResponse(`Error: ${err.message}`);
    } finally {
      setLoadingLLM(false);
    }
  };

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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
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

    <div style={{ flex: '390px 0 300px', marginLeft: '20px', maxWidth: '350px' }}>
        {loadingLLM ? (
          <p>Loading LLM response...</p>
        ) : (
          <div style={{ maxWidth: '100%', wordWrap: 'break-word', fontSize: '14px' ,textAlign: 'left'}}>
            <h3>Correlation Insight</h3>
            <p>{llmResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScatterplotComponent;