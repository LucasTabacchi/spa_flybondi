const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'assets/bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    port: 5173,
    open: false,
    compress: true,
    client: { overlay: true }
  },
  module: {
    rules: [
      { test:/\.m?js$/, exclude:/node_modules/, use: { loader:'babel-loader' } },
      { test:/\.css$/i, use:['style-loader','css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  ]
};
