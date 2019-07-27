const view = require('../component/view')
const video = require('../component/video')
const image = require('../component/image')
const input = require('../component/input')
const textarea = require('../component/textarea')
const picker = require('../component/picker')
const button = require('../component/button')

module.exports = {
    view: view.properties,
    input: input.properties,
    textarea: textarea.properties,
    video: video.properties,
    picker: picker.properties,
    image: image.properties,
    button: button.properties,
}
