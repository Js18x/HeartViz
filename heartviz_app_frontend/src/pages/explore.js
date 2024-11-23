import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CorrelationMatrixHeatmap from "../components/heatmap/heatmap";

function Explore() {
  const [searchParams] = useSearchParams();
  const subspaceId = searchParams.get("id");
  const [subspace, setSubspace] = useState(null);

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    const currentSubspace = savedSubspaces.find((s) => s.id === Number(subspaceId));
    setSubspace(currentSubspace);
  }, [subspaceId]);

  return (
    <div className="explore-page">
      {subspace ? (
        <>
          <h1>Explore Subspace: {subspace.name}</h1>
          <p>
            Attributes:{" "}
            {subspace.features && subspace.features.length > 0
              ? subspace.features.join(", ")
              : "None selected."}
          </p>
          {/* Pass the subspaceId to the heatmap */}
          <CorrelationMatrixHeatmap subspaceId={subspaceId} />
        </>
      ) : (
        <p>Subspace not found!</p>
      )}
    </div>
  );
}

export default Explore;
