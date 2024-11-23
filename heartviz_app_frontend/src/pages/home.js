import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function HomePage() {
    const navigate = useNavigate();
    const [subspaces, setSubspaces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newSubspaceName, setNewSubspaceName] = useState("");

    useEffect(() => {
        // Load saved subspaces from local storage
        const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
        setSubspaces(savedSubspaces);
    }, []);

    const handleCreateSubspace = () => {
        if (!newSubspaceName.trim()) {
            alert("Please enter a valid subspace name.");
            return;
        }

        // Navigate to the add-subspace page with the subspace name (no ID yet)
        navigate(`/add-subspace?name=${encodeURIComponent(newSubspaceName.trim())}`);
        setNewSubspaceName(""); // Clear the input field
        setShowPopup(false); // Close the popup
    };

    const handleEditSubspace = (id) => {
        navigate(`/add-subspace?id=${id}`);
    };

    const handleExploreSubspace = (id) => {
        navigate(`/explore?id=${id}`);
    };

    const handleOpenPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    // Functionality to clear local storage
    const handleClearLocalStorage = () => {
        if (window.confirm("Are you sure you want to clear all subspaces? This action cannot be undone.")) {
            localStorage.clear();
            setSubspaces([]); // Clear the subspaces from state as well
            alert("All subspaces have been cleared.");
        }
    };

    return (
        <div className="home-page">
            <h1>Welcome to HeartViz</h1>
            <button onClick={handleOpenPopup} className="create-btn">Create New Subspace</button>
            <button onClick={handleClearLocalStorage} className="clear-btn">Clear All Subspaces</button>
            {subspaces.length > 0 ? (
                <div className="subspaces-container">
                    {subspaces.map((subspace) => (
                        <div key={subspace.id} className="subspace-card">
                            <div className="subspace-name">{subspace.name || "Unnamed Subspace"}</div>
                            <div className="subspace-buttons">
                                <button onClick={() => handleEditSubspace(subspace.id)} className="edit-btn">Edit</button>
                                <button onClick={() => handleExploreSubspace(subspace.id)} className="explore-btn">Explore</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No subspaces available. Create a new one to get started.</p>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Create New Subspace</h2>
                        <input
                            type="text"
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
        </div>
    );
}

export default HomePage;
