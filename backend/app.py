from flask import Flask, jsonify, request
from flask_cors import CORS

# Import the DataLoader class
from DataLoader import DataLoader

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
loader = DataLoader()


@app.route('/correlation_matrix', methods=['GET'])
def get_correlation_matrix():
    """
    API endpoint to fetch the correlation matrix.

    Query Parameters:
    - sub_ind (optional): Index of the subspace. If not provided, computes for the full dataset.

    Response:
    - JSON object containing the correlation matrix.
    """
    sub_ind = request.args.get("sub_ind", type=int)
    try:
        corr_matrix = loader.corr_matrix(sub_ind)
        return jsonify({"correlation_matrix": corr_matrix.to_dict()})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route('/create_subspace', methods=['POST'])
def create_subspace():
    """
    API endpoint to create a subspace with filtered features.

    Request Body (JSON)
    ------------
    - features: List of feature names to filter on.
    - ranges:
        for quantitative attributes: List of [min, max] ranges corresponding to the features.
        for categorical attributes: list of chosen values

    Response
    -------------
    - JSON object containing the index of the created subspace.
    """
    data = request.get_json()
    features = data.get("features")
    ranges = data.get("ranges")

    try:
        subspace_index = loader.create_subspace(features, ranges)
        return jsonify({"subspace_index": subspace_index})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route('/feature_ranges', methods=['GET'])
def get_feature_ranges():
    """
    API endpoint to fetch feature ranges.
    ---------------
    Query Parameters:
    -------------
    - sub_ind (optional): Index of the subspace. If not provided, fetches for the full dataset.

    Response:
    -------------
    - JSON object containing feature ranges.
    """
    sub_ind = request.args.get("sub_ind", type=int)
    try:
        feature_ranges = loader.get_feature_ranges(sub_ind)
        return jsonify({"feature_ranges": feature_ranges})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route('/fetch_data_with_features', methods=['GET'])
def fetch_data_with_features():
    """
    API endpoint to fetch data with features.

    Query Parameters
    -----------
    - sub_ind (optional): Index of the subspace. If not provided, fetches for the full dataset.
    - features (optional): List of feature names to filter on.

    Response
    -----------
    :returns: JSON object containing the data with features and their corresponding ranges.
    """
    features_lst = request.args.get("features", type=str)
    sub_ind = request.args.get("sub_ind", type=int)
    if features_lst is not None:
        features_lst = features_lst.split(",")

    try:
        fetched_data = loader.fetch_data_with_features(sub_ind, features_lst).to_dict(orient="list")
        return jsonify({"data": fetched_data})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)