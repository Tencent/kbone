const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        page1: path.resolve(__dirname, '../src/page1/main.jsx'),
        page2: path.resolve(__dirname, '../src/page2/main.jsx'),
        page3: path.resolve(__dirname, '../src/page3/main.jsx'),
    },
    output: {
        path: path.resolve(__dirname, '../dist/web'),
        publicPath: './',
        filename: '[name].js'
    },
    target: 'web',
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
            ],
        }, {
            test: /\.[t|j]sx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]?[hash]',
            },
        }],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'page1.html',
            chunks: ['page1'],
            template: path.join(__dirname, '../index.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'page2.html',
            chunks: ['page2'],
            template: path.join(__dirname, '../index.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'page3.html',
            chunks: ['page3'],
            template: path.join(__dirname, '../index.html'),
        }),
    ],
}