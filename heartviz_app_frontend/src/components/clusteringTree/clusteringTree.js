import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";

const ClusteringTreeComponent = ({ subspaceId }) => {
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/hierarchy_cluster?sub_ind=${subspaceId}`
        );
        const result = await response.json();
        console.log("Fetched Tree Data:", result);
        setTreeData(result);
      } catch (err) {
        console.error("Error fetching tree data:", err);
        setError("Failed to fetch tree data.");
      }
    };

    fetchTreeData();
  }, [subspaceId]);

  if (error) return <div>Error: {error}</div>;
  if (!treeData) return <div>Loading Clustering Tree...</div>;

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g
      onMouseEnter={(e) => handleMouseEnter(e, nodeDatum)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <circle r={10} fill="#6B6B6B" onClick={toggleNode} />
      <text fill="black" x={15}>
        {nodeDatum.name}
      </text>
    </g>
  );

  const handleMouseEnter = (e, nodeDatum) => {
    const tooltipInfo = `Name: ${nodeDatum.name} ${
      nodeDatum.value !== undefined ? `Value: ${nodeDatum.value.toFixed(2)}` : ""
    }`;
    setTooltipContent(tooltipInfo);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - containerBounds.left + 10,
        y: e.clientY - containerBounds.top + 10,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px", position: "relative" }}
    >
      <h2>Clustering Tree</h2>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="diagonal"
        translate={{ x: 500, y: 50 }}
        nodeSize={{ x: 150, y: 100 }}
        renderCustomNodeElement={renderCustomNode}
        initialDepth={2} 
        styles={{
          links: { stroke: "#136F63", strokeWidth: 2 },
          nodes: {
            node: { circle: { fill: "#136F63" } },
            leafNode: { circle: { fill: "#8FCB9B" } },
          },
        }}
      />
      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            pointerEvents: "none",
            fontSize: "12px",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default ClusteringTreeComponent;
