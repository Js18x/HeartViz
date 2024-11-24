# API Documentation

## Correlation Matrix

**Endpoint:** `GET /correlation_matrix`

**Query Parameters:**

•	sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.

Example: `http://127.0.0.1:5000/correlation_matrix?sub_ind=1`

**Response:**

•	correlation_matrix: The correlation matrix as a JSON object.

**Response Example (part)**

```json
{
  "correlation_matrix": {
    "age": {
      "age": 1.0,
      "ca": 0.3626045261912275,
      "chol": 0.20895026994678226,
      "cp": 0.10413895433792279,
      "exang": 0.09166077150494455,
      "fbs": 0.1185302422169632,
      "oldpeak": 0.2038054813870624,
      "restecg": 0.14886759109352665,
      "sex": -0.0975422837792451,
      "slope": 0.16176955852148017,
      "target": 0.22285341927595312,
      "thal": 0.12738862153907995,
      "thalach": -0.3938058059868204,
      "trestbps": 0.2849459193136901
    },
    "ca": {
      "age": 0.3626045261912275,
      "ca": 1.0,
      "chol": 0.11900048707721805,
      "cp": 0.23321441072300975,
      "exang": 0.14556960318928233,
      "fbs": 0.14547752245238563,
      "oldpeak": 0.2958321145852634,
      "restecg": 0.1283426527358577,
      "sex": 0.09318475873086614,
      "slope": 0.11011918847734746,
      "target": 0.5189092469193571,
      "thal": 0.2563824991901348,
      "thalach": -0.26424625307130917,
      "trestbps": 0.09877325705680148
    }
  }
}
```

## Create Subspace

**Endpoint:** `POST /create_subspace`

**Request Body Example:**

In `features` field, pass a list of feature names chosen in this subspace

In `range` field, pass a list of lists, each list represents the range of the quantitative attributes or the chosen val
ues of categorical values. They are treated in different ways

- categorical attributes: a list of chosen values
- quantitative attributes: a list of 2 values, `[min, max]`
```json
{
  "features": [
    "age",
    "sex",
    "trestbps",
    "cp"
  ],
  "ranges": [
    [
      30,
      50
    ],
    [
      0,
      1
    ],
    [
      120,
      140
    ],
    [
      1,
      3,
      4
    ]
  ]
}
```

**Response:**

• subspace_index: an integer, representing the index of the created subspace. **You should save the value for further
operations on it.**

**Example response:**

```json
{
  "subspace_index": 1
}
```
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

## Fetch data with features

**Endpoint:** `GET /fetch_data_with_features`

**Query Parameters**

- sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.
- features (Optional): fetch data from the passed list of features. If not provided, fetch all featuresn in the target
  subspace

Query Example: fetch `age` and `ca` from the subspace 3

`GET /fetch_data_with_features?sub_ind=3&features=age,ca`

**Response**

- data: a dictionary with selected features as

Response Example (part): 2 features are fetched from a subspace

```json
{
  "data": {
    "age": [
      17,
      18,
      19
    ],
    "ca": [
      0.0,
      3.0,
      2.0
    ]
  }
}

```

## Build Hierarchy Cluster Tree (beta)

**ENDPOINT:** `GET /hierarchy_cluster`

**Query Parameters**

- sub_ind (optional): Index of the subspace. If not provided, uses the full dataset.

Query Example: get hierarchy cluster tree for subspace 3

`GET /hierarchy_cluster?sub_ind=3`

**Response**

Response Example

Open the [exmaple json file](hierarchy_tree_example.json) to get the full example

The tree structure in json file is represented as a tree structure.
There are 2 kinds of nodes:

- `Node`: the non-leaf node. It has 3 fields: `children`, `name`, `value`.
  The format of `name` is just like `Node 123`. In the `value` field, the value is the distance.
  In the `children` field, you can refer to its children nodes.

```json
{
  "children": [{...}, {...}],
  "name": "Node 183",
  "value": 8.894984535429936
}
```

- `Leaf`': the leaf node. It has 2 fields: `name`, `value`. The name is like `Leaf 132`, and the `value` is the **row
  index** in
  the sub-dataset of the subspace. So you should call `/fetch_data_with_features` to get the sub-dataset.

```json
{
  "name": "Leaf 72",
  "type": "leaf",
  "value": 72
}
```