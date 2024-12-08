import React from "react";
import { useNavigate } from "react-router-dom";
import "./navBar.css";

function NavigationBar() {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>HeartViz</h1>
            </div>
        </div>
    );
}

export default NavigationBar;
