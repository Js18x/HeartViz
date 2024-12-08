// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";

// const SunburstChart = ({ subspaceId }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5000/fetch_data_with_features?sub_ind=${subspaceId}`
//         );
//         const result = await response.json();

//         if (result.data) {
//           // Transform the data for the sunburst chart
//           const rawData = result.data;

//           // Example hierarchy: sex > cp > target
//           const labels = [];
//           const parents = [];
//           const values = [];

//           // Create the hierarchy dynamically
//           Object.keys(rawData.sex).forEach((index) => {
//             const sex = rawData.sex[index] === 1 ? "Male" : "Female";
//             const cp = `CP Type ${rawData.cp[index]}`;
//             const target = rawData.target[index] === 1 ? "Disease" : "No Disease";

//             // Add Sex level
//             if (!labels.includes(sex)) {
//               labels.push(sex);
//               parents.push("");
//               values.push(0); // Initialize
//             }

//             // Add CP level
//             const cpLabel = `${sex} - ${cp}`;
//             if (!labels.includes(cpLabel)) {
//               labels.push(cpLabel);
//               parents.push(sex);
//               values.push(0); // Initialize
//             }

//             // Add Target level
//             const targetLabel = `${cpLabel} - ${target}`;
//             if (!labels.includes(targetLabel)) {
//               labels.push(targetLabel);
//               parents.push(cpLabel);
//               values.push(0); // Initialize
//             }

//             // Increment values
//             const targetIndex = labels.indexOf(targetLabel);
//             values[targetIndex] += 1;
//           });

//           setData({ labels, parents, values });
//         } else {
//           throw new Error(result.error || "Failed to fetch data.");
//         }
//       } catch (err) {
//         setError(err.message || "An unknown error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [subspaceId]);

//   if (loading) return <div>Loading Sunburst Chart...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!data.labels || data.labels.length === 0) {
//     return <div>No data available for the Sunburst Chart.</div>;
//   }

//   return (
//     <Plot
//       data={[
//         {
//           type: "sunburst",
//           labels: data.labels,
//           parents: data.parents,
//           values: data.values,
//           branchvalues: "total", // "remainder" to display as a portion
//           textinfo: "label+value+percent entry",
//         },
//       ]}
//       layout={{
//         title: "Sunburst Chart Overview",
//         margin: { t: 50, l: 0, r: 0, b: 0 },
//         width: 800,
//         height: 800,
//       }}
//     />
//   );
// };

// export default SunburstChart;
