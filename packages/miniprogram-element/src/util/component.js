const wxComponentMap = {
    // 视图容器
    'cover-image': {
        wxCompName: 'cover-image',
        config: require('../component/cover-image'),
    },
    'cover-view': {
        wxCompName: 'cover-view',
        config: require('../component/cover-view'),
    },
    view: {
        wxCompName: 'view',
        config: require('../component/view'),
    },
    // 基础内容
    text: {
        wxCompName: 'text',
        config: require('../component/text'),
    },
    // 表单组件
    button: {
        wxCompName: 'button',
        config: require('../component/button'),
    },
    INPUT: {
        wxCompName: 'input',
        config: require('../component/input'),
    },
    picker: {
        wxCompName: 'picker',
        config: require('../component/picker'),
    },
    TEXTAREA: {
        wxCompName: 'textarea',
        config: require('../component/textarea'),
    },
    // 媒体组件
    camera: {
        wxCompName: 'camera',
        config: require('../component/camera'),
    },
    image: {
        wxCompName: 'image',
        config: require('../component/image'),
    },
    'live-player': {
        wxCompName: 'live-player',
        config: require('../component/live-player'),
    },
    'live-pusher': {
        wxCompName: 'live-pusher',
        config: require('../component/live-pusher'),
    },
    VIDEO: {
        wxCompName: 'video',
        config: require('../component/video'),
    },
    // 地图
    map: {
        wxCompName: 'map',
        config: require('../component/map'),
    },
    // 画布
    CANVAS: {
        wxCompName: 'canvas',
        config: require('../component/canvas'),
    },
    // 开放能力
    'web-view': {
        wxCompName: 'web-view',
        config: require('../component/web-view'),
    },
}

const wxComponentKeys = Object.keys(wxComponentMap)
const wxCompNameMap = {}
const properties = {}
const handles = {}
wxComponentKeys.forEach(key => {
    const {wxCompName, config} = wxComponentMap[key]

    wxCompNameMap[key] = wxCompName
    properties[wxCompName] = config.properties
    Object.assign(handles, config.handles)
})

module.exports = {
    wxCompNameMap,
    properties,
    handles,
}
