const path = require('path')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const TerserPlugin = require('terser-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDevelop = process.env.NODE_ENV === 'development'

module.exports = {
    mode: isDevelop ? 'development' : 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
        'wx-components': path.resolve(__dirname, '../src/wx-components.js'),
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
            use: [{
                loader: 'html-loader',
                options: {
                    esModule: true,
                },
            }],
        }, {
            // css
            test: /\.(less|css)$/,
            use: [{
                loader: 'raw-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            ['autoprefixer'],
                            ['cssnano', {preset: 'default'}],
                        ],
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
        // new BundleAnalyzerPlugin({
        //     defaultSizes: 'stat',
        // }),
    ],
}
