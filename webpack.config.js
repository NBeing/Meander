var path    = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  devtool: 'eval-source-maps',
  module: {
    rules: [
      {
          test: /\.ts(x?)$/,
          use: ['ts-loader'],
          exclude: path.resolve(__dirname, "node_modules")
        }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
