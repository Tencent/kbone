const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const autoprefixer = require('autoprefixer')
const getPageList = require('./utils/getPageList')

const list = getPageList(path.resolve(__dirname, '../src/pages'))
const pageList = list.map(item => item.name)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{from: /.*/, to: '/page1.html'}],
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: process.env.HOST || 'localhost',
    port: +process.env.PORT || 8080,
    open: true, // 自动打开浏览器
    overlay: {warnings: false, errors: true}, // 展示全屏报错
    publicPath: '/',
    proxy: {},
    quiet: true, // for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [{
        loader: 'vue-style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: [
            autoprefixer,
          ],
        }
      }, {
        loader: 'less-loader',
      }],
    }],
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 开启 HMR 的时候使用该插件会显示模块的相对路径
    new webpack.NoEmitOnErrorsPlugin(),
    ...pageList.map(page => new HtmlWebpackPlugin({
      filename: `${page}.html`,
      chunks:[page],
      template: 'index.html',
      inject: true
    }))
  ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = +process.env.PORT || 8080
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: undefined,
      }))

      resolve(devWebpackConfig)
    }
  })
})
