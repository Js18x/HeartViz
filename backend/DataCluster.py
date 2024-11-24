from scipy.cluster.hierarchy import linkage
from sklearn.preprocessing import StandardScaler

from DataLoader import DataLoader


class DataCluster:
    clusters = []

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
                "name": f"Leaf_{i}",
                "value": self.df.iloc[i]["target"],
                "index_df": i
            }

        # Process linkage matrix
        for i, (left, right, distance, size) in enumerate(self.linked):
            left, right = int(left), int(right)
            value = nodes[left]['value'] + nodes[right]['value']
            leaf_node_size = nodes[left].get('leaf_node_size', 1) + nodes[right].get('leaf_node_size', 1)
            new_node = {
                "name": f"Node_{n_samples + i}",
                "leaf_node_size": leaf_node_size,
                "value": value,
                "children": [nodes[left], nodes[right]],  # Attach child nodes
            }
            nodes[n_samples + i] = new_node

        self.tree = nodes[max(nodes.keys())]
        return self.tree

    def get_data_from_node_name(self, node_name):

        # Helper function to find the node with the given name
        def find_node(node, name):
            if node["name"] == name:
                return node
            if "children" in node:
                for child in node["children"]:
                    found = find_node(child, name)
                    if found:
                        return found
            return None

        # Helper function to collect all leaf nodes under a given subtree
        def collect_leaf_nodes(node, _indices: list):
            if "children" not in node:  # If this is a leaf node
                return node["index_df"]
            for child in node["children"]:
                _indices.append(collect_leaf_nodes(child, _indices))

        # Step 1: Find the subtree root with the specified node_name
        subroot = find_node(self.tree, node_name)
        if subroot is None:
            raise ValueError(f"Node with name {node_name} not found in the tree.")

        # Step 2: Collect all leaf node indices under this subtree
        indices = []
        leaf_indices = collect_leaf_nodes(subroot, indices)

        # Step 3: Extract the rows from the DataFrame corresponding to these indices
        subspace_df = self.df.iloc[leaf_indices]

        return subspace_df


if __name__ == '__main__':
    loader = DataLoader()
    df = loader.fetch_data_with_features()
    cluster = DataCluster(df)
    print(cluster.build_iterative_tree())
