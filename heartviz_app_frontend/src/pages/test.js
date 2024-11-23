import React, { useState } from "react";
import axios from "axios";

const FetchDataTestPage = () => {
    const [subspaceId, setSubspaceId] = useState("");
    const [features, setFeatures] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Construct the query string
            let query = `http://127.0.0.1:5000/fetch_data_with_features?sub_ind=${subspaceId}`;
            if (features) {
                query += `&features=${encodeURIComponent(features)}`;
            }

            console.log("Fetching data with query:", query);

            // Make the API request
            const response = await axios.get(query);

            if (response.data.data) {
                console.log("Fetched Data:", response.data.data);
                setData(response.data.data);
            } else if (response.data.error) {
                throw new Error(response.data.error);
            } else {
                throw new Error("Unexpected API response.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Fetch Data Test Page</h1>
            <div>
                <label>
                    Subspace ID:
                    <input
                        type="text"
                        value={subspaceId}
                        onChange={(e) => setSubspaceId(e.target.value)}
                        placeholder="Enter subspace ID"
                    />
                </label>
            </div>
            <div>
                <label>
                    Features (comma-separated):
                    <input
                        type="text"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="Enter features (e.g., age,sex)"
                    />
                </label>
            </div>
            <button onClick={handleFetchData} disabled={loading}>
                Fetch Data
            </button>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {data && (
                <div>
                    <h2>Fetched Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default FetchDataTestPage;
