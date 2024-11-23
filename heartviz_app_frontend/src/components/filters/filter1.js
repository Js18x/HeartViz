import React, { useState } from "react";

function Filter({ name, min, max, onFilterChange }) {
  const [filterValues, setFilterValues] = useState({ min, max });

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    setFilterValues({ ...filterValues, min: newMin });
    onFilterChange(name, { ...filterValues, min: newMin });
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    setFilterValues({ ...filterValues, max: newMax });
    onFilterChange(name, { ...filterValues, max: newMax });
  };

  return (
    <div className="filter">
      <h3>{name}</h3>
      <div>
        <label>Min:</label>
        <input
          type="number"
          value={filterValues.min}
          min={min}
          max={filterValues.max}
          onChange={handleMinChange}
        />
      </div>
      <div>
        <label>Max:</label>
        <input
          type="number"
          value={filterValues.max}
          min={filterValues.min}
          max={max}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
}

export default Filter;
