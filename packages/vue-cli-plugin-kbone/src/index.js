module.exports = (api, options) => {
    if (process.env.MP_ENV === 'miniprogram') {
        const path = require('path')
        const webpack = require('webpack')
        const MpPlugin = require('mp-webpack-plugin')
        const MiniCssExtractPlugin = require('mini-css-extract-plugin')

        const cwd = api.getCwd()
        const mpConfigPath = path.join(path.relative(__dirname, cwd), './miniprogram.config')
        // eslint-disable-next-line import/no-dynamic-require
        const mpConfig = require(mpConfigPath)

        options.css.extract = true

        const pages = options.pages || {
            app: './src/index.js'
        }
        const entryList = Object.keys(pages)

        api.chainWebpack(webpackConfig => {
            webpackConfig
                .devtool('node')

            // 处理入口
            entryList.forEach(entryName => {
                const entryValue = pages[entryName]
                const entryFilePath = typeof entryValue === 'object' ? entryValue.entry : entryValue

                webpackConfig
                    .entry(entryName)
                    .clear()
                    .add(api.resolve(path.join(entryFilePath, `../${mpConfig.vue.entryFileName}`)))
                    .end()
            })

            webpackConfig
                .output.filename('[name].js')
                .library('createApp')
                .libraryExport('default')
                .libraryTarget('window')
                .end()
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
                            priority: -10,
                        },
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true,
                        },
                    },
                })
                .end()

                .module.rule('images')
                .test(/\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/)
                .use('url-loader')
                .loader('url-loader')
                .options({
                    limit: mpConfig.vue.cdnLimit,
                    name: '[name]_[hash:hex:6].[ext]',
                    publicPath: mpConfig.vue.cdnPath, // 对于资源文件直接使用线上的 cdn 地址
                    emitFile: false,
                })
                .end()
                .end()
                .end()

                .plugins.delete('copy')
                .end()

                .plugin('define')
                .use(new webpack.DefinePlugin({
                    'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
                }))
                .end()

                .plugin('extract-css')
                .use(new MiniCssExtractPlugin({
                    filename: '[name].wxss',
                    chunkFilename: '[name].wxss',
                }))
                .end()

                .plugin('mp-webpack')
                .use(new MpPlugin(mpConfig))
                .end()
        })
    }
}
