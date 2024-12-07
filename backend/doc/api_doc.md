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

## Distribution by Feature

**Endpoint:** `GET /distribution_by_feature`

**Query Parameters:**

- feature (required): Name of the feature column for which the distribution is calculated.
- sub_ind (optional): Index of the subspace. If not provided, the distribution is calculated on the full dataset.
- by_label (optional): A boolean indicating if the distribution should be computed separately for each label in the
  target column. By default, False.

**Example Request:**

`GET /distribution_by_feature?feature=age&sub_ind=1&by_label=true`

**Response:**
• Returns the count of the specified feature as a JSON object.
• If by_label is true, the response contains distributions for each label value.

**Response Example:**

```json
{
  "0": {
    "30": 11,
    "40": 12,
    "50": 13
  },
  "1": {
    "30": 14,
    "40": 15,
    "50": 16
  }
}
```

**Error Responses:**

• 400 Bad Request: If the feature is not found or the subspace index is invalid.

`{
"error": "Feature 'age' not found in the dataset."
}`

## Update Subspace

**Endpoint:** `POST /update_subspace`

**Request Body:**

- sub_ind (required): Index of the subspace to be updated.
- features (required): List of feature names included in the subspace.
- ranges (required): List of ranges or values for the features in the subspace. Ranges for quantitative features are
  provided as [min, max], and selected values for categorical features are provided as a list.

**Example Request:**

```json
{
  "sub_ind": 1,
  "features": [
    "age",
    "sex",
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
      1,
      2,
      3
    ]
  ]
}
```

**Response:**

Returns a success message.

**Response Example:**

`{
{'update_state': True}
}`

**Error Responses:**
400 Bad Request: If the subspace index or input values are invalid.

```json
{
  "error": "Subspace index out of range"
}
```

## Dimension Reduction

**Endpoint:** `GET /dimension_reduce`

**Query Parameters:**

- sub_ind (optional): Index of the subspace. If not provided, applies dimensionality reduction on the full dataset.
- n_components (optional): Number of dimensions to reduce to. If not provided, 2 by default.

Example Request:

`GET /dimension_reduce?sub_ind=2&n_components=2`

**Response:**

Returns the reduced dataset as a JSON object, where each row has the reduced features and the label target.

Response Example:

```json
{
[
  {
    "compo_feature0": 1.23,
    "compo_feature1": -0.67,
    "target": 1
  },
  {
    "compo_feature0": -0.45,
    "compo_feature1": 0.89,
    "target": 0
  }
]
}
```

**Error Responses:**

• 400 Bad Request: If the subspace index or number of components is invalid.

```json
{
  "error": "Invalid number of components: must be between 1 and the number of features."
}
```

## Get Feature Metric

**Endpoint:** `GET /get_feature_metric`

**Description:**

Retrieve a specific metric (maximum or average) for one or more features within a dataset or subspace.

**Query Parameters:**

- sub_ind (optional): Index of the subspace. If not provided, the metric is calculated on the full dataset.
- feature (required): Comma-separated list of feature names for which the metric is calculated.
- metric (required): The metric to calculate. Supported metrics:
  - max: Maximum value of the feature(s).
  - avg: Average (mean) value of the feature(s).

**Example Request:**

`GET /get_feature_metric?sub_ind=1&feature=age,chol&metric=max`

**Response:**
• A JSON object with the metric values for the specified features.

**Response Example:**

Request:

`GET /get_feature_metric?sub_ind=1&feature=age,chol&metric=max`

Response:

```json
{
  "age": 77,
  "chol": 564
}
```

**Error Responses:**

- 400 Bad Request: If the subspace index is out of range or features/metric are invalid.

Notes:

- Ensure that the metric parameter is one of the supported values (max or avg).

## Fetch subspace filter

**Description**

Return the original subspace filter when creating/updating subspace

**Query Parameters**

- sub_ind (required)
  Example: `/get_subspace_filter?sub_ind=2`



## Get LLM Response

**Endpoint:** `GET /get_llm_response`

### Description:

Generates a text-based response from a language model (LLM) based on two provided features (e.g., medical conditions, metrics, etc.). This endpoint takes two feature inputs and an optional word limit, and returns a detailed, generated response based on the relationship between the two features.

### Query Parameters:

- `feature1` (required): The first feature or term that will be used to generate the response. This could be any text describing a characteristic, condition, or entity.
- `feature2` (required): The second feature or term used in combination with `feature1` to generate a response.
- `word_limit` (optional): The maximum number of words the generated response should contain. If not provided, the response will not be limited by word count.

### Example Request:

```
GET /get_llm_response?feature1=Resting%20Blood%20Pressure&feature2=Chest%20Pain&word_limit=300
```


### Response:

A JSON object containing a text-based response generated by the model based on the input features and word limit.

#### Response Example:

```json
{
  "response": "Research has consistently shown a strong correlation between Resting Blood Pressure (RBP) and the likelihood of experiencing Chest Pain (CP). Elevated RBP has been found to increase the risk of CP, particularly among individuals with known coronary artery disease (CAD).\n\nStudies have demonstrated that for every 10 mmHg increase in systolic blood pressure, the risk of CP increases by 16-20%. Additionally, studies have shown that elevated diastolic blood pressure (>90 mmHg) is associated with a higher risk of CP, particularly in patients with a history of cardiovascular disease.\n\nA meta-analysis of 25 studies found that systolic blood pressure >140 mmHg and diastolic blood pressure >90 mmHg were associated with a significantly increased risk of CP, with odds ratios of 1.43 and 1.63, respectively.\n\nFurthermore, research has suggested that the correlation between RBP and CP may be particularly relevant among women, who are less likely to experience chest pain symptoms despite having significant coronary artery disease. Elevated RBP may serve as a valuable indicator of cardiac risk among women, particularly in the absence of traditional CAD risk factors.\n\nIn conclusion, the correlation between RBP and CP is strong, with elevated RBP increasing the risk of CP among individuals with known CAD and potentially serving as a valuable indicator of cardiac risk among women."
}
```

**Error Responses:**

- 400 Bad Request: If either feature1 or feature2 is missing, or if the word_limit is a non-positive integer.

- 400 Bad Request: If word_limit is provided but is not a positive integer.

- 500 Internal Server Error: If the GroqClient or the generate_answer function encounters an issue while processing the request.