const mp = require('miniprogram-render')
const initData = require('./init-data')
const component = require('./component')

const {
    cache,
    tool,
} = mp.$$adapter

const {
    wxCompNameMap,
    wxSubComponentMap,
} = component

const ELEMENT_DIFF_KEYS = [
    'nodeId', 'pageId', 'id', 'className', 'style', // 通用字段
    'isImage', 'src', 'mode', 'webp', 'lazyLoad', 'showMenuByLongpress', // image
    'useTemplate', 'extra', 'compName', // template 渲染
    'isLeaf', 'content', // leaf
    'isSimple' // 普通节点
]
const TEXT_NODE_DIFF_KEYS = ['nodeId', 'pageId', 'content']
const NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT = ['WX-COMPONENT', 'WX-CUSTOM-COMPONENT'] // 需要分离 class 和 style 的节点
const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT = ['swiper', 'movable-area', 'picker-view']
const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT = ['swiper-item', 'movable-view', 'picker-view-column']
const NEET_RENDER_TO_CUSTOM_ELEMENT = ['IFRAME', ...NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT] // 必须渲染成自定义组件的节点
const USE_TEMPLATE = ['cover-image', 'movable-area', 'movable-view', 'swiper', 'swiper-item', 'icon', 'progress', 'rich-text', 'text', 'button', 'editor', 'form', 'INPUT', 'picker', 'SELECT', 'picker-view', 'picker-view-column', 'slider', 'switch', 'TEXTAREA', 'navigator', 'camera', 'image', 'live-player', 'live-pusher', 'VIDEO', 'map', 'CANVAS', 'ad', 'official-account', 'open-data', 'web-view', 'capture', 'catch', 'animation', 'not-support'] // 使用 template 渲染
const IN_COVER = ['cover-view'] // 子节点必须使用 cover-view/cover-image

/**
 * 过滤子节点，只获取儿子节点
 */
