import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CorrelationMatrixHeatmap from "../components/heatmap/heatmap"; // Updated Plotly heatmap

function Explore() {
    const [searchParams] = useSearchParams();
    const subspaceId = searchParams.get("id");
    const [subspace, setSubspace] = useState(null);

    useEffect(() => {
        // Simulate retrieving subspace data (e.g., from localStorage or another source)
        const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
        const currentSubspace = savedSubspaces.find((s) => s.id === Number(subspaceId));
        setSubspace(currentSubspace);
    }, [subspaceId]);

    return (
        <div className="explore-page">
            {subspace ? (
                <>
                    <h1>Explore Subspace: {subspace.name}</h1>
                    <p>Attributes: {subspace.attributes.map((attr) => attr.name).join(", ") || "None selected."}</p>
                    <CorrelationMatrixHeatmap />
                </>
            ) : (
                <p>Subspace not found!</p>
            )}
        </div>
    );
}

export default Explore;
