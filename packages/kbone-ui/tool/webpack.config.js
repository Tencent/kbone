const path = require('path')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

const isDevelop = process.env.NODE_ENV === 'development'

module.exports = {
    mode: isDevelop ? 'development' : 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: isDevelop ? '[name].dev.js' : '[name].js',
        library: 'KBoneUI',
        libraryTarget: 'umd',
    },
    target: 'web',
    watch: isDevelop,
    optimization: {
        minimizer: isDevelop ? [] : [
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
            })
        ],
    },
    module: {
        rules: [{
            // html
            test: /\.html$/,
            loader: 'raw-loader',
        }, {
            // css
            test: /\.(less|css)$/,
            use: [{
                loader: 'raw-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [['autoprefixer']],
                    }
                }
            }, {
                loader: 'less-loader'
            }],
        }, {
            // eslint
            test: /\.js$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [path.resolve(__dirname, './src')],
            options: {
                formatter: eslintFriendlyFormatter,
                emitWarning: true,
            },
        }, {
            // js
            test: /\.js$/,
            use: [
                'thread-loader',
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    }
                }
            ],
            exclude: /node_modules/
        }, {
            // res
            test: /\.(png|jpg|jpeg|gif|svg|eot|woff|woff2|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 99999999,
                    emitFile: false,
                }
            }],
        }],
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    plugins: [
        new StylelintPlugin({
            files: '**/*.less',
            fix: true,
        }),
    ],
}
