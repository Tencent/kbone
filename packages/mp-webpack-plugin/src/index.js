const path = require('path')
const fs = require('fs')
const execa = require('execa')
const ConcatSource = require('webpack-sources').ConcatSource
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const {RawSource} = require('webpack-sources')
const pathToRegexp = require('path-to-regexp')
const colors = require('colors/safe')
const adjustCss = require('./tool/adjust-css')
const _ = require('./tool/utils')

const PluginName = 'MpPlugin'
const appJsTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/app.tmpl.js'), 'utf8')
const pageJsTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/page.tmpl.js'), 'utf8')
const appDisplayWxssTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/app.display.tmpl.wxss'), 'utf8')
const appExtraWxssTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/app.extra.tmpl.wxss'), 'utf8')
const appWxssTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/app.tmpl.wxss'), 'utf8')
const customComponentJsTmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/custom-component.tmpl.js'), 'utf8')
const projectConfigJsonTmpl = require('./tmpl/project.config.tmpl.json')
const packageConfigJsonTmpl = require('./tmpl/package.tmpl.json')

process.env.isMiniprogram = true // 设置环境变量
const globalVars = ['navigator', 'HTMLElement', 'localStorage', 'sessionStorage', 'location']

/**
 * 添加文件
 */
function addFile(compilation, filename, content) {
    compilation.assets[filename] = {
        source: () => content,
        size: () => Buffer.from(content).length,
    }
}

/**
 * 给 chunk 头尾追加内容
 */
function wrapChunks(compilation, chunks, globalVarsConfig) {
    chunks.forEach(chunk => {
        chunk.files.forEach(fileName => {
            if (ModuleFilenameHelpers.matchObject({test: /\.js$/}, fileName)) {
                // 页面 js
                const headerContent = 'module.exports = function(window, document) {const App = function(options) {window.appOptions = options};' + globalVars.map(item => `var ${item} = window.${item}`).join(';') + ';'
                let customHeaderContent = globalVarsConfig.map(item => `var ${item[0]} = ${item[1] ? item[1] : 'window[\'' + item[0] + '\']'}`).join(';')
                customHeaderContent = customHeaderContent ? customHeaderContent + ';' : ''
                const footerContent = '}'

                compilation.assets[fileName] = new ConcatSource(headerContent + customHeaderContent, compilation.assets[fileName], footerContent)
            }
        })
    })
}

/**
 * 获取依赖文件路径
 */
function getAssetPath(assetPathPrefix, filePath, assetsSubpackageMap, backwardStr = '../../') {
    if (assetsSubpackageMap[filePath]) assetPathPrefix = '' // 依赖在分包内，不需要补前缀
    return `${assetPathPrefix}${backwardStr}common/${filePath}`
}

class MpPlugin {
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        const options = this.options
        const generateConfig = options.generate || {}

        compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
            const outputPath = compilation.outputOptions.path
            const entryNames = Array.from(compilation.entrypoints.keys())
            const appJsEntryName = generateConfig.appEntry || generateConfig.app || '' // 取 app 是为了兼容旧版本的一个 bug
            const globalConfig = options.global || {}
            const pageConfigMap = options.pages || {}
            const subpackagesConfig = generateConfig.subpackages || {}
            const preloadRuleConfig = generateConfig.preloadRule || {}
            const tabBarConfig = generateConfig.tabBar || {}
            const wxCustomComponentConfig = generateConfig.wxCustomComponent || {}
            const wxCustomComponentRoot = wxCustomComponentConfig.root
            const wxCustomComponents = wxCustomComponentConfig.usingComponents || {}
            const pages = []
            const subpackagesMap = {} // 页面名-分包名
            const assetsMap = {} // 页面名-依赖
            const assetsReverseMap = {} // 依赖-页面名
            const assetsSubpackageMap = {} // 依赖-分包名
            const tabBarMap = {}

