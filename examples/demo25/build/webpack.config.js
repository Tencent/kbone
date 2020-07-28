const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    page1: path.resolve(__dirname, '../src/page1/main.js'),
    page2: path.resolve(__dirname, '../src/page2/main.js'),
    page3: path.resolve(__dirname, '../src/page3/main.js'),
    
    // TODO：worker-loader 暂时还不支持 sharedWorker 目前
    worker: path.resolve(__dirname, '../src/worker/worker.js'),
    sharedWorker: path.resolve(__dirname, '../src/worker/shared.worker.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    publicPath: './',
    filename: '[name].js'
  },
  target: 'web',
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ],
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'page1.html',
      chunks: ['page1'],
      template: path.join(__dirname, '../index.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'page2.html',
      chunks: ['page2'],
      template: path.join(__dirname, '../index.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'page3.html',
      chunks: ['page3'],
      template: path.join(__dirname, '../index.html')
    }),
  ],
}
