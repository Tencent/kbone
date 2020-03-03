const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin') // 用于构建小程序代码的 webpack 插件

const isOptimize = false // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index/main.mp.js'),

        layout: path.resolve(__dirname, '../src/layout/main.mp.js'),
        container: path.resolve(__dirname, '../src/container/main.mp.js'),
        icon: path.resolve(__dirname, '../src/icon/main.mp.js'),
        button: path.resolve(__dirname, '../src/button/main.mp.js'),
        link: path.resolve(__dirname, '../src/link/main.mp.js'),

        radio: path.resolve(__dirname, '../src/radio/main.mp.js'),
        checkbox: path.resolve(__dirname, '../src/checkbox/main.mp.js'),
        input: path.resolve(__dirname, '../src/input/main.mp.js'),
        // inputnumber: path.resolve(__dirname, '../src/inputnumber/main.mp.js'),
        // select: path.resolve(__dirname, '../src/select/main.mp.js'),
        // cascader: path.resolve(__dirname, '../src/cascader/main.mp.js'),
        // switch: path.resolve(__dirname, '../src/switch/main.mp.js'),
        // slider: path.resolve(__dirname, '../src/slider/main.mp.js'),
        // timepicker: path.resolve(__dirname, '../src/timepicker/main.mp.js'),
        // datepicker: path.resolve(__dirname, '../src/datepicker/main.mp.js'),
        // datetimepicker: path.resolve(__dirname, '../src/datetimepicker/main.mp.js'),
        // upload: path.resolve(__dirname, '../src/upload/main.mp.js'),
        // rate: path.resolve(__dirname, '../src/rate/main.mp.js'),
        // colorpicker: path.resolve(__dirname, '../src/colorpicker/main.mp.js'),
        // transfer: path.resolve(__dirname, '../src/transfer/main.mp.js'),
        // form: path.resolve(__dirname, '../src/form/main.mp.js'),

        // table: path.resolve(__dirname, '../src/table/main.mp.js'),
        // tag: path.resolve(__dirname, '../src/tag/main.mp.js'),
        // progress: path.resolve(__dirname, '../src/progress/main.mp.js'),
        // tree: path.resolve(__dirname, '../src/tree/main.mp.js'),
        // pagination: path.resolve(__dirname, '../src/pagination/main.mp.js'),
        // badge: path.resolve(__dirname, '../src/badge/main.mp.js'),
        // avatar: path.resolve(__dirname, '../src/avatar/main.mp.js'),

        // alert: path.resolve(__dirname, '../src/alert/main.mp.js'),
        // loading: path.resolve(__dirname, '../src/loading/main.mp.js'),
        // message: path.resolve(__dirname, '../src/message/main.mp.js'),
        // messagebox: path.resolve(__dirname, '../src/messagebox/main.mp.js'),
        // notification: path.resolve(__dirname, '../src/notification/main.mp.js'),

        // navmenu: path.resolve(__dirname, '../src/navmenu/main.mp.js'),
        // tabs: path.resolve(__dirname, '../src/tabs/main.mp.js'),
        // breadcrumb: path.resolve(__dirname, '../src/breadcrumb/main.mp.js'),
        // pageheader: path.resolve(__dirname, '../src/pageheader/main.mp.js'),
        // dropdown: path.resolve(__dirname, '../src/dropdown/main.mp.js'),
        // steps: path.resolve(__dirname, '../src/steps/main.mp.js'),

        // dialog: path.resolve(__dirname, '../src/dialog/main.mp.js'),
        // tooltip: path.resolve(__dirname, '../src/tooltip/main.mp.js'),
        // popover: path.resolve(__dirname, '../src/popover/main.mp.js'),
        // popconfirm: path.resolve(__dirname, '../src/popconfirm/main.mp.js'),
        // card: path.resolve(__dirname, '../src/card/main.mp.js'),
        // carousel: path.resolve(__dirname, '../src/carousel/main.mp.js'),
        // collapse: path.resolve(__dirname, '../src/collapse/main.mp.js'),
        // timeline: path.resolve(__dirname, '../src/timeline/main.mp.js'),
        // divider: path.resolve(__dirname, '../src/divider/main.mp.js'),
        // calendar: path.resolve(__dirname, '../src/calendar/main.mp.js'),
        // image: path.resolve(__dirname, '../src/image/main.mp.js'),
        // backtop: path.resolve(__dirname, '../src/backtop/main.mp.js'),
        // infinitescroll: path.resolve(__dirname, '../src/infinitescroll/main.mp.js'),
        // drawer: path.resolve(__dirname, '../src/drawer/main.mp.js'),
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
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: true,
                    emitFile: false,
                },
            }
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
