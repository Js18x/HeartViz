import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Filter from "../components/filters/filter1";
import CategoryFilter from "../components/filters/catFilter";
import "./subspaceCreator.css";

function AddSubspacePage2() {
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://127.0.0.1:5000/feature_ranges");

                console.log("API Response:", response.data); // Debugging

                if (response.data && response.data.feature_ranges) {
                    const fetchedAttributes = Object.entries(response.data.feature_ranges).map(([name, range]) => ({
                        id: name,
                        name,
                        range: range.map(Number), // Ensure range values are numbers
                    }));
                    setAttributes(fetchedAttributes);
                } else {
                    throw new Error("Invalid response format: 'feature_ranges' key missing");
                }
            } catch (err) {
                console.error("Error fetching attributes:", err);

                // Provide detailed error messages for better debugging
                setError(err.response?.data?.error || "Error fetching attributes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttributes();
    }, []);

    const isCategorical = (name) => {
        const categoricalVariables = ["sex", "cp", "restecg", "exang", "slope", "thal", "target"];
        return categoricalVariables.includes(name);
    };

    const handleSelectAttribute = (attribute) => {
        if (selectedAttributes.some((attr) => attr.id === attribute.id)) {
            alert("Attribute already selected!");
            return;
        }

        setSelectedAttributes([...selectedAttributes, attribute]);

        const defaultFilter = isCategorical(attribute.name)
            ? Array.from({ length: attribute.range[1] - attribute.range[0] + 1 }, (_, i) => attribute.range[0] + i) // Generate categories
            : { min: attribute.range[0], max: attribute.range[1] };

        setFilters({
            ...filters,
            [attribute.name]: defaultFilter,
        });
    };

    const handleDeselectAttribute = (attribute) => {
        setSelectedAttributes(selectedAttributes.filter((attr) => attr.id !== attribute.id));
        const updatedFilters = { ...filters };
        delete updatedFilters[attribute.name];
        setFilters(updatedFilters);
    };

    const handleFilterChange = (name, newFilterValues) => {
        setFilters({ ...filters, [name]: newFilterValues });
    };

    const filteredAttributes = attributes.filter((attr) =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveSubspace = async () => {
        try {
            const features = Object.keys(filters);
            const ranges = features.map((feature) =>
                isCategorical(feature)
                    ? filters[feature]
                    : [filters[feature].min, filters[feature].max]
            );

            const subspaceName =
                new URLSearchParams(window.location.search).get("name") ||
                prompt("Enter a name for the subspace:", "New Subspace");

            if (!subspaceName) {
                alert("Subspace name cannot be empty!");
                return;
            }

            const payload = { features, ranges };
            console.log("Saving Subspace with Payload:", payload);

            const response = await axios.post("http://127.0.0.1:5000/create_subspace", payload);
            if (response.data && response.data.subspace_index !== undefined) {
                const subspaceID = response.data.subspace_index;

                const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
                savedSubspaces.push({
                    id: subspaceID,
                    name: subspaceName,
                    features,
                    ranges,
                });
                localStorage.setItem("subspaces", JSON.stringify(savedSubspaces));

                alert(`Subspace "${subspaceName}" saved successfully! Subspace ID: ${subspaceID}`);
                navigate("/");
            } else {
                alert("Failed to save subspace. Please try again.");
            }
        } catch (err) {
            console.error("Error saving subspace:", err);
            alert("Error saving subspace. Please try again.");
        }
    };

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
                    {filteredAttributes.length > 0 ? (
                        <ul>
                            {filteredAttributes.map((attr) => (
                                <li key={attr.id} onClick={() => handleSelectAttribute(attr)}>
                                    {attr.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No attributes available.</p>
                    )}
                </div>
                <div className="selected-attributes">
                    <h2>Selected Attributes</h2>
                    <ul>
                        {selectedAttributes.map((attr) => (
                            <li
                                key={attr.id}
                                onClick={() => handleDeselectAttribute(attr)}
                                style={{ backgroundColor: "#e7ffe7" }}
                            >
                                {attr.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="filter-panel">
                <h2>Filter Options</h2>
                {selectedAttributes.length === 0 ? (
                    <p>Select an attribute to configure its filter.</p>
                ) : (
                    selectedAttributes.map((attr) =>
                        isCategorical(attr.name) ? (
                            <CategoryFilter
                                key={attr.id}
                                name={attr.name}
                                range={attr.range}
                                onFilterChange={handleFilterChange}
                            />
                        ) : (
                            <Filter
                                key={attr.id}
                                name={attr.name}
                                min={attr.range[0]}
                                max={attr.range[1]}
                                onFilterChange={handleFilterChange}
                            />
                        )
                    )
                )}
                <button className="save-button" onClick={handleSaveSubspace}>
                    Save Subspace
                </button>
            </div>
        </div>
    );
}

export default AddSubspacePage2;
