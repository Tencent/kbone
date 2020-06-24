const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

webpack(webpackConfig).run((err, stats) => {
    if (err) {
        console.log(err)
    } else {
        console.log(stats.toString({
            assets: true,
            cached: false,
            colors: true,
            children: false,
            errors: true,
            warnings: true,
            version: true,
            modules: false,
            publicPath: true,
        }))
    }
})
