import React, { useState } from "react";

function Filter({ name, min, max, onFilterChange }) {
  const [filterValues, setFilterValues] = useState({ min, max });

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setFilterValues({ ...filterValues, min: "" });
      return;
    }
    const newMin = Number(inputValue);
    if (!isNaN(newMin)) {
      setFilterValues((prev) => ({ ...prev, min: newMin }));
    }
  };

  const handleMinBlur = () => {
    let newMin = filterValues.min === "" ? min : filterValues.min;
    newMin = Math.min(Math.max(newMin, min), filterValues.max);
    setFilterValues((prev) => ({ ...prev, min: newMin }));
    onFilterChange(name, { ...filterValues, min: newMin });
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setFilterValues({ ...filterValues, max: "" });
      return;
    }
    const newMax = Number(inputValue);
    if (!isNaN(newMax)) {
      setFilterValues((prev) => ({ ...prev, max: newMax }));
    }
  };

  const handleMaxBlur = () => {
    let newMax = filterValues.max === "" ? max : filterValues.max;
    newMax = Math.max(Math.min(newMax, max), filterValues.min);
    setFilterValues((prev) => ({ ...prev, max: newMax }));
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
          onChange={handleMinChange}
          onBlur={handleMinBlur}
        />
      </div>
      <div>
        <label>Max:</label>
        <input
          type="number"
          value={filterValues.max}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
        />
      </div>
    </div>
  );
}

export default Filter;