            // 收集依赖
            for (const entryName of entryNames) {
                const assets = {js: [], css: []}
                const filePathMap = {}
                const extRegex = /\.(css|js|wxss)(\?|$)/
                const entryFiles = compilation.entrypoints.get(entryName).getFiles()
                entryFiles.forEach(filePath => {
                    // 跳过非 css 和 js
                    const extMatch = extRegex.exec(filePath)
                    if (!extMatch) return

                    // 跳过已记录的
                    if (filePathMap[filePath]) return
                    filePathMap[filePath] = true

                    // 记录
                    let ext = extMatch[1]
                    ext = ext === 'wxss' ? 'css' : ext
                    assets[ext].push(filePath)

                    // 插入反查表
                    assetsReverseMap[filePath] = assetsReverseMap[filePath] || []
                    if (assetsReverseMap[filePath].indexOf(entryName) === -1) assetsReverseMap[filePath].push(entryName)

                    // 调整 css 内容
                    if (ext === 'css') {
                        compilation.assets[filePath] = new RawSource(adjustCss(compilation.assets[filePath].source()))
                    }
                })

                assetsMap[entryName] = assets
            }

            // 处理分包配置
            Object.keys(subpackagesConfig).forEach(packageName => {
                const pages = subpackagesConfig[packageName] || []
                pages.forEach(entryName => {
                    subpackagesMap[entryName] = packageName

                    // 寻找私有依赖，放入分包
                    const assets = assetsMap[entryName]
                    if (assets) {
                        [...assets.js, ...assets.css].forEach(filePath => {
                            const requirePages = assetsReverseMap[filePath] || []
                            if (_.includes(pages, requirePages)) {
                                // 该依赖为分包内页面私有
                                assetsSubpackageMap[filePath] = packageName
                                compilation.assets[`../${packageName}/common/${filePath}`] = compilation.assets[filePath]
                                delete compilation.assets[filePath]
                            }
                        })
                    }
                })
            })

            // 剔除 app.js 入口
            const appJsEntryIndex = entryNames.indexOf(appJsEntryName)
            if (appJsEntryIndex >= 0) entryNames.splice(appJsEntryIndex, 1)

            // 处理自定义组件字段
            Object.keys(wxCustomComponents).forEach(key => {
                if (typeof wxCustomComponents[key] === 'string') {
                    wxCustomComponents[key] = {
                        path: wxCustomComponents[key],
                    }
                }
            })

