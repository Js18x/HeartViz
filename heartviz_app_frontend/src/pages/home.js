import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./home.css";

function HomePage() {
  const navigate = useNavigate();
  const [subspaces, setSubspaces] = useState([]);
  const [selectedSubspace, setSelectedSubspace] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newSubspaceName, setNewSubspaceName] = useState("");
  const [isFullDatasetCreated, setIsFullDatasetCreated] = useState(false);

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    setSubspaces(savedSubspaces);

    // Check if "Full Dataset" subspace already exists
    const fullDatasetExists = savedSubspaces.some(
      (subspace) => subspace.name === "Full Dataset"
    );
    setIsFullDatasetCreated(fullDatasetExists);
  }, []);

  const handleCreateSubspace = () => {
    if (!newSubspaceName.trim()) {
      alert("Please enter a valid subspace name.");
      return;
    }

    navigate(`/add-subspace?name=${encodeURIComponent(newSubspaceName.trim())}`);
    setNewSubspaceName("");
    setShowPopup(false);
  };

  const handleExploreSubspace = (id) => {
    if (id === null || id === undefined) {
      alert("Please select a subspace first.");
      return;
    }
    navigate(`/explore?id=${id}`);
  };

  const handleExploreAllDataset = async () => {
    try {
      // Fetch the feature ranges from the backend
      const response = await axios.get("http://127.0.0.1:5000/feature_ranges");
  
      if (!response.data.feature_ranges) {
        throw new Error("Feature ranges not found in the response.");
      }
  
      const featureRanges = response.data.feature_ranges;
      const features = Object.keys(featureRanges);
      const ranges = features.map((feature) => featureRanges[feature]);
  
      // Payload for creating the Full Dataset subspace
      const payload = { features, ranges };
  
      // Retry logic for creating the Full Dataset subspace
      const maxRetries = 3;
      let retryCount = 0;
      let createResponse;
  
      while (retryCount < maxRetries) {
        try {
          createResponse = await axios.post(
            "http://127.0.0.1:5000/create_subspace",
            payload
          );
  
          if (createResponse.data && createResponse.data.subspace_index !== undefined) {
            break; // Exit loop if successful
          }
        } catch (err) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw new Error("Failed to create Full Dataset subspace after retries.");
          }
        }
      }
  
      const subspaceID = createResponse.data.subspace_index;
  
      // Save the Full Dataset subspace locally
      const newSubspace = {
        id: subspaceID,
        name: "Full Dataset",
        attributes: features,
      };
      const updatedSubspaces = [...subspaces, newSubspace];
      setSubspaces(updatedSubspaces);
      localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));
      setIsFullDatasetCreated(true);
  
      // Navigate to Explore page
      navigate(`/explore?id=${subspaceID}`);
    } catch (error) {
      console.error("Error creating Full Dataset:", error.message);
      alert("Failed to create Full Dataset. Please try again.");
    }
  };  

  const handleEditSubspace = (id) => {
    if (id === null || id === undefined) {
      alert("Please select a subspace first.");
      return;
    }
    navigate(`/edit-subspace?id=${id}`);
  };

  const handleDeleteSubspace = (id) => {
    const updatedSubspaces = subspaces.filter((subspace) => subspace.id !== id);
    setSubspaces(updatedSubspaces);
    localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));

    if (selectedSubspace?.id === id) {
      setSelectedSubspace(null);
    }

    // If "Full Dataset" is deleted, re-enable the button
    if (subspaces.find((subspace) => subspace.id === id)?.name === "Full Dataset") {
      setIsFullDatasetCreated(false);
    }
  };

  const handleOpenPopup = () => setShowPopup(true);

  const handleCardClick = (subspace) => {
    // Select or deselect subspace
    if (selectedSubspace?.id === subspace.id) {
      setSelectedSubspace(null);
    } else {
      setSelectedSubspace(subspace);
    }
  };

  return (
    <div className="home-page">
      <div className="content-container">
        {subspaces.length > 0 ? (
          <div className="subspaces-container">
            {subspaces.map((subspace) => (
              <div
                key={subspace.id}
                className={`subspace-card ${
                  selectedSubspace?.id === subspace.id ? "active" : ""
                }`}
                onClick={() => handleCardClick(subspace)}
              >
                <div className="subspace-name">
                  {subspace.name || "Unnamed Subspace"}
                </div>
                <div className="subspace-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering card click
                      handleEditSubspace(subspace.id);
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubspace(subspace.id);
                    }}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No subspaces available. Create a new one to get started.</p>
        )}

        <div className="action-buttons">
          <button onClick={handleOpenPopup} className="create-btn">
            Create New Subspace
          </button>
          <button
            onClick={() => handleExploreSubspace(selectedSubspace?.id)}
            className="explore-btn"
            disabled={!selectedSubspace}
          >
            Explore
          </button>
          <button
            onClick={handleExploreAllDataset}
            className="explore-all-btn"
            disabled={isFullDatasetCreated} // Disable if Full Dataset exists
          >
            Explore Full Dataset
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Create New Subspace</h2>
            <input
              type="text"
              className="popup-input"
              placeholder="Enter subspace name"
              value={newSubspaceName}
              onChange={(e) => setNewSubspaceName(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleCreateSubspace}>Create</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
