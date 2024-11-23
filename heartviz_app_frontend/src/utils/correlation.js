export const calculateCorrelationMatrix = (data, attributes) => {
  const matrix = [];
  for (let i = 0; i < attributes.length; i++) {
      const row = [];
      for (let j = 0; j < attributes.length; j++) {
          const x = data.map((d) => d[attributes[i]]);
          const y = data.map((d) => d[attributes[j]]);
          row.push(calculateCorrelation(x, y));
      }
      matrix.push(row);
  }
  return matrix;
};

const calculateCorrelation = (x, y) => {
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const meanX = mean(x);
  const meanY = mean(y);

  const numerator = x
      .map((xi, i) => (xi - meanX) * (y[i] - meanY))
      .reduce((a, b) => a + b, 0);

  const denominator = Math.sqrt(
      x.map((xi) => Math.pow(xi - meanX, 2)).reduce((a, b) => a + b, 0) *
      y.map((yi) => Math.pow(yi - meanY, 2)).reduce((a, b) => a + b, 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};
