import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import mockData from "../mockData";
import "./subspaceCreator.css";

function AddSubspacePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const subspaceId = searchParams.get("id");
    const [subspace, setSubspace] = useState({ name: "", attributes: [] });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
        const currentSubspace = savedSubspaces.find((s) => s.id === Number(subspaceId));
        if (currentSubspace) {
            setSubspace(currentSubspace);
        }
    }, [subspaceId]);

    useEffect(() => {
        const handleConfirm = () => navigate("/");

        const handleDelete = () => {
            const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
            const updatedSubspaces = savedSubspaces.filter((s) => s.id !== Number(subspaceId));
            localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));
            navigate("/");
        };

        window.addEventListener("confirmSubspace", handleConfirm);
        window.addEventListener("deleteSubspace", handleDelete);

        return () => {
            window.removeEventListener("confirmSubspace", handleConfirm);
            window.removeEventListener("deleteSubspace", handleDelete);
        };
    }, [subspaceId, navigate]);

    const handleNameChange = (e) => {
        const updatedName = e.target.value;
        setSubspace({ ...subspace, name: updatedName });
        updateLocalStorage({ ...subspace, name: updatedName });
    };

    const handleSelect = (attr) => {
        if (!subspace.attributes.some((existingAttr) => existingAttr.id === attr.id)) {
            const updatedAttributes = [...subspace.attributes, attr];
            const updatedSubspace = { ...subspace, attributes: updatedAttributes };
            setSubspace(updatedSubspace);
            updateLocalStorage(updatedSubspace);
        }
    };

    const handleDeselect = (attr) => {
        const updatedAttributes = subspace.attributes.filter((a) => a.id !== attr.id);
        const updatedSubspace = { ...subspace, attributes: updatedAttributes };
        setSubspace(updatedSubspace);
        updateLocalStorage(updatedSubspace);
    };

    const updateLocalStorage = (updatedSubspace) => {
        const savedSubspaces = JSON.parse(localStorage.getItem("subspaces")) || [];
        const updatedSubspaces = savedSubspaces.map((s) =>
            s.id === updatedSubspace.id ? updatedSubspace : s
        );
        localStorage.setItem("subspaces", JSON.stringify(updatedSubspaces));
    };

    const filteredAttributes = mockData.filter((attr) =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="add-subspace-page">
            <div className="left-column">
                <div className="attributes-list">
                    <h2>Available Attributes</h2>
                    <input
                        type="text"
                        placeholder="Filter attributes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul>
                        {filteredAttributes.map((attr) => (
                            <li key={attr.id} onClick={() => handleSelect(attr)}>
                                {attr.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="selected-attributes">
                    <input
                        type="text"
                        value={subspace.name}
                        onChange={handleNameChange}
                        placeholder="Subspace Name"
                        className="subspace-name-input"
                    />
                    <ul>
                        {subspace.attributes.map((attr) => (
                            <li key={attr.id} onClick={() => handleDeselect(attr)}>
                                {attr.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="filter-panel">
                <h2>Filter Options</h2>
                <p>Add your filter components and options here.</p>
            </div>
        </div>
    );
}

export default AddSubspacePage;
