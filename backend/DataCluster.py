from scipy.cluster.hierarchy import linkage
from sklearn.preprocessing import StandardScaler

from DataLoader import DataLoader


class DataCluster:
    def __init__(self, _df):
        scaler = StandardScaler()
        self.df = _df
        _df.dropna(inplace=True)
        _df.reset_index(drop=True, inplace=True)
        data_scaled = scaler.fit_transform(_df.drop(columns=['target']) if 'target' in _df.columns else _df)
        self.linked = linkage(data_scaled, method='ward')
        self.tree = None

    def build_iterative_tree(self):
        n_samples = self.linked.shape[0] + 1  # Number of original data points (leaf nodes)
        nodes = {}  # Dictionary to store nodes by index

        # Initialize leaf nodes
        for i in range(n_samples):
            nodes[i] = {
                "name": f"Leaf {i}",
                "value": i
            }

        # Process linkage matrix
        for i, (left, right, distance, size) in enumerate(self.linked):
            left, right = int(left), int(right)
            new_node = {
                "name": f"Node {n_samples + i}",
                "value": float(distance),  # Use distance as the node value
                "children": [nodes[left], nodes[right]],  # Attach child nodes
            }
            nodes[n_samples + i] = new_node

        # The last node in the dictionary is the root
        self.tree = nodes[max(nodes.keys())]
        return self.tree


if __name__ == '__main__':
    loader = DataLoader()
    df = loader.fetch_data_with_features()
    cluster = DataCluster(df)
    print(cluster.build_iterative_tree())
