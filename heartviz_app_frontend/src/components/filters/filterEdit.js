import React, { useState, useEffect } from "react";

function FilterEdit({ name, min, max, onFilterChange, defaultFilter }) {
  const [filterValues, setFilterValues] = useState({ min: min, max: max });

  useEffect(() => {
    if (defaultFilter && defaultFilter.min !== undefined && defaultFilter.max !== undefined) {
      setFilterValues(defaultFilter);
    }
  }, [defaultFilter]);

  const handleMinChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilterValues({ ...filterValues, min: isNaN(value) ? "" : value });
  };

  const handleMinBlur = () => {
    const updatedMin = Math.max(min, Math.min(filterValues.min || min, filterValues.max || max));
    setFilterValues((prev) => ({ ...prev, min: updatedMin }));
    onFilterChange(name, { ...filterValues, min: updatedMin });
  };

  const handleMaxChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilterValues({ ...filterValues, max: isNaN(value) ? "" : value });
  };

  const handleMaxBlur = () => {
    const updatedMax = Math.min(max, Math.max(filterValues.max || max, filterValues.min || min));
    setFilterValues((prev) => ({ ...prev, max: updatedMax }));
    onFilterChange(name, { ...filterValues, max: updatedMax });
  };

  return (
    <div className="filter">
      <h3>{name}</h3>
      <div>
        <label>Min:</label>
        <input
          type="number"
          value={filterValues.min || ""}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
        />
      </div>
      <div>
        <label>Max:</label>
        <input
          type="number"
          value={filterValues.max || ""}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
        />
      </div>
    </div>
  );
}

export default FilterEdit;
