import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./navBar.css";

function NavigationBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleConfirm = () => {
        
        const event = new CustomEvent("confirmSubspace");
        window.dispatchEvent(event);
        navigate("/");
    };

    const handleDelete = () => {
        const event = new CustomEvent("deleteSubspace");
        window.dispatchEvent(event);
        navigate("/");
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>HeartViz</h1>
            </div>
            <div className="navbar-right">
                {location.pathname === "/add-subspace" && (
                    <>
                        <button className="confirm-button" onClick={handleConfirm}>
                            Confirm
                        </button>
                        <button className="delete-button" onClick={handleDelete}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default NavigationBar;