            // 处理各个入口页面
            for (const entryName of entryNames) {
                const assets = assetsMap[entryName]
                const pageConfig = pageConfigMap[entryName] = Object.assign({}, globalConfig, pageConfigMap[entryName] || {})
                const addPageScroll = pageConfig && pageConfig.windowScroll
                const pageBackgroundColor = pageConfig && (pageConfig.pageBackgroundColor || pageConfig.backgroundColor) // 兼容原有的 backgroundColor
                const reachBottom = pageConfig && pageConfig.reachBottom
                const reachBottomDistance = pageConfig && pageConfig.reachBottomDistance
                const pullDownRefresh = pageConfig && pageConfig.pullDownRefresh
                const rem = pageConfig && pageConfig.rem
                const pageStyle = pageConfig && pageConfig.pageStyle
                const pageExtraConfig = pageConfig && pageConfig.extra || {}
                const packageName = subpackagesMap[entryName]
                const pageRoute = `${packageName ? packageName + '/' : ''}pages/${entryName}/index`
                const assetPathPrefix = packageName ? '../' : ''

                // 页面 js
                let pageJsContent = pageJsTmpl
                    .replace('/* CONFIG_PATH */', `${assetPathPrefix}../../config`)
                    .replace('/* INIT_FUNCTION */', `function init(window, document) {${assets.js.map(js => 'require(\'' + getAssetPath(assetPathPrefix, js, assetsSubpackageMap) + '\')(window, document)').join(';')}}`)
                let pageScrollFunction = ''
                let reachBottomFunction = ''
                let pullDownRefreshFunction = ''
                if (addPageScroll) {
                    pageScrollFunction = () => 'onPageScroll({ scrollTop }) {if (this.window) {this.window.document.documentElement.scrollTop = scrollTop || 0;this.window.$$trigger(\'scroll\');}},'
                }
                if (reachBottom) {
                    reachBottomFunction = () => 'onReachBottom() {if (this.window) {this.window.$$trigger(\'reachbottom\');}},'
                }
                if (pullDownRefresh) {
                    pullDownRefreshFunction = () => 'onPullDownRefresh() {if (this.window) {this.window.$$trigger(\'pulldownrefresh\');}},'
                }
                pageJsContent = pageJsContent
                    .replace('/* PAGE_SCROLL_FUNCTION */', pageScrollFunction)
                    .replace('/* REACH_BOTTOM_FUNCTION */', reachBottomFunction)
                    .replace('/* PULL_DOWN_REFRESH_FUNCTION */', pullDownRefreshFunction)
                addFile(compilation, `../${pageRoute}.js`, pageJsContent)

                // 页面 wxml
                let pageWxmlContent = `<element wx:if="{{pageId}}" class="{{bodyClass}}" style="{{bodyStyle}}" data-private-node-id="e-body" data-private-page-id="{{pageId}}" ${wxCustomComponentRoot ? 'generic:custom-component="custom-component"' : ''}></element>`
                if (rem || pageStyle) {
                    pageWxmlContent = `<page-meta ${rem ? 'root-font-size="{{rootFontSize}}"' : ''} ${pageStyle ? 'page-style="{{pageStyle}}"' : ''}></page-meta>` + pageWxmlContent
                }
                addFile(compilation, `../${pageRoute}.wxml`, pageWxmlContent)

                // 页面 wxss
                let pageWxssContent = assets.css.map(css => `@import "${getAssetPath(assetPathPrefix, css, assetsSubpackageMap)}";`).join('\n')
                if (pageBackgroundColor) pageWxssContent = `page { background-color: ${pageBackgroundColor}; }\n` + pageWxssContent
                addFile(compilation, `../${pageRoute}.wxss`, adjustCss(pageWxssContent))

                // 页面 json
                const pageJson = {
                    ...pageExtraConfig,
                    enablePullDownRefresh: !!pullDownRefresh,
                    usingComponents: {
                        element: 'miniprogram-element',
                    },
                }
                if (wxCustomComponentRoot) {
                    pageJson.usingComponents['custom-component'] = `${assetPathPrefix}../../custom-component/index`
                }
                if (reachBottom && typeof reachBottomDistance === 'number') {
                    pageJson.onReachBottomDistance = reachBottomDistance
                }
                const pageJsonContent = JSON.stringify(pageJson, null, '\t')
                addFile(compilation, `../${pageRoute}.json`, pageJsonContent)

                // 记录页面路径
                if (!packageName) pages.push(pageRoute)
            }

            // 追加 webview 页面
            if (options.redirect && (options.redirect.notFound === 'webview' || options.redirect.accessDenied === 'webview')) {
                addFile(compilation, '../pages/webview/index.js', 'Page({data:{url:\'\'},onLoad: function(query){this.setData({url:decodeURIComponent(query.url)})}})')
                addFile(compilation, '../pages/webview/index.wxml', '<web-view src="{{url}}"></web-view>')
                addFile(compilation, '../pages/webview/index.wxss', '')
                addFile(compilation, '../pages/webview/index.json', '{"usingComponents":{}}')
                pages.push('pages/webview/index')
            }

            const appConfig = generateConfig.app || 'default'
            const isEmitApp = appConfig !== 'noemit'
            const isEmitProjectConfig = appConfig !== 'noconfig'

