from ucimlrepo import fetch_ucirepo
import pandas as pd

class DataLoader:
    """
    A class to load, preprocess, and manipulate the Heart Disease dataset from the UCI repository.
    """

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
        if 0 <= sub_ind < len(self.subspaces):
            return self.subspaces[sub_ind].corr()
        raise ValueError("Subspace index out of range")

    def create_subspace(self, features: list[str], ranges: list[list[float]]):
        """
        Creates a filtered subspace based on specified features and ranges.

        :param features: list of str. The features to filter on.
        :param ranges: list of list. Each list specifies [min, max] for the corresponding feature.
        :return: int. The index of the created subspace.
        :raises ValueError: If the number of features and ranges do not match.
        """
        if len(features) != len(ranges):
            raise ValueError("Features and ranges must have the same length!")

        condition = pd.Series(True, index=self.dataset.index)
        for feature, range_ in zip(features, ranges):
            min_val, max_val = range_
            condition &= (self.dataset[feature] >= min_val) & (self.dataset[feature] <= max_val)

        subdataset = self.dataset[condition]
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

        return {col: [df[col].min(), df[col].max()] for col in df.columns}


if __name__ == "__main__":
    loader = DataLoader()
    print(loader.corr_matrix())