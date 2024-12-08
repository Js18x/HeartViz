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

  const [showComparePopup, setShowComparePopup] = useState(false);
  const [compareSubspace1, setCompareSubspace1] = useState("");
  const [compareSubspace2, setCompareSubspace2] = useState("");

  useEffect(() => {
    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    setSubspaces(savedSubspaces);

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
      const response = await axios.get("http://127.0.0.1:5000/feature_ranges");

      if (!response.data.feature_ranges) {
        throw new Error("Feature ranges not found in the response.");
      }

      const featureRanges = response.data.feature_ranges;
      const features = Object.keys(featureRanges);
      const ranges = features.map((feature) => featureRanges[feature]);

      const payload = { features, ranges };

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
            break;
          }
        } catch (err) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw new Error("Failed to create Full Dataset subspace after retries.");
          }
        }
      }

      const subspaceID = createResponse.data.subspace_index;

      const newSubspace = {
        id: subspaceID,
        name: "Full Dataset",
        attributes: features,
      };
      const updatedSubspaces = [...subspaces, newSubspace];
      setSubspaces(updatedSubspaces);
      localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));
      setIsFullDatasetCreated(true);

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

    if (subspaces.find((subspace) => subspace.id === id)?.name === "Full Dataset") {
      setIsFullDatasetCreated(false);
    }
  };

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleClearLocalStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all subspaces? This action cannot be undone."
      )
    ) {
      localStorage.clear();
      setSubspaces([]);
      alert("All subspaces have been cleared.");
    }
  };

  const handleCardClick = (subspace) => {
    if (selectedSubspace?.id === subspace.id) {
      setSelectedSubspace(null);
    } else {
      setSelectedSubspace(subspace);
    }
  };

  const handleOpenComparePopup = () => setShowComparePopup(true);
  const handleCloseComparePopup = () => {
    setShowComparePopup(false);
    setCompareSubspace1("");
    setCompareSubspace2("");
  };

  const handleCompareSubspaces = () => {
    if (!compareSubspace1 || !compareSubspace2) {
      alert("Please select two subspaces to compare.");
      return;
    }
    if (compareSubspace1 === compareSubspace2) {
      alert("Please select two different subspaces.");
      return;
    }
    navigate(
      `/multi-space-explore?sub_ind1=${encodeURIComponent(
        compareSubspace1
      )}&sub_ind2=${encodeURIComponent(compareSubspace2)}&metric=avg`
    );
    handleCloseComparePopup();
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
                      e.stopPropagation();
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
            disabled={isFullDatasetCreated}
          >
            Explore Full Dataset
          </button>
          <button onClick={handleClearLocalStorage} className="clear-btn">
            Clear All Subspaces
          </button>
          <button
            onClick={handleOpenComparePopup}
            className="create-btn"
            style={{ backgroundColor: "blue" }}
          >
            Compare Subspaces
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
              <button onClick={handleClosePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showComparePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Compare Two Subspaces</h2>
            <div className="compare-select-container">
              <div className="select-group">
                <label>Select Subspace 1</label>
                <select
                  className="compare-select"
                  value={compareSubspace1}
                  onChange={(e) => setCompareSubspace1(e.target.value)}
                >
                  <option value="">-- Choose Subspace --</option>
                  {subspaces.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name || `Subspace ${sub.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select-group">
                <label>Select Subspace 2</label>
                <select
                  className="compare-select"
                  value={compareSubspace2}
                  onChange={(e) => setCompareSubspace2(e.target.value)}
                >
                  <option value="">-- Choose Subspace --</option>
                  {subspaces.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name || `Subspace ${sub.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="popup-actions">
              <button onClick={handleCompareSubspaces}>Compare</button>
              <button onClick={handleCloseComparePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