            if (isEmitApp) {
                // app js
                const appAssets = assetsMap[appJsEntryName] || {js: [], css: []}
                const appJsContent = appJsTmpl
                    .replace('/* INIT_FUNCTION */', `const fakeWindow = {};const fakeDocument = {};${appAssets.js.map(js => 'require(\'' + getAssetPath('', js, assetsSubpackageMap, '') + '\')(fakeWindow, fakeDocument)').join(';')};const appConfig = fakeWindow.appOptions || {};`)
                addFile(compilation, '../app.js', appJsContent)

                // app wxss
                const appWxssConfig = generateConfig.appWxss || 'default'
                let appWxssContent = appWxssConfig === 'none' ? '' : appWxssConfig === 'display' ? appDisplayWxssTmpl : appWxssTmpl
                if (appAssets.css.length) {
                    appWxssContent += `\n${appAssets.css.map(css => `@import "${getAssetPath('', css, assetsSubpackageMap, '')}";`).join('\n')}`
                }
                appWxssContent = adjustCss(appWxssContent)
                if (appWxssConfig !== 'none' && appWxssConfig !== 'display') {
                    appWxssContent += '\n' + appExtraWxssTmpl
                }
                addFile(compilation, '../app.wxss', appWxssContent)

                // app json
                const subpackages = []
                const preloadRule = {}
                Object.keys(subpackagesConfig).forEach(packageName => {
                    const pages = subpackagesConfig[packageName] || []
                    subpackages.push({
                        name: packageName,
                        root: packageName,
                        pages: pages.map(entryName => `pages/${entryName}/index`),
                    })
                })
                Object.keys(preloadRuleConfig).forEach(entryName => {
                    const packageName = subpackagesMap[entryName]
                    const pageRoute = `${packageName ? packageName + '/' : ''}pages/${entryName}/index`
                    preloadRule[pageRoute] = preloadRuleConfig[entryName]
                })
                const userAppJson = options.appExtraConfig || {}
                const appJson = {
                    pages,
                    window: options.app || {},
                    subpackages,
                    preloadRule,
                    ...userAppJson,
                }
                if (tabBarConfig.list && tabBarConfig.list.length) {
                    const tabBar = Object.assign({}, tabBarConfig)
                    tabBar.list = tabBarConfig.list.map(item => {
                        const iconPathName = item.iconPath ? _.md5File(item.iconPath) + path.extname(item.iconPath) : ''
                        if (iconPathName) _.copyFile(item.iconPath, path.resolve(outputPath, `../images/${iconPathName}`))
                        const selectedIconPathName = item.selectedIconPath ? _.md5File(item.selectedIconPath) + path.extname(item.selectedIconPath) : ''
                        if (selectedIconPathName) _.copyFile(item.selectedIconPath, path.resolve(outputPath, `../images/${selectedIconPathName}`))
                        tabBarMap[`/pages/${item.pageName}/index`] = true

                        return {
                            pagePath: `pages/${item.pageName}/index`,
                            text: item.text,
                            iconPath: iconPathName ? `./images/${iconPathName}` : '',
                            selectedIconPath: selectedIconPathName ? `./images/${selectedIconPathName}` : '',
                        }
                    })

                    if (tabBar.custom) {
                        // 自定义 tabBar
                        const customTabBarDir = tabBar.custom
                        tabBar.custom = true
                        _.copyDir(customTabBarDir, path.resolve(outputPath, '../custom-tab-bar'))
                    }

                    appJson.tabBar = tabBar
                }
                const appJsonContent = JSON.stringify(appJson, null, '\t')
                addFile(compilation, '../app.json', appJsonContent)

                if (isEmitProjectConfig) {
                    // project.config.json
                    const userProjectConfigJson = options.projectConfig || {}
                    // 这里需要深拷贝，不然数组相同引用指向一直 push
                    const projectConfigJson = JSON.parse(JSON.stringify(projectConfigJsonTmpl))
                    const projectConfigJsonContent = JSON.stringify(_.merge(projectConfigJson, userProjectConfigJson), null, '\t')
                    addFile(compilation, '../project.config.json', projectConfigJsonContent)
                }

                // sitemap.json
                const userSitemapConfigJson = options.sitemapConfig
                if (userSitemapConfigJson) {
                    const sitemapConfigJsonContent = JSON.stringify(userSitemapConfigJson, null, '\t')
                    addFile(compilation, '../sitemap.json', sitemapConfigJsonContent)
                }
            }

            // config js
            const router = {}
            if (options.router) {
                // 处理 router
                Object.keys(options.router).forEach(key => {
                    const pathObjList = []
                    let pathList = options.router[key]
                    pathList = Array.isArray(pathList) ? pathList : [pathList]

                    for (const pathItem of pathList) {
                        // 将每个 route 转成正则并进行序列化
                        if (!pathItem || typeof pathItem !== 'string') continue

                        const keys = []
                        const regexp = pathToRegexp(pathItem, keys)
                        const pattern = regexp.valueOf()

                        pathObjList.push({
                            regexp: pattern.source,
                            options: `${pattern.global ? 'g' : ''}${pattern.ignoreCase ? 'i' : ''}${pattern.multiline ? 'm' : ''}`,
                        })
                    }
                    router[key] = pathObjList
                })
            }
            const configJsContent = 'module.exports = ' + JSON.stringify({
                origin: options.origin || 'https://miniprogram.default',
                entry: options.entry || '/',
                router,
                runtime: Object.assign({
                    subpackagesMap,
                    tabBarMap,
                    usingComponents: wxCustomComponentConfig.usingComponents || {},
                }, options.runtime || {}),
                pages: pageConfigMap,
                redirect: options.redirect || {},
                optimization: options.optimization || {},
            }, null, '\t')
            addFile(compilation, '../config.js', configJsContent)

