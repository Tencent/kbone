const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin') // 用于构建小程序代码的 webpack 插件

const isOptimize = true // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index/main.mp.js'),
        bar: path.resolve(__dirname, '../src/bar/main.mp.js'),
        scatter: path.resolve(__dirname, '../src/scatter/main.mp.js'),
        pie: path.resolve(__dirname, '../src/pie/main.mp.js'),
        line: path.resolve(__dirname, '../src/line/main.mp.js'),
        funnel: path.resolve(__dirname, '../src/funnel/main.mp.js'),
        gauge: path.resolve(__dirname, '../src/gauge/main.mp.js'),
        k: path.resolve(__dirname, '../src/k/main.mp.js'),
        radar: path.resolve(__dirname, '../src/radar/main.mp.js'),
        heatmap: path.resolve(__dirname, '../src/heatmap/main.mp.js'),
        tree: path.resolve(__dirname, '../src/tree/main.mp.js'),
        treemap: path.resolve(__dirname, '../src/treemap/main.mp.js'),
        sunburst: path.resolve(__dirname, '../src/sunburst/main.mp.js'),
        map: path.resolve(__dirname, '../src/map/main.mp.js'),
        graph: path.resolve(__dirname, '../src/graph/main.mp.js'),
        boxplot: path.resolve(__dirname, '../src/boxplot/main.mp.js'),
        parallel: path.resolve(__dirname, '../src/parallel/main.mp.js'),
        sankey: path.resolve(__dirname, '../src/sankey/main.mp.js'),
        themeriver: path.resolve(__dirname, '../src/themeriver/main.mp.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist/mp/common'), // 放到小程序代码目录中的 common 目录下
        filename: '[name].js', // 必需字段，不能修改
        library: 'createApp', // 必需字段，不能修改
        libraryExport: 'default', // 必需字段，不能修改
        libraryTarget: 'window', // 必需字段，不能修改
    },
    target: 'web', // 必需字段，不能修改
    optimization: {
        runtimeChunk: false, // 必需字段，不能修改
        splitChunks: { // 代码分隔配置，不建议修改
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

        minimizer: isOptimize ? [
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
            // 压缩 js
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
            })
        ] : [],
    },
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
                loader: [
                    'vue-loader',
                ],
            },
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: true,
                        emitFile: false,
                    },
                }],
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
        }),
        new MiniCssExtractPlugin({
            filename: '[name].wxss',
        }),
        new VueLoaderPlugin(),
        new MpPlugin(require('./miniprogram.config.js')),
    ],
}
