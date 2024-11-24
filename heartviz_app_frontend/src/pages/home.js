import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function HomePage() {
    const navigate = useNavigate();
    const [subspaces, setSubspaces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newSubspaceName, setNewSubspaceName] = useState("");

    useEffect(() => {
        const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
        setSubspaces(savedSubspaces);
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

    const handleEditSubspace = (id) => {
        navigate(`/explore?id=${id}`); 
    };

    const handleExploreSubspace = (id) => {
        navigate(`/explore?id=${id}`);
    };

    const handleExploreScatter = () => {
        navigate(`/scatter`);
    };
    const handleOpenPopup = () => setShowPopup(true);

    const handleClosePopup = () => setShowPopup(false);

    const handleClearLocalStorage = () => {
        if (window.confirm("Are you sure you want to clear all subspaces? This action cannot be undone.")) {
            localStorage.clear();
            setSubspaces([]);
            alert("All subspaces have been cleared.");
        }
    };

    return (
        <div className="home-page">
            <h1>Welcome to HeartViz</h1>
            <button onClick={handleOpenPopup} className="create-btn">Create New Subspace</button>
            <button onClick={handleClearLocalStorage} className="clear-btn">Clear All Subspaces</button>
            <button onClick={handleExploreScatter} className="scatter-btn">Scatter Plot Data</button>
            {subspaces.length > 0 ? (
                <div className="subspaces-container">
                    {subspaces.map((subspace) => (
                        <div key={subspace.id} className="subspace-card">
                            {/* Display the subspace name; default to "Unnamed Subspace" if no name is available */}
                            <div className="subspace-name">{subspace.name || "Unnamed Subspace"}</div>
                            <div className="subspace-buttons">
                                {/* Pass the correct ID to the test page on Edit */}
                                <button
                                    onClick={() => handleEditSubspace(subspace.id)}
                                    className="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleExploreSubspace(subspace.id)}
                                    className="explore-btn"
                                >
                                    Explore
                                </button>
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
