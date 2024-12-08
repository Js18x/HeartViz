import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CorrelationMatrixHeatmap from "../components/heatmap/heatmap";
import ScatterplotComponent from "../components/scatterplot/scatterplot";
import ParallelCoordinatesPlot from "../components/parallelPlot/parallelPlot";
import DistributionPlotComponent from "../components/distribution/distributionComponent";
import "./explore.css";

function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subspaceId = searchParams.get("id");
  const [subspace, setSubspace] = useState(null);
  const [allSubspaces, setAllSubspaces] = useState([]);

  const [xFeature, setXFeature] = useState("");
  const [yFeature, setYFeature] = useState("");

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    setAllSubspaces(savedSubspaces);

    const currentSubspace = savedSubspaces.find(
      (s) => s.id === Number(subspaceId)
    );
    setSubspace(currentSubspace);
  }, [subspaceId]);

  const handleSubspaceChange = (event) => {
    const selectedSubspaceId = event.target.value;
    navigate(`/explore?id=${selectedSubspaceId}`);
  };

  const handleMatrixClick = (x, y) => {
    setXFeature(x);
    setYFeature(y);
  };

  if (!subspaceId) {
    return <p>Error: Subspace ID is missing. Please select a valid subspace.</p>;
  }

  if (!subspace) {
    return <p>Subspace not found!</p>;
  }

  return (
    <div className="explore-page">
      <div className="header">
        <h1 className="subspace-name">
          Single-space exploration: {subspace.name}
          <div className="tooltip-container">
            <button className="tooltip-button">?</button>
            <div className="tooltip-content">
              {subspace.attributes && subspace.attributes.length > 0 ? (
                `Attributes: ${subspace.attributes.join(", ")}`
              ) : (
                "No attributes selected for this subspace."
              )}
            </div>
          </div>
        </h1>
  
        <select
          className="subspace-dropdown"
          value={subspaceId}
          onChange={handleSubspaceChange}
        >
          {allSubspaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
  
      <div className="plots-container">
        <div className="plot-section">
          <h2>Parallel Coordinates Plot</h2>
          <ParallelCoordinatesPlot subspaceId={subspaceId} />
        </div>


        <div className="plot-section">
          <h2>Correlation Matrix</h2>

          <CorrelationMatrixHeatmap
            subspaceId={subspaceId}
            onMatrixClick={handleMatrixClick}
          />
        </div>
  
        <div className="plot-section">
          <h2>Scatterplot</h2>
          <ScatterplotComponent
            subspaceId={subspaceId}
            xFeature={xFeature}
            yFeature={yFeature}
            setXFeature={setXFeature}
            setYFeature={setYFeature}
          />
        </div>
  
        <div className="plot-section">
          <h2>Distribution Plot</h2>
          <DistributionPlotComponent subspaceId={subspaceId} />
        </div>
      </div>
    </div>
  );  
}

export default Explore;
