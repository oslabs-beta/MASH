const path = require('path');

module.exports = {
  mode: 'development',
  entry: './main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
