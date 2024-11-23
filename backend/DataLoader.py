from typing import Union

import pandas as pd
from ucimlrepo import fetch_ucirepo


class DataLoader:
    """
    A class to load, preprocess, and manipulate the Heart Disease dataset from the UCI repository.
    """

    # data type of attributes
    datatype = {"age": 0, "sex": 1, "cp": 1, "trestbps": 0, "chol": 0, "fbs": 0, "restecg": 1,
                "thalach": 0, "exang": 1, "oldpeak": 0, "slope": 1, "ca": 0, "thal": 1, "target": 1}

    def __init__(self):
        """
        Initializes the DataLoader by fetching the dataset and setting up the main DataFrame.
        """
        # Fetch dataset
        heart_disease = fetch_ucirepo(id=45)

        # Combine features and target into a single DataFrame
        X = heart_disease.data.features
        y = heart_disease.data.targets
        self.dataset = pd.concat([X, y], axis=1)

        # Set column names
        self.dataset.columns = [
            "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
            "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"
        ]
        # Initialize a list for subspaces
        self.subspaces: list[pd.DataFrame] = []

    def corr_matrix(self, sub_ind: int = None):
        """
        Computes the correlation matrix for the dataset or a specific subspace.

        :param sub_ind: int, optional. Index of the subspace. If None, computes for the full dataset.
        :return: pd.DataFrame. The correlation matrix.
        :raises ValueError: If the subspace index is invalid.
        """
        if sub_ind is None:
            return self.dataset.corr()
        elif 0 <= sub_ind < len(self.subspaces):
            return self.subspaces[sub_ind].corr()
        raise ValueError("Subspace index out of range")

    def create_subspace(self, features: list[str], ranges: list[list[Union[float, int]]]):
        """
        Creates a filtered subspace based on specified features and ranges.

        :param features: list of str. The features to filter on.
        :param ranges: list of list. For quantitative features, each list specifies [min, max].
                       For categorical features, each list contains allowed values.
        :return: int. The index of the created subspace.
        :raises ValueError: If the number of features and ranges do not match.
                            If a feature is not found in the dataset.
                            If the range of quantitative features is invalid.
        """
        if len(features) != len(ranges):
            raise ValueError("Features and ranges must have the same length!")

        condition = pd.Series(True, index=self.dataset.index)  # Start with all True
        for feature, range_ in zip(features, ranges):
            if feature not in self.dataset.columns:
                raise ValueError(f"Feature '{feature}' not found in the dataset.")

            if DataLoader.datatype[feature] == 0:  # Quantitative feature
                if len(range_) != 2:
                    raise ValueError(f"Range '{range_}' must have two elements.")
                min_val, max_val = range_
                condition &= (self.dataset[feature] >= min_val) & (self.dataset[feature] <= max_val)
            else:  # Categorical feature
                condition &= self.dataset[feature].isin(range_)

        subdataset = self.dataset.loc[condition, features]
        self.subspaces.append(subdataset)
        return len(self.subspaces) - 1

    def get_feature_ranges(self, sub_ind: int = None):
        """
        Fetches the min and max values for all features in the dataset or a specific subspace.

        :param sub_ind: int, optional. Index of the subspace. If None, uses the full dataset.
        :return: dict. A dictionary of {feature: [min, max]}.
        :raises ValueError: If the subspace index is invalid.
        """
        if sub_ind is None:
            df = self.dataset
        elif 0 <= sub_ind < len(self.subspaces):
            df = self.subspaces[sub_ind]
        else:
            raise ValueError("Subspace index out of range")

        return {col: [int(df[col].min()), int(df[col].max())] for col in df.columns}

    def fetch_data_with_features(self, sub_ind: int = None, features: list[str] = None):
        """
        fetch data with specified features and subspace.
        :param sub_ind: an int, specify index of the subspace. If None, uses the full dataset.
        :param features: a list of str, specify the features to filter on
        :return: a pd.Dataframe, filtered data
        """
        if sub_ind is None:
            df = self.dataset
        elif 0 <= sub_ind < len(self.subspaces):
            df = self.subspaces[sub_ind]
        else:
            raise ValueError("Subspace index out of range")

        subspace_features = df.columns
        if features is None:
            features = df.columns
        else:
            diff_set = set(subspace_features) - set(features)
            if len(diff_set) > 0:
                raise ValueError(f"Contains features that do not match: {diff_set}")
        return df[features]


if __name__ == "__main__":
    loader = DataLoader()
    print(loader.get_feature_ranges())
