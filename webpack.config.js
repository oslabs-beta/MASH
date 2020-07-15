const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './App/Main.ts',
  output: {
    filename: 'Main.js',
    path: path.resolve(__dirname, 'Build'),
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
      extensions: [ '.tsx', '.ts', '.js' ],
    },
};