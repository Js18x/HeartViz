from typing import Union

import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
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
        self.subspace_filters: [dict] = []

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
        filter = {"features": features, "ranges": ranges}

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
        subdataset.reset_index(drop=True, inplace=True)
        self.subspaces.append(subdataset)
        self.subspace_filters.append(filter)
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

    def get_subspace_filter(self, sub_ind: int = None):
        if sub_ind is None:
            raise ValueError("Cannot fetch filter on full dataset. Now passed sub_ind is None")
        elif not 0 <= sub_ind < len(self.subspaces):
            raise ValueError("Subspace index out of range")

        return self.subspace_filters[sub_ind]

    def fetch_data_with_features(self, sub_ind: int = None, features: list[str] = None):
        """
        fetch data with specified features and subspace.
        :param sub_ind: an int, specify index of the subspace. If None, uses the full dataset.
        :param features : Optional, a list of str, specify the features to filter on. If not provided, return the full subspace
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

    def distribution_by_feature(self, feature: str, sub_ind: int, by_label):
        if sub_ind is None:
            df = self.dataset
        elif 0 <= sub_ind < len(self.subspaces):
            df = self.subspaces[sub_ind]
        else:
            raise ValueError("Subspace index out of range")
        if feature is None:
            raise ValueError("Feature cannot be None")
        if feature not in df.columns:
            raise ValueError(f"Feature '{feature}' not found in the dataset.")

        by_label = True if by_label else False

        if feature == 'target' and by_label:
            raise ValueError("cannot use 'target' feature with 'by_label' feature set to True")

        if by_label and 'target' not in df.columns:
            raise ValueError("target feature not found in the subspace so you can't set by_label to true.")
        # get distribution
        if by_label:
            distribution = {}
            for i in range(0, 5):
                distribution[i] = df[df['target'] == i][feature].value_counts().to_dict()
        else:
            df = df[feature]
            distribution = df.value_counts().to_dict()
        return distribution

    def update_subspace(self, features: list[str], ranges: list[list[Union[float, int]]], sub_ind: int = None):
        if len(features) != len(ranges):
            raise ValueError("Features and ranges must have the same length!")

        if sub_ind is None:
            raise ValueError("Subspace index cannot be None")
        elif not 0 <= sub_ind < len(self.subspaces):
            raise ValueError("Subspace index out of range")

        condition = pd.Series(True, index=self.dataset.index)  # Start with all True
        filter = {"features": features, "ranges": ranges}

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
        subdataset.reset_index(drop=True, inplace=True)
        self.subspaces[sub_ind] = subdataset
        self.subspace_filters[sub_ind] = filter
        return {'update_state': True}

    # Assume self.dataset is a pandas DataFrame
    def dimension_reduce(self, sub_ind: int, n_components: int):
        if sub_ind is None:
            df = self.dataset
        elif 0 <= sub_ind < len(self.subspaces):
            df = self.subspaces[sub_ind]
        else:
            raise ValueError("Subspace index out of range")
        n_components = 2 if n_components is None else n_components

        # Separate features and target
        features = df.drop(columns=["target"])
        features = features.dropna()
        target = self.dataset["target"]

        # Standardize the feature data
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)

        # Apply PCA to reduce dimensions to n_components
        pca = PCA(n_components=n_components)
        reduced_features = pca.fit_transform(scaled_features)

        # Create a new DataFrame with reduced features and target
        reduced_df = pd.DataFrame(
            reduced_features, columns=[f"compo_feature{i}" for i in range(n_components)]
        )
        reduced_df["target"] = target.reset_index(drop=True)

        return reduced_df

    def get_feature_metric(self, sub_ind: int, features: [str], metric: str):
        if sub_ind is None:
            df = self.dataset
        elif not 0 <= sub_ind < len(self.subspaces):
            raise ValueError("Subspace index out of range")
        else:
            df = self.subspaces[sub_ind]

        if not set(features).issubset(df.columns):
            raise ValueError(f"Features '{features}' not found in the subspace {sub_ind}.")

        if metric == 'max':
            return df[features].max().to_dict()
        if metric == 'avg':
            return df[features].mean().to_dict()
        raise ValueError(f"Metric '{metric}' not supported.")


if __name__ == "__main__":
    loader = DataLoader()
    print(loader.get_subspace_filter(None))
