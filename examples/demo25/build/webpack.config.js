const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    page1: path.resolve(__dirname, '../src/page1/main.js'),
    page2: path.resolve(__dirname, '../src/page2/main.js'),
    page3: path.resolve(__dirname, '../src/page3/main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    publicPath: './',
    filename: '[name].js'
  },
  target: 'web',
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      minSize: 1000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
  },
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
      test: /sharedWorker\.js$/,
      use: ['worker-loader', 'babel-loader'],
    }, {
      test: /worker\.js$/,
      use: ['worker-loader', 'babel-loader'],
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
