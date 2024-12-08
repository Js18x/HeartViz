// import React, { useState, useEffect } from "react";
// import mockAttributes from "../../mockData";

// function AttributeSelector() {
//     const [selectedAttributes, setSelectedAttributes] = useState(() => {
//         const saved = localStorage.getItem("selectedAttributes");
//         return saved ? JSON.parse(saved) : [];
//     });

//     // Handle toggling an attribute on/off
//     const handleAttributeToggle = (attribute) => {
//         let updatedAttributes;
//         if (selectedAttributes.includes(attribute)) {
//             updatedAttributes = selectedAttributes.filter((item) => item !== attribute);
//         } else {
//             updatedAttributes = [...selectedAttributes, attribute];
//         }

//         setSelectedAttributes(updatedAttributes);
//         localStorage.setItem("selectedAttributes", JSON.stringify(updatedAttributes));
//     };

//     return (
//         <div>
//             <h2>Select Attributes</h2>
//             <ul>
//                 {mockAttributes.map((attribute, index) => (
//                     <li key={index}>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 value={attribute}
//                                 checked={selectedAttributes.includes(attribute)}
//                                 onChange={() => handleAttributeToggle(attribute)}
//                             />
//                             {attribute}
//                         </label>
//                     </li>
//                 ))}
//             </ul>
//             <h3>Selected Attributes:</h3>
//             <p>{selectedAttributes.length > 0 ? selectedAttributes.join(", ") : "None selected"}</p>
//         </div>
//     );
// }

// export default AttributeSelector;