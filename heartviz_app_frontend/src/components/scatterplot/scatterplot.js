import React, { useState, useEffect } from "react";

const ScatterplotComponent = ({ subspaceId }) => {
  const [scatterData, setScatterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScatterData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/scatterplot_data?sub_ind=${subspaceId}`
        );
        const data = await response.json();
        setScatterData(data);
      } catch (err) {
        setError("Failed to fetch scatterplot data.");
      } finally {
        setLoading(false);
      }
    };

    fetchScatterData();
  }, [subspaceId]);

  if (loading) return <p>Loading scatterplot...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Scatterplot</h2>
      {/* Replace with actual scatterplot visualization */}
      <pre>{JSON.stringify(scatterData, null, 2)}</pre>
    </div>
  );
};

export default ScatterplotComponent;
