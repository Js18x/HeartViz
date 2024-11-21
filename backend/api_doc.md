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

**Request Body Example:**

```json
{
    "features": ["age", "sex", "trestbps"],
    "ranges": [[30, 50], [0, 1], [120, 140]]
}
```

**Response:**

•	subspace_index: The index of the created subspace. You should save the value for further operations on it.

## Feature Ranges

**Endpoint:** `GET /feature_ranges`

**Query Parameters:**

•	sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.

Example: `http://127.0.0.1:5000/feature_ranges?sub_ind=1`

**Response:**

•	feature_ranges: Dictionary of feature min and max values in JSON format.

Example on the full dataset:

```json
{
  "feature_ranges": {
    "age": [
      29,
      77
    ],
    "ca": [
      0,
      3
    ],
    "chol": [
      126,
      564
    ],
    "cp": [
      1,
      4
    ],
    "exang": [
      0,
      1
    ],
    "fbs": [
      0,
      1
    ],
    "oldpeak": [
      0,
      6
    ],
    "restecg": [
      0,
      2
    ],
    "sex": [
      0,
      1
    ],
    "slope": [
      1,
      3
    ],
    "target": [
      0,
      4
    ],
    "thal": [
      3,
      7
    ],
    "thalach": [
      71,
      202
    ],
    "trestbps": [
      94,
      200
    ]
  }
}
```