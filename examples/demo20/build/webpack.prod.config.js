const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const autoprefixer = require('autoprefixer')


const getPageList = require('./utils/getPageList')

const list = getPageList(path.resolve(__dirname, '../src/pages'))
const pageList = list.map(item => item.name)

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    filename: path.posix.join('static', 'js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js'),
    publicPath: './'
  },
  optimization: {
    splitChunks: { // 代码分割配置
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
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
    minimizer: [
      // 压缩CSS
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
          }],
        },
        canPrint: false
      }),
      // 压缩 js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
      }),
    ],
  },
  devtool: false,
  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
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
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    // 分离 css 文件
    new MiniCssExtractPlugin({
      filename: path.posix.join('static', 'css/[name].[hash].css'),
    }),
    ...pageList.map(page => new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, `../dist/web/${page}.html`),
      chunks:[page],
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // 更多配置：https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'dependency'
    })),
    // new HtmlWebpackPlugin({
    //   filename: path.resolve(__dirname, '../dist/web/index.html'),
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // 更多配置：https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   chunksSortMode: 'dependency'
    // }),
    // 当 vendor 模块没有改变时，保证模块 id 不变
    new webpack.HashedModuleIdsPlugin(),
  ],
})

module.exports = webpackConfig
