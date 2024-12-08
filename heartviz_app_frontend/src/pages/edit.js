import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Filter from "../components/filters/filterEdit";
import CategoryFilter from "../components/filters/catFilterEdit";
import "./subspaceCreator.css";

function EditSubspace() {
  const [searchParams] = useSearchParams();
  const subspaceId = searchParams.get("id");
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [filters, setFilters] = useState({});
  const [subspaceName, setSubspaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubspaceData = async () => {
      try {
        setLoading(true);


        const response = await axios.get("http://127.0.0.1:5000/feature_ranges");
        if (!response.data || !response.data.feature_ranges) {
          throw new Error("Invalid response: 'feature_ranges' key missing");
        }

        const fetchedAttributes = Object.entries(response.data.feature_ranges).map(([name, range]) => ({
          id: name,
          name,
          range: range.map(Number),
        }));
        setAttributes(fetchedAttributes);

        if (subspaceId) {
          const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
          const currentSubspace = savedSubspaces.find((s) => s.id === Number(subspaceId));

          if (currentSubspace) {
            setSubspaceName(currentSubspace.name);

            const selected = currentSubspace.features.map((feature) =>
              fetchedAttributes.find((attr) => attr.name === feature)
            );
            setSelectedAttributes(selected);

            const filtersMap = {};
            currentSubspace.features.forEach((feature, index) => {
              filtersMap[feature] = currentSubspace.ranges[index];
            });
            setFilters(filtersMap);
          } else {
            alert("Subspace not found!");
            navigate("/");
          }
        }
      } catch (err) {
        console.error("Error fetching subspace data:", err);
        setError(err.response?.data?.error || "Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubspaceData();
  }, [subspaceId, navigate]);

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
      ? Array.from({ length: attribute.range[1] - attribute.range[0] + 1 }, (_, i) => attribute.range[0] + i)
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

  const handleSaveChanges = async () => {
    try {
      const features = Object.keys(filters);
      const ranges = features.map((feature) =>
        isCategorical(feature) ? filters[feature] : [filters[feature].min, filters[feature].max]
      );

      const updatedSubspace = {
        id: Number(subspaceId),
        name: subspaceName,
        features,
        ranges,
      };

      const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
      const updatedSubspaces = savedSubspaces.map((subspace) =>
        subspace.id === Number(subspaceId) ? updatedSubspace : subspace
      );

      localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));
      alert(`Subspace "${subspaceName}" updated successfully!`);
      navigate("/");
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Error saving changes. Please try again.");
    }
  };

  if (loading) return <div>Loading subspace data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="add-subspace-page">
      <div className="left-column">
        <div className="attributes-list">
          <h2>Available Attributes</h2>
          {attributes.length > 0 ? (
            <ul>
              {attributes.map((attr) => (
                <li
                  key={attr.id}
                  onClick={() => handleSelectAttribute(attr)}
                  className={selectedAttributes.some((a) => a.id === attr.id) ? "selected" : ""}
                >
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
                defaultFilter={filters[attr.name] || []}
              />
            ) : (
              <Filter
                key={attr.id}
                name={attr.name}
                min={attr.range[0]}
                max={attr.range[1]}
                onFilterChange={handleFilterChange}
                defaultFilter={filters[attr.name] || { min: attr.range[0], max: attr.range[1] }}
              />
            )
          )
        )}
        <div className="actions">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSubspace;
