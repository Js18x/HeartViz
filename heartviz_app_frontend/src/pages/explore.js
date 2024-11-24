// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import CorrelationMatrixHeatmap from "../components/heatmap/heatmap";

// function Explore() {
//   const [searchParams] = useSearchParams();
//   const subspaceId = searchParams.get("id");
//   const [subspace, setSubspace] = useState(null);

//   useEffect(() => {
//     const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
//     const currentSubspace = savedSubspaces.find((s) => s.id === Number(subspaceId));
//     setSubspace(currentSubspace);
//   }, [subspaceId]);

//   return (
//     <div className="explore-page">
//       {subspace ? (
//         <>
//           <h1>Explore Subspace: {subspace.name}</h1>
//           <p>
//             Attributes:{" "}
//             {subspace.features && subspace.features.length > 0
//               ? subspace.features.join(", ")
//               : "None selected."}
//           </p>
//           {/* Pass the subspaceId to the heatmap */}
//           <CorrelationMatrixHeatmap subspaceId={subspaceId} />
//         </>
//       ) : (
//         <p>Subspace not found!</p>
//       )}
//     </div>
//   );
// }

// export default Explore;

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CorrelationMatrixHeatmap from "../components/heatmap/heatmap";
import ScatterplotComponent from "../components/scatterplot/scatterplot";
import ParallelCoordinatesPlot from "../components/parallelPlot/parallelPlot";
import "./explore.css";

function Explore() {
  const [searchParams] = useSearchParams();
  const subspaceId = searchParams.get("id");
  const [subspace, setSubspace] = useState(null);
  const [activeTab, setActiveTab] = useState("parallel");

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    const currentSubspace = savedSubspaces.find(
      (s) => s.id === Number(subspaceId)
    );
    setSubspace(currentSubspace);
  }, [subspaceId]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (!subspaceId) {
    return <p>Error: Subspace ID is missing. Please select a valid subspace.</p>;
  }

  if (!subspace) {
    return <p>Subspace not found!</p>;
  }

  return (
    <div className="explore-page">
      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={`tab-button ${
            activeTab === "parallel" ? "active" : ""
          }`}
          onClick={() => handleTabChange("parallel")}
        >
          Parallel Coordinates Plot
        </button>
        <button
          className={`tab-button ${
            activeTab === "correlation" ? "active" : ""
          }`}
          onClick={() => handleTabChange("correlation")}
        >
          Correlation Matrix
        </button>
        <button
          className={`tab-button ${
            activeTab === "scatterplot" ? "active" : ""
          }`}
          onClick={() => handleTabChange("scatterplot")}
        >
          Scatterplot
        </button>
      </div>

      <h1>Explore Subspace: {subspace.name}</h1>
      <p>
        Attributes:{" "}
        {subspace.features && subspace.features.length > 0
          ? subspace.features.join(", ")
          : "No attributes selected for this subspace."}
      </p>

      <div className="tab-content">
        {activeTab === "parallel" && (
          <ParallelCoordinatesPlot subspaceId={subspaceId} />
        )}
        {activeTab === "correlation" && (
          <CorrelationMatrixHeatmap subspaceId={subspaceId} />
        )}
        {activeTab === "scatterplot" && (
          <ScatterplotComponent subspaceId={subspaceId} />
        )}
      </div>
    </div>
  );
}

export default Explore;