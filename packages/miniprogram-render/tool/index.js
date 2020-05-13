const path = require('path')
const {pack} = require('../../miniprogram-element/tool/pack')

function main() {
    pack(path.join(__dirname, '../src/index.js'), path.join(__dirname, '../dist'))
}
main()