            // package.json
            const userPackageConfigJson = options.packageConfig || {}
            const packageConfigJson = Object.assign({}, packageConfigJsonTmpl)
            const packageConfigJsonContent = JSON.stringify(_.merge(packageConfigJson, userPackageConfigJson), null, '\t')
            addFile(compilation, '../package.json', packageConfigJsonContent)

            // node_modules
            addFile(compilation, '../node_modules/.miniprogram', '')

            // 自定义组件，生成到 miniprogram_npm 中
            if (wxCustomComponentRoot) {
                _.copyDir(wxCustomComponentRoot, path.resolve(outputPath, '../custom-component/components'))

                const realUsingComponents = {}
                const names = Object.keys(wxCustomComponents)
                names.forEach(key => realUsingComponents[key] = `components/${wxCustomComponents[key].path}`)

                // custom-component/index.js
                addFile(compilation, '../custom-component/index.js', customComponentJsTmpl)

                // custom-component/index.wxml
                addFile(compilation, '../custom-component/index.wxml', names.map((key, index) => {
                    const {props = [], events = []} = wxCustomComponents[key]
                    return `<${key} wx:${index === 0 ? 'if' : 'elif'}="{{name === '${key}'}}" id="{{id}}" class="{{class}}" style="{{style}}" ${props.map(name => name + '="{{' + name + '}}"').join(' ')} ${events.map(name => 'bind' + name + '="on' + name + '"').join(' ')}><slot/></${key}>`
                }).join('\n'))

                // custom-component/index.wxss
                addFile(compilation, '../custom-component/index.wxss', '')

                // custom-component/index.json
                addFile(compilation, '../custom-component/index.json', JSON.stringify({
                    component: true,
                    usingComponents: realUsingComponents,
                }, null, '\t'))
            }

            callback()
        })

        compiler.hooks.compilation.tap(PluginName, compilation => {
            // 处理头尾追加内容
            const globalVarsConfig = generateConfig.globalVars || []
            if (this.afterOptimizations) {
                compilation.hooks.afterOptimizeChunkAssets.tap(PluginName, chunks => {
                    wrapChunks(compilation, chunks, globalVarsConfig)
                })
            } else {
                compilation.hooks.optimizeChunkAssets.tapAsync(PluginName, (chunks, callback) => {
                    wrapChunks(compilation, chunks, globalVarsConfig)
                    callback()
                })
            }
        })

        const hasBuiltNpm = false
        compiler.hooks.done.tapAsync(PluginName, (stats, callback) => {
            // 处理自动安装小程序依赖
            const autoBuildNpm = generateConfig.autoBuildNpm || false
            const distDir = path.dirname(stats.compilation.outputOptions.path)

            if (hasBuiltNpm || !autoBuildNpm) return callback()

            const build = () => {
                ['miniprogram-element', 'miniprogram-render'].forEach(name => {
                    _.copyDir(path.resolve(distDir, `./node_modules/${name}/src`), path.resolve(distDir, `./miniprogram_npm/${name}`))
                })
                callback()
            }
            console.log(colors.bold('\nstart building dependencies...\n'))

            const command = autoBuildNpm === 'yarn' ? 'yarn' : 'npm'
            execa(command, ['install', '--production'], {cwd: distDir}).then(({exitCode}) => {
                if (!exitCode) {
                    console.log(colors.bold(`\nbuilt dependencies ${colors.green('successfully')}\n`))
                    build()
                } else {
                    console.log(colors.bold(`\nbuilt dependencies ${colors.red('failed')}, please enter "${colors.yellow(distDir)}" and run install manually\n`))
                }
            }).catch(() => {
                console.log(colors.bold(`\nbuilt dependencies ${colors.red('failed')}, please enter "${colors.yellow(distDir)}" and run install manually\n`))
            })

            callback()
        })
    }
}

module.exports = MpPlugin
