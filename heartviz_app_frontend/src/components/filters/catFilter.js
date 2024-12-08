import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CategoryFilter({ name, range, onFilterChange, data }) {
  const categories = Array.from(
    { length: range[1] - range[0] + 1 },
    (_, i) => range[0] + i
  );

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleBarSelect = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedCategory = categories[clickedIndex];

      setSelectedCategories((prevSelected) => {
        const isSelected = prevSelected.includes(clickedCategory);
        const updatedSelection = isSelected
          ? prevSelected.filter((category) => category !== clickedCategory)
          : [...prevSelected, clickedCategory];

        onFilterChange(name, updatedSelection);
        return updatedSelection;
      });
    }
  };

  const histogramData = categories.map((category) =>
    data.filter((item) => item === category).length
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: `Frequency of ${name}`,
        data: histogramData,
        backgroundColor: ({ dataIndex }) => {
          const category = categories[dataIndex];
          return selectedCategories.includes(category)
            ? "rgba(255, 99, 132, 0.8)"
            : "rgba(192, 192, 192, 0.6)";
        },
        borderColor: ({ dataIndex }) => {
          const category = categories[dataIndex];
          return selectedCategories.includes(category)
            ? "rgba(255, 99, 132, 1)"
            : "rgba(192, 192, 192, 1)";
        },
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    onClick: (event, elements) => handleBarSelect(event, elements),
    scales: {
      x: {
        title: {
          display: true,
          text: "Categories",
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
        <label>Selected Categories:</label>
        <span>
          {selectedCategories.length > 0
            ? selectedCategories.join(", ")
            : "Click on bars to select categories"}
        </span>
      </div>
      <div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CategoryFilter;