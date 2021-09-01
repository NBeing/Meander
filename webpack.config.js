const path    = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  // stats: 'minimal',
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html'
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: './dist',
    port: 9000,
    https: true,
  },
};
