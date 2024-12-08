import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Filter({ name, min, max, onFilterChange, data }) {
  const [filterValues, setFilterValues] = useState({ min, max });
  const [selection, setSelection] = useState({ start: null, end: null });

  const handleInputChange = (e, type) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setFilterValues({ ...filterValues, [type]: "" });
      return;
    }
    const newValue = Number(inputValue);
    if (!isNaN(newValue)) {
      setFilterValues((prev) => ({ ...prev, [type]: newValue }));
    }
  };

  const handleInputBlur = (type) => {
    let newValue =
      filterValues[type] === "" ? (type === "min" ? min : max) : filterValues[type];
    if (type === "min") {
      newValue = Math.min(Math.max(newValue, min), filterValues.max);
    } else {
      newValue = Math.max(Math.min(newValue, max), filterValues.min);
    }
    setFilterValues((prev) => ({ ...prev, [type]: newValue }));
    onFilterChange(name, { ...filterValues, [type]: newValue });
  };

  const handleBarSelect = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedValue = min + clickedIndex;

      if (selection.start === null || selection.end !== null) {
        setSelection({ start: clickedValue, end: null });
      } else {
        const start = Math.min(selection.start, clickedValue);
        const end = Math.max(selection.start, clickedValue);
        setSelection({ start: null, end: null });
        setFilterValues({ min: start, max: end });
        onFilterChange(name, { min: start, max: end });
      }
    }
  };

  // Prepare data for the histogram
  const histogramData = Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
    (value) => data.filter((item) => item === value).length
  );

  const chartData = {
    labels: Array.from({ length: max - min + 1 }, (_, i) => min + i),
    datasets: [
      {
        label: `Frequency of ${name}`,
        data: histogramData,
        backgroundColor: ({ dataIndex }) => {
          const value = min + dataIndex;
          if (
            (selection.start !== null &&
              selection.end === null &&
              value === selection.start) ||
            (selection.start !== null &&
              selection.end !== null &&
              value >= Math.min(selection.start, selection.end) &&
              value <= Math.max(selection.start, selection.end)) ||
            (selection.start === null && value >= filterValues.min && value <= filterValues.max)
          ) {
            return "rgba(255, 99, 132, 0.8)";
          }
          return "rgba(192, 192, 192, 0.6)";
        },
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    onClick: (event, elements) => handleBarSelect(event, elements),
    scales: {
      x: {
        title: {
          display: true,
          text: "Values",
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3>{name}</h3>
      <div>
        <label>Min:</label>
        <input
          type="number"
          value={filterValues.min}
          onChange={(e) => handleInputChange(e, "min")}
          onBlur={() => handleInputBlur("min")}
        />
      </div>
      <div>
        <label>Max:</label>
        <input
          type="number"
          value={filterValues.max}
          onChange={(e) => handleInputChange(e, "max")}
          onBlur={() => handleInputBlur("max")}
        />
      </div>
      <div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Filter;
