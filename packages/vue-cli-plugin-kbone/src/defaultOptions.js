const path = require('path')

module.exports = {
    entry: '/',
    router: JSON.stringify({
        app: ['/'],
    }),

    projectName: path.basename(process.cwd()),
    cdnPath: '/',
    cdnLimit: 10 * 1024,
    entryFileName: 'main.mp.js',

    appWxss: 'default',
    autoBuildNpm: '\'npm\'',
    rem: false,
}
