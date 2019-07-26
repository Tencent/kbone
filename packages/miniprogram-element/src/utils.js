const initData = require('./init-data')

const ELEMENT_DIFF_KEYS = ['nodeId', 'pageId', 'tagName', 'compName', 'id', 'class', 'style', 'isLeaf', 'isSimple', 'content']
const TEXT_NODE_DIFF_KEYS = ['nodeId', 'pageId', 'content']
const NOT_RENDER_CHILDREN_NODE = ['IFRAME', 'CANVAS', 'IMG', 'INPUT', 'VIDEO', 'WX-COMPONENT'] // 无需渲染子节点的节点，WX-COMPONENT 的子节点要特殊渲染
const NEET_RENDER_TO_CUSTOM_ELEMENT = ['IFRAME', 'IMG', 'INPUT', 'VIDEO', 'WX-COMPONENT'] // 必须渲染成自定义组件的节点

/**
 * 过滤子节点，只获取儿子节点
 */
function filterNodes(domNode, level) {
    const childNodes = domNode.childNodes || []

    if (!childNodes.map) return []
    if (NOT_RENDER_CHILDREN_NODE.indexOf(domNode.tagName) >= 0) return []

    return childNodes.map(child => {
        const domInfo = child.$$domInfo

        if (domInfo.type !== 'element' && domInfo.type !== 'text') return

        domInfo.class = `h5-${domInfo.tagName} node-${domInfo.nodeId} ${domInfo.class || ''}` // 增加默认 class
        domInfo.domNode = child

        // 特殊节点不需要处理样式
        if (child.tagName === 'WX-COMPONENT') {
            domInfo.class = `h5-${domInfo.tagName} node-${domInfo.nodeId}`
            domInfo.style = ''
        }

        // 判断叶子节点
        domInfo.isLeaf = domInfo.type === 'element' && !child.children.length && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName.toUpperCase()) === -1
        if (domInfo.isLeaf) {
            domInfo.content = child.childNodes.map(childNode => (childNode.$$domInfo.type === 'text' ? childNode.textContent : '')).join('')
        }

        // 判断可直接用 view 渲染的简单子节点
        domInfo.isSimple = !domInfo.isLeaf && domInfo.type === 'element' && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName.toUpperCase()) === -1 && level > 0
        if (domInfo.isSimple) {
            domInfo.content = ''
            domInfo.childNodes = filterNodes(child, level - 1)
        }

        return domInfo
    }).filter(child => !!child)
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
            if (newChild[key] !== oldChild[key]) return true
        }

        // 比较孙子后辈节点
        const newGrandChildNodes = newChild.childNodes || []
        const oldGrandChildNodes = oldChild.childNodes || []
        if (newGrandChildNodes.length || oldGrandChildNodes.length) {
            const checkRes = checkDiffChildNodes(newGrandChildNodes, oldGrandChildNodes)
            if (checkRes) return true
        }
    }

    return false
}

/**
 * 检查字段是否更新
 */
function checkAttrUpdate(oldData, newData, destData, attrs) {
    for (const attr of attrs) {
        if (oldData[attr] !== newData[attr]) destData[attr] = newData[attr]
    }
}

/**
 * 检查组件属性
 */
function checkComponentAttr(name, domNode, destData, oldData) {
    const attrs = initData[name]

    destData.wxCompName = name

    if (attrs && attrs.length) {
        for (const {name, get} of attrs) {
            const newValue = get(domNode)
            if (!oldData || (oldData && oldData[name] !== newValue)) destData[name] = newValue
        }
    }
}

/**
 * 处理不需要渲染成自定义组件的节点
 */
function dealWithLeafAndSimple(childNodes, onChildNodesUpdate) {
    if (childNodes && childNodes.length) {
        childNodes = childNodes.map(originChildNode => {
            const childNode = Object.assign({}, originChildNode)

            if (childNode.isLeaf || childNode.isSimple) {
                childNode.domNode.$$clearEvent('$$childNodesUpdate')
                childNode.domNode.addEventListener('$$childNodesUpdate', onChildNodesUpdate)
            }

            delete childNode.domNode
            childNode.childNodes = dealWithLeafAndSimple(childNode.childNodes, onChildNodesUpdate)

            return childNode
        })
    }

    return childNodes
}

module.exports = {
    filterNodes,
    checkDiffChildNodes,
    checkAttrUpdate,
    checkComponentAttr,
    dealWithLeafAndSimple,
}
