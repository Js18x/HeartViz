import React from "react";
import { useNavigate } from "react-router-dom";
import "./navBar.css";
import logo from "../../logo.png";

function NavigationBar({ onOpenInfoPanel }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
      <img 
          src={logo} 
          alt="HeartViz Logo" 
          className="navbar-logo" 
          onClick={() => navigate("/")} 
          style={{ cursor: "pointer", height: "60px" ,paddingLeft:'70px'}} // Adjust size of logo
        />
        {/* <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          HeartViz
        </h1> */}
      </div>
      <div className="navbar-right">
        <h1 onClick={onOpenInfoPanel} className="info-link">
          Information
        </h1>
      </div>
    </div>
  );
}

export default NavigationBar;