function filterNodes(domNode, level, component) {
    const window = cache.getWindow(domNode.$$pageId)
    let childNodes = domNode.childNodes || []

    if (typeof childNodes.map !== 'function') return []

    if (domNode.tagName === 'SELECT') {
        // select 标签只渲染和 select 值相同的 option
        const index = childNodes.findIndex(childNode => childNode.value === domNode.value)
        childNodes = index !== -1 ? [childNodes[index]] : []
    }

    return childNodes.map(child => {
        const domInfo = child.$$domInfo

        if (domInfo.type !== 'element' && domInfo.type !== 'text') return

        domInfo.className = domInfo.type === 'element' ? `h5-${domInfo.tagName} node-${domInfo.nodeId} ${domInfo.className || ''}` : '' // 增加默认 class
        domInfo.domNode = child

        // 特殊节点
        if (NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT.indexOf(child.tagName) >= 0) {
            if (domInfo.tagName === 'wx-component' && NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT.indexOf(child.behavior) !== -1) {
                // 特殊内置组件，强制作为某内置组件的子组件，需要直接在当前模板渲染
                domInfo.compName = child.behavior
                domInfo.extra = {
                    hidden: child.getAttribute('hidden') || false,
                }

                // 补充该内置组件的属性
                const {properties} = wxSubComponentMap[child.behavior] || {}
                if (properties && properties.length) {
                    properties.forEach(({name, get}) => {
                        domInfo.extra[name] = get(child)
                    })
                }

                if (child.childNodes.length && level > 0) {
                    domInfo.childNodes = filterNodes(child, level - 1, component)
                }
                return domInfo
            }

            // 不需要处理 id 和样式
            domInfo.className = `h5-${domInfo.tagName} ${domInfo.tagName === 'wx-component' ? 'wx-' + child.behavior : ''}`
            domInfo.id = ''
            domInfo.style = ''
        }

        // 判断图片节点
        domInfo.isImage = domInfo.type === 'element' && domInfo.tagName === 'img'
        if (domInfo.isImage) {
            domInfo.src = child.src ? tool.completeURL(child.src, window.location.origin, true) : ''
            domInfo.mode = child.getAttribute('mode') || ''
            domInfo.webp = !!child.getAttribute('webp')
            domInfo.lazyLoad = !!child.getAttribute('lazy-load')
            domInfo.showMenuByLongpress = !!child.getAttribute('show-menu-by-longpress')
        }

        // 判断是否使用 template 渲染
        let templateName = domInfo.tagName === 'wx-component' ? child.behavior : child.tagName
        templateName = !mp.$$adapter.tool.isTagNameSupport(templateName) ? 'not-support' : templateName
        domInfo.useTemplate = !domInfo.isImage && USE_TEMPLATE.indexOf(templateName) !== -1
        if (domInfo.useTemplate) {
            const wxCompName = wxCompNameMap[templateName]
            const extra = {}

            if (wxCompName) checkComponentAttr(wxCompName, child, extra, null, `h5-${domInfo.tagName} ${domInfo.tagName === 'wx-component' ? 'wx-' + child.behavior : ''}`)

            extra.pageId = domInfo.pageId
            extra.nodeId = domInfo.nodeId
            extra.inCover = component.data.inCover
            extra.hasChildren = !!child.childNodes.length
            domInfo.extra = extra

            // 给 template 中的特殊节点用
            if (NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT.indexOf(templateName) !== -1) {
                const childNodes = filterNodes(child, 0) || []
                extra.childNodes = childNodes.map(childNode => {
                    const copyChildNode = Object.assign({}, childNode)
                    delete copyChildNode.domNode
                    return copyChildNode
                })
            }

            // wx-catch 的 touch 事件会导致 tap 事件的触发，需要真正被绑定后再补充句柄
            if (wxCompName === 'catch') {
                extra.touchStart = child.$$hasEventHandler('touchstart') ? 'onTouchStart' : ''
                extra.touchMove = child.$$hasEventHandler('touchmove') ? 'onTouchMove' : ''
                extra.touchEnd = child.$$hasEventHandler('touchend') ? 'onTouchEnd' : ''
                extra.touchCancel = child.$$hasEventHandler('touchcancel') ? 'onTouchCancel' : ''
            }

            // text 组件存在 bug，其子节点无法使用自定义组件的方式来渲染，会存在无法更新的问题，需要基础库解决，故此处只渲染其文本内容
            if (wxCompName === 'text') {
                extra.content = child.textContent
            }

            // 不支持的节点，展示占位文本
            if (wxCompName === 'not-support') {
                extra.content = child.textContent
            }
        }

        // 判断叶子节点
        domInfo.isLeaf = !domInfo.isImage && !domInfo.useTemplate && domInfo.type === 'element' && !child.children.length && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName) === -1
        if (domInfo.isLeaf) {
            domInfo.content = child.childNodes.map(childNode => (childNode.$$domInfo.type === 'text' ? childNode.textContent : '')).join('')
        }

        // 判断可直接用 view 渲染的简单子节点
        domInfo.isSimple = !domInfo.isImage && !domInfo.useTemplate && !domInfo.isLeaf && domInfo.type === 'element' && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName) === -1 && level > 0
        if (domInfo.isSimple) {
            domInfo.content = ''
            domInfo.childNodes = filterNodes(child, level - 1, component)
        }

        // 挂载该节点所处的自定义组件实例
        child._wxComponent = component

        return domInfo
    }).filter(child => !!child)
}

/**
 * 判断两值是否相等
 */
function isEqual(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        // 值为数值，需要考虑精度
        return parseInt(a * 1000, 10) === parseInt(b * 1000, 10)
    }

    return a === b
}

/**
 * 比较新旧子节点是否不同
 */
function checkDiffChildNodes(newChildNodes, oldChildNodes) {
    if (newChildNodes.length !== oldChildNodes.length) return true

    for (let i = 0, len = newChildNodes.length; i < len; i++) {
        const newChild = newChildNodes[i]
        const oldChild = oldChildNodes[i]

        if (newChild.type !== oldChild.type) return true

        const keys = newChild.type === 'element' ? ELEMENT_DIFF_KEYS : TEXT_NODE_DIFF_KEYS

        for (const key of keys) {
            const newValue = newChild[key]
            const oldValue = oldChild[key]
            if (typeof newValue === 'object' && !Array.isArray(newValue)) {
                // 值为对象，则判断对象顶层值是否有变化
                if (typeof oldValue !== 'object') return true

                // 需要强制更新
                if (key === 'extra' && newValue.forceUpdate) {
                    newValue.forceUpdate = false
                    return true
                }

                const objectKeys = Object.keys(newValue)
                for (const objectKey of objectKeys) {
                    if (!isEqual(newValue[objectKey], oldValue[objectKey])) return true
                }
            } else if (!isEqual(newValue, oldValue)) {
                return true
            }
        }

        // 比较孙子后辈节点
        const newGrandChildNodes = newChild.childNodes || []
        const oldGrandChildNodes = oldChild.childNodes || []
        if (newGrandChildNodes.length || oldGrandChildNodes.length) {
            if (checkDiffChildNodes(newGrandChildNodes, oldGrandChildNodes)) return true
        }
    }

    return false
}

