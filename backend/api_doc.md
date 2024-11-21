# API Documentation

## Correlation Matrix

**Endpoint:** `GET /correlation_matrix`

**Query Parameters:**

•	sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.

Example: `http://127.0.0.1:5000/correlation_matrix?sub_ind=1`

**Response:**

•	correlation_matrix: The correlation matrix as a JSON object.

## Create Subspace

**Endpoint:** `POST /create_subspace`

**Request Body:**

```json
{
    "features": ["age", "sex", "trestbps"],
    "ranges": [[30, 50], [0, 1], [120, 140]]
}
```

**Response:**
•	subspace_index: The index of the created subspace.

## Feature Ranges

**Endpoint:** `GET /feature_ranges`

**Query Parameters:**

•	sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.

Example: `http://127.0.0.1:5000/feature_ranges?sub_ind=1`

**Response:**

•	feature_ranges: Dictionary of feature min and max values.