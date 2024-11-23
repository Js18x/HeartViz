import React, { useState } from "react";
import "./catFilter.css"; // Import the CSS file for the filter styles

function CategoryFilter({ name, range, onFilterChange }) {
  // Generate categories for the range
  const categories = Array.from(
    { length: range[1] - range[0] + 1 },
    (_, i) => range[0] + i
  );

  const [selectedCategories, setSelectedCategories] = useState(categories);

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

export default CategoryFilter;
