module.exports = (api, options) => {
    if (process.env.MP_ENV === 'miniprogram') {
        const path = require('path')
        const webpack = require('webpack')
        const MpPlugin = require('mp-webpack-plugin')
        const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

        const cwd = api.getCwd()
        const mpPluginConfigPath = path.join(path.relative(__dirname, cwd), './miniprogram.config')
        // eslint-disable-next-line import/no-dynamic-require
        const mpPluginConfig = require(mpPluginConfigPath)

        options.css.extract = {
            filename: '[name].wxss',
            chunkFilename: '[name].wxss',
        }

        const pages = options.pages || {
            app: './src/main.js'
        }
        const entryList = Object.keys(pages)

        api.configureWebpack(webpackConfig => {
            // 处理入口
            const entry = {}
            entryList.forEach(entryName => {
                const entryValue = pages[entryName]
                const entryFilePath = typeof entryValue === 'object' ? entryValue.entry : entryValue
                entry[entryName] = api.resolve(path.join(entryFilePath, `../${mpPluginConfig.vue.entryFileName}`))
            })

            // 重写 output
            webpackConfig.output = {
                path: webpackConfig.output.path,
                publicPath: webpackConfig.output.publicPath,
                filename: '[name].js', // 必需字段，不能修改
                library: 'createApp', // 必需字段，不能修改
                libraryExport: 'default', // 必需字段，不能修改
                libraryTarget: 'window', // 必需字段，不能修改
            }

            // 重写 plugins
            webpackConfig.plugins = webpackConfig.plugins.filter(plugin => [
                'VueLoaderPlugin',
                'MiniCssExtractPlugin',
            ].indexOf(plugin.constructor.name) >= 0).concat([
                new webpack.DefinePlugin({
                    'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
                }),
                new MpPlugin(mpPluginConfig),
            ])

            // 需要干掉静态资源相关的 loader
            const extList = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.eot', '.woff', '.woff2', '.ttf']
            webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => {
                for (let i = 0, len = extList.length; i < len; i++) {
                    if (rule.test instanceof RegExp && rule.test.test(extList[i])) return false
                }
                return true
            })

            return {
                entry,
                devtool: 'node',
                target: 'web', // 必需字段，不能修改
                optimization: {
                    runtimeChunk: false, // 必需字段，不能修改
                    splitChunks: { // 代码分割配置，不建议修改
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
                    minimizer: webpackConfig.mode === 'production' ? [
                        // 压缩CSS
                        new OptimizeCSSAssetsPlugin({
                            assetNameRegExp: /\.(css|wxss)$/g,
                            cssProcessor: require('cssnano'),
                            cssProcessorPluginOptions: {
                                preset: ['default', {
                                    discardComments: {
                                        removeAll: true,
                                    },
                                    minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                                }],
                            },
                            canPrint: false
                        }),
                    ] : [],
                },
                module: {
                    rules: [{
                        test: /\.(png|jpg|jpeg|gif|svg|eot|woff|woff2|ttf)$/,
                        use: [{
                            loader: 'url-loader',
                            options: {
                                limit: mpPluginConfig.vue.cdnLimit || 1024,
                                name: '[name].[hash:hex:8].[ext]',
                                publicPath: mpPluginConfig.vue.cdnPath, // 对于资源文件直接使用线上的 cdn 地址
                                emitFile: false,
                            }
                        }],
                    }],
                },
            }
        })
    }
}
