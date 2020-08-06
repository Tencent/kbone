const path = require('path')
const mp = require('miniprogram-render')
const simulate = require('miniprogram-simulate')

// 屏蔽 console.warn
global.console.warn = () => {}

/**
 * 构建页面
 */
const pageConfig = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        home: [
            {regexp: '^(?:\\/home)?(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/(aaa|bbb)(?:\\/)?$', options: 'i'}
        ],
        list: [
            {regexp: '^\\/index\\/aaa\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/bbb\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
        ],
        detail: [
            {regexp: '^\\/index\\/aaa\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/bbb\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
        ],
    },
    runtime: {
        subpackagesMap: {},
    },
    pages: {
        home: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7',
            reachBottom: true,
            reachBottomDistance: 200,
            pullDownRefresh: true
        },
        list: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7'
        },
        detail: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7'
        },
    },
    redirect: {
        notFound: 'home',
        accessDenied: 'home'
    },
    optimization: {
        elementMultiplexing: true,
        textMultiplexing: true,
        commentMultiplexing: true,
        domExtendMultiplexing: true,
        styleValueReduce: 1000,
        attrValueReduce: 1000,
    }
}
function createPage(type = 'home', realUrl) {
    const route = `pages/${type}/index`
    global.$$page = mp.createPage(route, pageConfig)
    realUrl = realUrl || (type === 'home' ? '/' : type === 'list' ? '/index/aaa/list/123' : 'index/aaa/detail/123')
    global.$$page.window.$$miniprogram.init(realUrl)
}
createPage('home')

/**
 * 重写 load 方法
 */
const srcPath = path.resolve(__dirname, '../src')
const oldLoad = simulate.load
simulate.load = function(componentPath, ...args) {
    if (typeof componentPath === 'string') componentPath = path.join(srcPath, componentPath)
    return oldLoad(componentPath, ...args)
}

/**
 * 获取单行 html 代码
 */
simulate.getSimpleHTML = function(html) {
    return html.trim().replace(/(?:(>)[\n\r\s\t]+)|(?:[\n\r\s\t]+(<))/g, '$1$2').replace(/[\n\r\t]+/g, '')
}

/**
 * 输出日志
 */
function err(msg) {
    const error = new Error(msg)
    console.error(error.stack)
}

/**
 * 获取 data
 */
function getData(component) {
    return component.data.childNodes && component.data.childNodes[0] && component.data.childNodes[0].extra || component.data
}
simulate.getData = getData

/**
 * 检查布尔值
 */
simulate.checkBoolean = async function(component, node, attrName, attributeName, defaultValue) {
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, !defaultValue)
    await simulate.sleep(10)
    if (getData(component)[attrName] === defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(!defaultValue)

    node.setAttribute(attributeName, defaultValue)
    await simulate.sleep(10)
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, attributeName)
    await simulate.sleep(10)
    if (!getData(component)[attrName]) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(true)

    node.setAttribute(attributeName, '')
    await simulate.sleep(10)
    if (getData(component)[attrName]) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(false)
}

/**
 * 检查数字
 */
simulate.checkNumber = async function(component, node, attrName, attributeName, defaultValue) {
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, 20)
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 20) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(20)

    node.setAttribute(attributeName, 0)
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 0) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(0)

    node.setAttribute(attributeName, '123')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 123) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(123)

    node.setAttribute(attributeName, '')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, 'abc')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)
}

/**
 * 检查字符串
 */
simulate.checkString = async function(component, node, attrName, attributeName, defaultValue) {
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, 'abcde')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 'abcde') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('abcde')

    node.setAttribute(attributeName, 'fghij')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 'fghij') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('fghij')

    node.setAttribute(attributeName, '')
    defaultValue = defaultValue === undefined ? null : defaultValue
    await simulate.sleep(10)
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)
}

/**
 * 检查 url
 */
simulate.checkUrl = async function(component, node, attrName, attributeName, defaultValue) {
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)

    node.setAttribute(attributeName, '12345')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== '12345') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('12345')

    node.setAttribute(attributeName, '//54321')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 'https://54321') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('https://54321')

    node.setAttribute(attributeName, 'http://11111')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 'http://11111') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('http://11111')

    node.setAttribute(attributeName, 'https://22222')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== 'https://22222') err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe('https://22222')

    node.setAttribute(attributeName, '')
    await simulate.sleep(10)
    if (getData(component)[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`)
    expect(getData(component)[attrName]).toBe(defaultValue)
}

/**
 * 检查数组
 */
simulate.checkArray = async function(component, node, attrName, attributeName, defaultValue, testData) {
    expect(getData(component)[attrName]).toEqual(defaultValue)

    node.setAttribute(attributeName, testData)
    await simulate.sleep(10)
    expect(getData(component)[attrName]).toEqual(testData)

    node.setAttribute(attributeName, [])
    await simulate.sleep(10)
    expect(getData(component)[attrName]).toEqual([])

    node.setAttribute(attributeName, undefined)
    defaultValue = defaultValue === undefined ? null : defaultValue
    await simulate.sleep(10)
    expect(getData(component)[attrName]).toEqual(defaultValue)
}

/**
 * 检查事件
 */
simulate.checkEvent = async function(component, node, eventNameList) {
    const evtList = []
    eventNameList.forEach(eventName => {
        if (Array.isArray(eventName)) eventName = eventName[1]
        node.addEventListener(eventName, evt => evtList.push(evt))
    })
    for (let eventName of eventNameList) {
        if (Array.isArray(eventName)) eventName = eventName[0]
        component.dispatchEvent(eventName)
        await simulate.sleep(10)
    }
    expect(evtList.map(evt => evt.type)).toEqual(eventNameList.map(eventName => (Array.isArray(eventName) ? eventName[1] : eventName)))
}

simulate.elementId = simulate.load('index', 'element')

module.exports = simulate