/**
 * 检查组件属性
 */
function checkComponentAttr(name, domNode, destData, oldData, extraClass = '') {
    const attrs = initData[name]

    destData.wxCompName = name

    if (attrs && attrs.length) {
        for (const {name, get, canBeUserChanged = false} of attrs) {
            const newValue = get(domNode)
            if (canBeUserChanged) {
                // 可被用户行为改变的属性，除了 data 外，还需要对比监听到上次用户行为修改的值
                const oldValues = domNode._oldValues
                const isOldValuesChanged = oldValues ? !isEqual(newValue, oldValues[name]) : false
                if (!oldData || !isEqual(newValue, oldData[name]) || isOldValuesChanged) {
                    destData[name] = newValue
                    if (isOldValuesChanged) destData.forceUpdate = true // 避免被 diff 掉，需要强制更新
                }
            } else if (!oldData || !isEqual(newValue, oldData[name])) {
                // 对比 data
                destData[name] = newValue
            }
        }
    }

    // 补充 id、class、style 和 hidden
    const newId = domNode.id
    if (!oldData || oldData.id !== newId) destData.id = newId
    const newClass = `${extraClass} wx-comp-${name} node-${domNode.$$nodeId} ${domNode.className || ''}`
    if (!oldData || oldData.className !== newClass) destData.className = newClass
    const newStyle = domNode.style.cssText
    if (!oldData || oldData.style !== newStyle) destData.style = newStyle
    const newHidden = domNode.getAttribute('hidden') || false
    if (!oldData || oldData.hidden !== newHidden) destData.hidden = newHidden
}

/**
 * 处理不需要渲染成自定义组件的节点
 */
function dealWithLeafAndSimple(childNodes, onChildNodesUpdate) {
    if (childNodes && childNodes.length) {
        childNodes = childNodes.map(originChildNode => {
            const childNode = Object.assign({}, originChildNode)

            childNode.domNode.$$clearEvent('$$childNodesUpdate', {$$namespace: 'child'})
            if (childNode.isImage || childNode.isLeaf || childNode.isSimple || childNode.useTemplate) {
                childNode.domNode.addEventListener('$$childNodesUpdate', onChildNodesUpdate, {$$namespace: 'child'})
            }

            delete childNode.domNode
            childNode.childNodes = dealWithLeafAndSimple(childNode.childNodes, onChildNodesUpdate)

            return childNode
        })
    }

    return childNodes
}

/**
 * 检查事件是否经过某个节点
 */
function checkEventAccessDomNode(evt, domNode, dest) {
    dest = dest || domNode.ownerDocument.body
    let target = evt.target

    // 该节点就是目标节点
    if (domNode === dest) return true

    while (target && target !== dest) {
        if (target === domNode) return true
        target = target.parentNode
    }

    return false
}

/**
 * 查找最近的符合条件的祖先节点
 */
function findParentNode(domNode, tagName) {
    const checkParentNode = (parentNode, tagName) => {
        if (!parentNode) return false
        if (parentNode.tagName === tagName) return true
        if (parentNode.tagName === 'WX-COMPONENT' && parentNode.behavior === tagName.toLowerCase()) return true

        return false
    }
    let parentNode = domNode.parentNode

    if (checkParentNode(parentNode, tagName)) return parentNode
    while (parentNode && parentNode.tagName !== tagName) {
        parentNode = parentNode.parentNode
        if (checkParentNode(parentNode, tagName)) return parentNode
    }

    return null
}

/**
 * 判断基础库版本
 */
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i], 10)
        const num2 = parseInt(v2[i], 10)

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

module.exports = {
    USE_TEMPLATE,
    IN_COVER,
    filterNodes,
    checkDiffChildNodes,
    checkComponentAttr,
    dealWithLeafAndSimple,
    checkEventAccessDomNode,
    findParentNode,
    compareVersion,
}
