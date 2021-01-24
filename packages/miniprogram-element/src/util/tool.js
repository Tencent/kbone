const mp = require('miniprogram-render')
const component = require('./component')

const {
    cache,
    tool,
} = mp.$$adapter

const {
    wxCompData,
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
const RELATION_PARENT = ['swiper', 'movable-area', 'picker-view']
const RELATION_CHILD = ['swiper-item', 'movable-view', 'picker-view-column']
const NEET_RENDER_TO_CUSTOM_ELEMENT = ['IFRAME', ...NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT] // 必须渲染成自定义组件的节点
const USE_TEMPLATE = ['cover-image', 'cover-view', 'match-media', 'movable-area', 'movable-view', 'scroll-view', 'swiper', 'swiper-item', 'icon', 'progress', 'rich-text', 'text', 'button', 'editor', 'form', 'INPUT', 'picker', 'SELECT', 'picker-view', 'picker-view-column', 'slider', 'switch', 'TEXTAREA', 'navigator', 'camera', 'image', 'live-player', 'live-pusher', 'VIDEO', 'voip-room', 'map', 'CANVAS', 'ad', 'ad-custom', 'official-account', 'open-data', 'web-view', 'capture', 'catch', 'animation', 'not-support', 'WX-CUSTOM-COMPONENT'] // 使用 template 渲染

const hasOwnProperty = Object.prototype.hasOwnProperty

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
        if (domInfo.slot) return

        // 挂载该节点所处的自定义组件实例
        child._wxComponent = component

        domInfo.className = domInfo.type === 'element' ? `h5-${domInfo.tagName} node-${domInfo.nodeId} ${domInfo.className || ''}` : '' // 增加默认 class
        domInfo.domNode = child

        // 特殊节点
        if (NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT.indexOf(child.tagName) >= 0) {
            if (domInfo.tagName === 'wx-component' && RELATION_CHILD.indexOf(child.behavior) !== -1) {
                // 特殊内置组件，强制作为某内置组件的子组件，需要直接在当前模板渲染
                domInfo.compName = child.behavior
                domInfo.extra = {hidden: child.getAttribute('hidden') || false}

                // 补充该内置组件的属性
                const {properties} = wxSubComponentMap[child.behavior] || {}
                if (properties && properties.length) {
                    properties.forEach(({name, get, canBeUserChanged = false}) => {
                        const newValue = get(child)
                        domInfo.extra[name] = newValue

                        if (canBeUserChanged) {
                            // 可被用户行为改变的属性，除了 data 外，还需要对比监听到上次用户行为修改的值
                            const oldValues = child._oldValues
                            if (oldValues && !isEqual(newValue, oldValues[name], true)) domInfo.extra.forceUpdate = true // 避免被 diff 掉，需要强制更新
                        }
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
            const relationIndex = RELATION_PARENT.indexOf(templateName)
            if (relationIndex !== -1) {
                const childNodes = (templateName === 'picker-view' ? filterNodes(child, 1) : filterNodes(child, 0)) || []
                extra.childNodes = childNodes.filter(childNode => childNode.type === 'element' && childNode.compName === RELATION_CHILD[relationIndex]).map(childNode => {
                    const copyChildNode = Object.assign({}, childNode)

                    // picker-view-column 不支持监听自定义组件内子节点的变化，所以需要在当前自定义组件中渲染
                    if (copyChildNode.childNodes) {
                        // picker-view-column 的第一层子节点无法设置 style，不然会覆盖内置组件自己的样式
                        copyChildNode.childNodes = copyChildNode.childNodes.map(grandchild => Object.assign({}, grandchild, {style: ''}))
                    }

                    return copyChildNode
                })
            }

            // 地图如果存在 slot 节点，需要特殊处理
            if (templateName === 'map' || templateName === 'scroll-view') {
                const slots = child.childNodes.map(childNode => {
                    const slotDomInfo = childNode.$$domInfo
                    return {
                        slot: slotDomInfo.slot,
                        nodeId: slotDomInfo.nodeId,
                        pageId: slotDomInfo.pageId,
                        id: slotDomInfo.id,
                        className: slotDomInfo.type === 'element' ? `h5-${slotDomInfo.tagName} node-${slotDomInfo.nodeId} ${slotDomInfo.className || ''}` : '',
                        style: slotDomInfo.style,
                    }
                }).filter(slot => !!slot.slot)

                extra.hasSlots = slots.length
                extra.hasChildren = slots.length < child.childNodes.length
                extra.slots = slots
            }

            // wx-catch 的 touch 事件会导致 tap 事件的触发，需要真正被绑定后再补充句柄
            if (wxCompName === 'catch') {
                extra.touchStart = child.$$hasEventHandler('touchstart') ? 'onTouchStart' : ''
                extra.touchMove = child.$$hasEventHandler('touchmove') ? 'onTouchMove' : ''
                extra.touchEnd = child.$$hasEventHandler('touchend') ? 'onTouchEnd' : ''
                extra.touchCancel = child.$$hasEventHandler('touchcancel') ? 'onTouchCancel' : ''
            }

            // 1. text 组件存在 bug，其子节点无法使用自定义组件的方式来渲染，会存在无法更新的问题，需要基础库解决，故此处只渲染其文本内容
            // 2. 不支持的节点，需要展示占位文本
            if (wxCompName === 'text' || wxCompName === 'not-support') extra.content = child.textContent

            // 第三方自定义组件
            if (templateName === 'WX-CUSTOM-COMPONENT') {
                extra.wxCompName = 'custom-component'
                extra.wxCustomCompName = child.behavior
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

        return domInfo
    }).filter(child => !!child)
}

/**
 * 判断两值是否相等
 */
function isEqual(a, b, notStrict) {
    if (typeof a === 'number' && typeof b === 'number') {
        // 值为数值，需要考虑精度
        return parseInt(a * 1000, 10) === parseInt(b * 1000, 10)
    }

    if (notStrict) {
        // 非严格模式，当其中一方为 undefined，则直接判断另一方的真值
        if (b === undefined) return !a
        if (a === undefined) return !b
    }

    if (typeof a === 'object' && typeof b === 'object') {
        if (a === null || b === null) return a === b

        const isAArray = Array.isArray(a)
        const isBArray = Array.isArray(b)
        if (isAArray && isBArray) {
            if (a.length !== b.length) return false
            for (let i = 0, len = a.length; i < len; i++) {
                if (!isEqual(a[i], b[i], notStrict)) return false
            }
            return true
        } else if (!isBArray && !isBArray) {
            const aKeys = Object.keys(a)
            const bKeys = Object.keys(b)
            if (aKeys.length !== bKeys.length) return false
            for (const key of aKeys) {
                if (!isEqual(a[key], b[key], notStrict)) return false
            }
            return true
        }
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
                if (key === 'extra' && newValue && newValue.forceUpdate) {
                    newValue.forceUpdate = false
                    return true
                }

                const objectKeys = Object.keys(newValue)
                const domNode = key === 'extra' ? newChild.domNode : null
                const oldValues = domNode && domNode._oldValues
                for (const objectKey of objectKeys) {
                    let oldItemValue = oldValue[objectKey]

                    if (oldValues && oldValues[objectKey] !== undefined) oldItemValue = oldValues[objectKey]
                    if (!isEqual(newValue[objectKey], oldItemValue)) return true
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
 * 获取新旧子节点的更新数据
 */
function getDiffChildNodes(newItem, oldItem, destData, prefix, isExtra, domNode) {
    const newType = typeof newItem
    const oldType = typeof oldItem
    const countLimit = 100

    if (newType === 'object' && oldType === 'object' && newItem !== null && oldItem !== null) {
        const newIsArray = Array.isArray(newItem)
        const oldIsArray = Array.isArray(oldItem)

        if (newIsArray && oldIsArray) {
            // 数组
            if (newItem.length < oldItem.length) {
                // 存在数据删除，无法应用 data path
                destData[prefix] = newItem
                if ((destData.count++) > countLimit) return true
            } else {
                for (let i = 0, len = newItem.length; i < len; i++) {
                    const isInterrupt = getDiffChildNodes(newItem[i], oldItem[i], destData, `${prefix}[${i}]`)
                    if (isInterrupt) return true
                }
            }
        } else if (!newIsArray && !oldIsArray) {
            // 对象
            const newItemType = newItem.type
            const oldItemType = oldItem.type
            const keys = newItemType === 'element' ? ['childNodes'].concat(ELEMENT_DIFF_KEYS) : TEXT_NODE_DIFF_KEYS
            const newIsNode = !isExtra && (newItemType === 'element' || newItemType === 'text')
            const oldIsNode = !isExtra && (newItemType === 'element' || newItemType === 'text')

            if (newIsNode && oldIsNode && newItemType === oldItemType) {
                // 都是 element 节点，或者都是 text 节点
                for (const key of keys) {
                    const dataPath = `${prefix}.${key}`
                    const currentDomNode = key === 'extra' ? cache.getNode(newItem.pageId, newItem.nodeId) : null
                    const isInterrupt = getDiffChildNodes(newItem[key], oldItem[key], destData, dataPath, key === 'extra', currentDomNode)
                    if (isInterrupt) return true
                }
            } else if (!newIsNode && !oldIsNode) {
                // 普通对象
                if (isExtra && newItem.forceUpdate) {
                    // 需要强制更新的 extra 对象
                    newItem.forceUpdate = false
                    destData[prefix] = newItem
                    if ((destData.count++) > countLimit) return true
                } else {
                    const newKeys = Object.keys(newItem)
                    for (const key of newKeys) {
                        const dataPath = `${prefix}.${key}`
                        if (!hasOwnProperty.call(oldItem, key)) {
                            // 新增的 key
                            destData[dataPath] = newItem[key]
                            if ((destData.count++) > countLimit) return true
                        } else {
                            let oldItemValue = oldItem[key]

                            // 部分属性可能被手动修改，但是不会即时更新到 data 上，需要通过 _oldValues 判断
                            if (domNode && domNode._oldValues && domNode._oldValues[key] !== undefined) oldItemValue = domNode._oldValues[key]

                            const isInterrupt = getDiffChildNodes(newItem[key], oldItemValue, destData, dataPath)
                            if (isInterrupt) return true
                        }
                    }

                    const oldKeys = Object.keys(oldItem)
                    for (const key of oldKeys) {
                        const dataPath = `${prefix}.${key}`
                        if (!hasOwnProperty.call(newItem, key)) {
                            // 删除的 key
                            destData[dataPath] = null
                            if ((destData.count++) > countLimit) return true
                        }
                    }
                }
            } else {
                // 节点类型不同
                destData[prefix] = newItem
                if ((destData.count++) > countLimit) return true
            }
        } else {
            // 类型不同
            destData[prefix] = newItem
            if ((destData.count++) > countLimit) return true
        }
    } else if (!isEqual(newItem, oldItem)) {
        // 值不等
        newItem = newType === 'undefined' ? null : newItem
        destData[prefix] = newItem
        if ((destData.count++) > countLimit) return true
    }
}

/**
 * 检查组件属性
 */
function checkComponentAttr(name, domNode, destData, oldData, extraClass = '') {
    const attrs = wxCompData[name]

    destData.wxCompName = name

    if (attrs && attrs.length) {
        for (const {name, get, canBeUserChanged = false} of attrs) {
            const newValue = get(domNode)
            if (canBeUserChanged) {
                // 可被用户行为改变的属性，除了 data 外，还需要对比监听到上次用户行为修改的值
                const oldValues = domNode._oldValues
                const isOldValuesChanged = oldValues ? !isEqual(newValue, oldValues[name], true) : false
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
            childNode.childNodes = dealWithLeafAndSimple(childNode.childNodes, onChildNodesUpdate) || []
            if (childNode.extra && childNode.extra.childNodes) {
                // picker-view、movable-area、swiper 会有子节点挂在 extra.childNodes 中
                childNode.extra.childNodes = dealWithLeafAndSimple(childNode.extra.childNodes, onChildNodesUpdate) || []
            }

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

/**
 * setData 封装
 */
function setData(instance, data) {
    if (tool.setData) tool.setData(instance, data)
    else instance.setData(data)
}

module.exports = {
    USE_TEMPLATE,
    filterNodes,
    checkDiffChildNodes,
    getDiffChildNodes,
    checkComponentAttr,
    dealWithLeafAndSimple,
    checkEventAccessDomNode,
    findParentNode,
    compareVersion,
    setData,
}
