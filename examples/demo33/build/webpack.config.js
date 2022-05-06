const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, '../src/index/main.js'),
    index2: path.resolve(__dirname, '../src/index2/main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    publicPath: './',
    filename: '[name].js'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      // 和小程序侧对齐，用 108 版本
      threejs: 'three/build/three.module',
      OrbitControls: 'three/examples/jsm/controls/OrbitControls',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: path.join(__dirname, '../index.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'index2.html',
      chunks: ['index2'],
      template: path.join(__dirname, '../index.html')
    }),
  ],
}
