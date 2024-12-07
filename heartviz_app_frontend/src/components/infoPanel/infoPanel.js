import React from "react";
import "./infoPanel.css";

// JSON Data for "Description"s
const variableDescriptions = [
  {
    "Variable Name": "age",
    "Full Name": "Age",
    "Description": "Age of the patient",
    "Extended Description":
      "Age is an important factor in assessing the risk of heart disease. Generally, the risk increases with age.",
  },
  {
    "Variable Name": "ca",
    "Full Name": "Number of Major Vessels",
    "Description": "Number of major vessels (0-3) colored by fluoroscopy",
    "Extended Description":
      "The number of major vessels colored by fluoroscopy can indicate the extent of blockages in the coronary arteries, which is directly related to the severity of heart disease.",
  },
  {
    "Variable Name": "chol",
    "Full Name": "Serum Cholesterol",
    "Description": "Serum cholesterol in mg/dl",
    "Extended Description":
      "High levels of serum cholesterol are linked to an increased risk of heart disease. Cholesterol levels can indicate the presence of fatty deposits in blood vessels.",
  },
  {
    "Variable Name": "cp",
    "Full Name": "Chest Pain",
    "Description": "Type of chest pain",
    "Extended Description":
      "Different types of chest pain can be indicative of heart disease, with certain types more strongly associated with cardiac issues. Values: 1 = typical angina, 2 = atypical angina, 3 = non-anginal pain, 4 = asymptomatic.",
  },
  {
    "Variable Name": "exang",
    "Full Name": "Exercise Induced Angina",
    "Description": "Exercise induced angina",
    "Extended Description":
      "Exercise-induced angina is chest pain that occurs during physical activity, often indicating that the heart is not receiving enough oxygen, which is a sign of heart disease. (1 = yes; 0 = no)",
  },
  {
    "Variable Name": "fbs",
    "Full Name": "Fasting Blood Sugar",
    "Description": "Fasting blood sugar > 120 mg/dl",
    "Extended Description":
      "Elevated fasting blood sugar levels can be an indicator of diabetes, which is a significant risk factor for developing heart disease. (1 = true; 0 = false)",
  },
  {
    "Variable Name": "oldpeak",
    "Full Name": "ST Depression Induced by Exercise",
    "Description": "ST depression induced by exercise relative to rest",
    "Extended Description":
      "ST depression observed during exercise can be a marker of coronary artery disease. It reflects changes in the heart's electrical activity due to insufficient blood flow.",
  },
  {
    "Variable Name": "restecg",
    "Full Name": "Resting Electrocardiographic Results",
    "Description": "Resting electrocardiographic results",
    "Extended Description":
      "Resting ECG results can reveal underlying heart conditions such as arrhythmias or previous heart attacks, which are relevant for assessing heart disease risk. Values: 0 = normal, 1 = ST-T wave abnormality, 2 = probable/definite left ventricular hypertrophy.",
  },
  {
    "Variable Name": "sex",
    "Full Name": "Sex",
    "Description": "Sex of the patient",
    "Extended Description":
      "Sex can influence the risk of heart disease, with men typically having a higher risk at a younger age compared to women. (1 = male; 0 = female)",
  },
  {
    "Variable Name": "slope",
    "Full Name": "Slope of the Peak Exercise ST Segment",
    "Description": "Slope of the peak exercise ST segment",
    "Extended Description":
      "The slope of the peak exercise ST segment can provide information on the heart's response to stress and is used in diagnosing heart disease. Values: 1 = upsloping, 2 = flat, 3 = downsloping.",
  },
  {
    "Variable Name": "target",
    "Full Name": "Heart Disease Severity",
    "Description": "Severity of heart disease",
    "Extended Description": "The target variable represents the severity of heart disease based on angiographic results. Values range from 0 to 4, where 0 indicates no heart disease (<50% diameter narrowing) and values 1-4 represent increasing levels of severity (>50% diameter narrowing)."
  },
  {
    "Variable Name": "thal",
    "Full Name": "Thalassemia",
    "Description": "Thalassemia",
    "Extended Description":
      "Thalassemia is a blood disorder that can affect the heart's ability to function properly. Its presence can complicate the diagnosis and management of heart disease. Values: 3 = normal, 6 = fixed defect, 7 = reversible defect.",
  },
  {
    "Variable Name": "thalach",
    "Full Name": "Maximum Heart Rate Achieved",
    "Description": "Maximum heart rate achieved",
    "Extended Description":
      "The maximum heart rate achieved during exercise can indicate cardiovascular fitness and potential heart problems.",
  },
  {
    "Variable Name": "trestbps",
    "Full Name": "Resting Blood Pressure",
    "Description": "Resting blood pressure on admission to the hospital",
    "Extended Description":
      "Resting blood pressure is a critical measure of cardiovascular health. High blood pressure is a well-known risk factor for heart disease.",
  },
];

function InfoPanel({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="info-panel-overlay" onClick={onClose}>
          <div
            className="info-panel"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2>Information</h2>
            <div className="variables-list">
              {variableDescriptions.map((variable) => (
                <div
                  key={variable["Variable Name"]}
                  className="variable-card"
                >
                  <h3>{variable["Variable Name"]} ({variable["Full Name"]})</h3>
                  <p>
                    <strong>Description:</strong> {variable["Description"]}
                  </p>
                  <p>
                    <strong>Details:</strong> {variable["Extended Description"]}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InfoPanel;
