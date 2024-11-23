import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./subspaceCreator.css";

function AddSubspacePage() {
  const navigate = useNavigate();

  const [subspace, setSubspace] = useState({
    name: "",
    selected: [], // Selected attributes with filters
  });
  const [attributes, setAttributes] = useState([]); // All available attributes
  const [currentFilter, setCurrentFilter] = useState(null); // Attribute currently being filtered
  const [searchTerm, setSearchTerm] = useState(""); // Search term for attributes
  const [minValue, setMinValue] = useState(""); // Min filter value
  const [maxValue, setMaxValue] = useState(""); // Max filter value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all attributes when the component loads
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);

        // Fetch attribute ranges from the backend
        const response = await axios.get("http://127.0.0.1:5000/feature_ranges");

        if (response.data && response.data.feature_ranges) {
          const fetchedAttributes = Object.entries(response.data.feature_ranges).map(
            ([name, range]) => ({
              id: name,
              name,
              range,
            })
          );
          setAttributes(fetchedAttributes);
        } else {
          setError("Invalid response structure from backend.");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load attributes. Please try again.");
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  // Handle attribute selection
  const handleSelectAttribute = (attribute) => {
    if (subspace.selected.some((attr) => attr.id === attribute.id)) {
      alert("Attribute already selected!");
      return;
    }

    setSubspace({
      ...subspace,
      selected: [
        ...subspace.selected,
        { ...attribute, filter: { min: attribute.range[0], max: attribute.range[1] } }, // Initialize filter
      ],
    });
  };

  // Handle setting a filter for the current attribute
  const handleSetFilter = () => {
    if (minValue === "" || maxValue === "") {
      alert("Please provide both min and max values.");
      return;
    }
    if (Number(minValue) >= Number(maxValue)) {
      alert("Min value cannot be greater than or equal to max value.");
      return;
    }

    setSubspace({
      ...subspace,
      selected: subspace.selected.map((attr) =>
        attr.id === currentFilter.id
          ? { ...attr, filter: { min: Number(minValue), max: Number(maxValue) } }
          : attr
      ),
    });

    setCurrentFilter(null); // Reset current filter
    setMinValue("");
    setMaxValue("");
  };

  // Handle saving the subspace
  const handleSaveSubspace = () => {
    if (!subspace.name) {
      alert("Please provide a name for the subspace.");
      return;
    }

    const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
    const updatedSubspace = { ...subspace, id: Date.now() };

    // Save the subspace to localStorage
    savedSubspaces.push(updatedSubspace);
    localStorage.setItem("subspaces", JSON.stringify(savedSubspaces));

    alert("Subspace saved successfully!");
    navigate("/"); // Redirect back to the home page
  };

  // Filter attributes based on the search term
  const filteredAttributes = attributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading attributes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="add-subspace-page">
      <div className="left-column">
        <div className="attributes-list">
          <h2>Available Attributes</h2>
          <input
            type="text"
            placeholder="Filter attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredAttributes && filteredAttributes.length > 0 ? (
              filteredAttributes.map((attr) => (
                <li key={attr.id} onClick={() => handleSelectAttribute(attr)}>
                  {attr.name}
                </li>
              ))
            ) : (
              <p>No attributes available.</p>
            )}
          </ul>
        </div>
        <div className="selected-attributes">
          <h2>Selected Attributes</h2>
          <ul>
            {subspace.selected.map((attr) => (
              <li
                key={attr.id}
                onClick={() => {
                  setCurrentFilter(attr); // Set current filter
                  setMinValue(attr.filter.min); // Set default min value
                  setMaxValue(attr.filter.max); // Set default max value
                }}
                style={{
                  backgroundColor: currentFilter && currentFilter.id === attr.id ? "#e7ffe7" : "",
                }}
              >
                {attr.name}: {attr.filter.min} - {attr.filter.max}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="filter-panel">
        <h2>Filter Options</h2>
        {currentFilter ? (
          <div>
            <h3>{currentFilter.name}</h3>
            <div>
              Min:{" "}
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div>
              Max:{" "}
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
            <button onClick={handleSetFilter} className="confirm-button">
              Confirm Filter
            </button>
          </div>
        ) : (
          <p>Select an attribute to configure its filter.</p>
        )}
        <button onClick={handleSaveSubspace} className="save-button">
          Save Subspace
        </button>
      </div>
    </div>
  );
}

export default AddSubspacePage;
