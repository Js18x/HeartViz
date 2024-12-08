import React, { useState, useEffect } from "react";
import RadarComparisonChart from "../components/radarChart/RadarComparisonRatio";
import DualSubspaceDistributionPlot from "../components/distribution/dualDistribution";
import DimensionalityReductionPlot from "../components/dimReduction/dimensionalityReduction";
import "./multispace.css";

function MultiSpaceExplore() {
  const [allSubspaces, setAllSubspaces] = useState([]);
  const [selectedSubspace1, setSelectedSubspace1] = useState(null);
  const [selectedSubspace2, setSelectedSubspace2] = useState(null);

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    setAllSubspaces(savedSubspaces);

    const params = new URLSearchParams(window.location.search);
    const subInd1 = params.get("sub_ind1");
    const subInd2 = params.get("sub_ind2");

    if (subInd1 !== null && subInd2 !== null) {
      setSelectedSubspace1(parseInt(subInd1, 10));
      setSelectedSubspace2(parseInt(subInd2, 10));
    } else if (savedSubspaces.length >= 2) {
      setSelectedSubspace1(savedSubspaces[0]?.id);
      setSelectedSubspace2(savedSubspaces[1]?.id);
    }
  }, []);

  const handleSubspaceChange = (subspaceId, subspaceNumber) => {
    if (subspaceNumber === 1) {
      setSelectedSubspace1(parseInt(subspaceId, 10));
    } else {
      setSelectedSubspace2(parseInt(subspaceId, 10));
    }
  };

  const renderTooltip = (subspaceId) => {
    if (subspaceId === null || subspaceId === undefined) {
      return null;
    }

    const subspace = allSubspaces.find(
      (s) => s.id === parseInt(subspaceId, 10)
    );
    if (!subspace) {
      return null;
    }

    return (
      <div className="tooltip-content">
        <strong>Subspace:</strong> {subspace.name}
        <br />
        <strong>Attributes:</strong> {subspace.features.join(", ")}
      </div>
    );
  };

  return (
    <div className="explore-page">
      <div className="header">
        <h1>Multi-Subspace Exploration</h1>
        <div className="subspace-selection">
          <div className="subspace-dropdown-container">
            <label className="dropdown-label">Subspace 1:</label>
            <div className="dropdown-box">
              <select
                className="subspace-dropdown"
                value={selectedSubspace1 || ""}
                onChange={(e) => handleSubspaceChange(e.target.value, 1)}
              >
                {allSubspaces.map((subspace) => (
                  <option key={subspace.id} value={subspace.id}>
                    {subspace.name}
                  </option>
                ))}
              </select>
              <div className="tooltip-container">
                <button className="tooltip-button">?</button>
                {renderTooltip(selectedSubspace1)}
              </div>
            </div>
          </div>

          <div className="subspace-dropdown-container">
            <label className="dropdown-label">Subspace 2:</label>
            <div className="dropdown-box">
              <select
                className="subspace-dropdown"
                value={selectedSubspace2 || ""}
                onChange={(e) => handleSubspaceChange(e.target.value, 2)}
              >
                {allSubspaces.map((subspace) => (
                  <option key={subspace.id} value={subspace.id}>
                    {subspace.name}
                  </option>
                ))}
              </select>
              <div className="tooltip-container">
                <button className="tooltip-button">?</button>
                {renderTooltip(selectedSubspace2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="plots-container">
        {selectedSubspace1 !== null && selectedSubspace2 !== null && (
          <>
            <div className="plot-section">
              <h2>
                Subspace {selectedSubspace1} vs Subspace {selectedSubspace2}{" "}
                (AVG)
              </h2>
              <RadarComparisonChart
                subInd1={selectedSubspace1}
                subInd2={selectedSubspace2}
                metric="avg"
                subspace1Name={
                  allSubspaces.find(
                    (subspace) => subspace.id === selectedSubspace1
                  )?.name || `Subspace ${selectedSubspace1}`
                }
                subspace2Name={
                  allSubspaces.find(
                    (subspace) => subspace.id === selectedSubspace2
                  )?.name || `Subspace ${selectedSubspace2}`
                }
              />
            </div>

            <div className="plot-section">
              <h2>Distribution Comparison Between Subspaces</h2>
              <DualSubspaceDistributionPlot
                subspace1Id={selectedSubspace1}
                subspace2Id={selectedSubspace2}
              />
            </div>

            <div className="plot-section">
              <h2>Dimensionality Reduction for Subspaces</h2>
              <DimensionalityReductionPlot
                subspaceId={selectedSubspace1}
                nComponents={2}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MultiSpaceExplore;
