const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    target: 'node',
    optimization: {
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
        })],
    },
    resolve: {
        extensions: ['*', '.js']
    },
    devtool: 'source-map',
}
