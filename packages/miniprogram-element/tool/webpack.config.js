const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        base: path.resolve(__dirname, '../src/base.js'),
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
    externals: {
        'miniprogram-render': 'commonjs miniprogram-render',
    },
    devtool: 'source-map',
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, '../src/template'), to: path.resolve(__dirname, '../dist/template')},
                {from: path.resolve(__dirname, '../src/custom-component'), to: path.resolve(__dirname, '../dist/custom-component')},
                {from: path.resolve(__dirname, '../src/index.js'), to: path.resolve(__dirname, '../dist/index.js')},
                {from: path.resolve(__dirname, '../src/index.json'), to: path.resolve(__dirname, '../dist/index.json')},
                {from: path.resolve(__dirname, '../src/index.wxml'), to: path.resolve(__dirname, '../dist/index.wxml')},
                {from: path.resolve(__dirname, '../src/index.wxss'), to: path.resolve(__dirname, '../dist/index.wxss')},
                {from: path.resolve(__dirname, '../src/index-vhost.js'), to: path.resolve(__dirname, '../dist/index-vhost.js')},
                {from: path.resolve(__dirname, '../src/index-vhost.json'), to: path.resolve(__dirname, '../dist/index-vhost.json')},
                {from: path.resolve(__dirname, '../src/index-vhost.wxml'), to: path.resolve(__dirname, '../dist/index-vhost.wxml')},
                {from: path.resolve(__dirname, '../src/index-vhost.wxss'), to: path.resolve(__dirname, '../dist/index-vhost.wxss')},
            ]
        })
    ]
}
