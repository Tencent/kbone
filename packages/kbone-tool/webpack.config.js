const path = require('path')

module.exports = {
    mode: 'production',
    target: 'web',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index.min.js',
        libraryTarget: 'commonjs2',
    },
    optimization: {
        minimize: true,
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-3'],
                },
            }],
            exclude: /node_modules/
        }],
    },
}