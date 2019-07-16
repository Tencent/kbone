const path = require('path')
const mp = require('miniprogram-render')
const config = require('../tools/config')

/**
 * 构建页面
 */
const pageConfig = {
  origin: 'https://test.miniprogram.com',
  entry: '/',
  router: {
    home: [
      { regexp: '^(?:\\/home)?(?:\\/)?$', options: 'i' },
      { regexp: '^\\/index\\/(aaa|bbb)(?:\\/)?$', options: 'i' }
    ],
    list: [
      { regexp: '^\\/index\\/aaa\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i' },
      { regexp: '^\\/index\\/bbb\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i' }
    ],
    detail: [
      { regexp: '^\\/index\\/aaa\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i' },
      { regexp: '^\\/index\\/bbb\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i' }
    ],
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
// miniprogram-exparser 依赖 window/document 对象来判断是否在 dom 环境下
const simulate = require('miniprogram-simulate')

/**
 * 重写 load 方法
 */
const srcPath = config.srcPath
const oldLoad = simulate.load
simulate.load = function (componentPath, ...args) {
  if (typeof componentPath === 'string') componentPath = path.join(srcPath, componentPath)
  return oldLoad(componentPath, ...args)
}

/**
 * 获取单行 html 代码
 */
simulate.getSimpleHTML = function (html) {
  return html.trim().replace(/(?:(>)[\n\r\s\t]+)|(?:[\n\r\s\t]+(<))/g, '$1$2').replace(/[\n\r\t]+/g, '')
}

module.exports = simulate
