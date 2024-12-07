import React, { useState, useEffect } from "react";
import "./catFilter.css";

function CategoryFilterEdit({ name, range, onFilterChange, defaultFilter = [] }) {
  const categories = Array.from(
    { length: range[1] - range[0] + 1 },
    (_, i) => range[0] + i
  );

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setSelectedCategories(defaultFilter); // Initialize with saved filter
  }, [defaultFilter]);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    onFilterChange(name, updatedCategories);
  };

  return (
    <div className="filter">
      <h3>{name}</h3>
      <div>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilterEdit;