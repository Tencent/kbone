module.exports = (api, options) => {
  if (process.env.NODE_ENV === 'mp') {
    const webpack = require('webpack')
    const MpPlugin = require('mp-webpack-plugin')
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')

    options['css']['extract'] = true

    api.chainWebpack(webpackConfig => {
      webpackConfig
        .devtool('node')

        .entry('app').clear().add('./src/main.mp.js').end()

        .output.filename('[name].js')
        .library('createApp')
        .libraryExport('default')
        .libraryTarget('window').end()
        .target('web')

        .optimization.runtimeChunk(false)
        .splitChunks({
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
        }).end()

        .plugins.delete('copy').end()

        // .plugins.delete('html').end()

        .plugin('define').use(new webpack.DefinePlugin({
          'process.env.isMiniprogram': process.env.isMiniprogram // 注入环境变量，用于业务代码判断
        })).end()

        .plugin('extract-css').use(new MiniCssExtractPlugin({
          filename: '[name].wxss',
          chunkFilename: '[name].wxss'
        })).end()

        .plugin('mp-webpack').use(new MpPlugin(require('../../miniprogram.config.js'))).end()
    })
  }
}
