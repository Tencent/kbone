/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html
 */
module.exports = {
    properties: [{
        name: 'direction',
        get(domNode) {
            return domNode.getAttribute('direction') || 'none'
        },
    }, {
        name: 'inertia',
        get(domNode) {
            return !!domNode.getAttribute('inertia')
        },
    }, {
        name: 'outOfBounds',
        get(domNode) {
            return !!domNode.getAttribute('out-of-bounds')
        },
    }, {
        name: 'x',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('x') || 0
        },
    }, {
        name: 'y',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('y') || 0
        },
    }, {
        name: 'damping',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('damping'))
            return !isNaN(value) ? value : 20
        },
    }, {
        name: 'friction',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('friction'))
            return !isNaN(value) ? value : 2
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'scale',
        get(domNode) {
            return !!domNode.getAttribute('scale')
        },
    }, {
        name: 'scaleMin',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-min'))
            return !isNaN(value) ? value : 0.5
        },
    }, {
        name: 'scaleMax',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-max'))
            return !isNaN(value) ? value : 10
        },
    }, {
        name: 'scaleValue',
        canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-value'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'animation',
        get(domNode) {
            const value = domNode.getAttribute('animation')
            return value !== undefined ? !!value : true
        },
    }],
    handles: {
        onMovableViewChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('x', evt.detail.x)
            domNode.$$setAttributeWithoutUpdate('y', evt.detail.y)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.x = evt.detail.x
            domNode._oldValues.y = evt.detail.y

            this.callSingleEvent('change', evt)
        },

        onMovableViewScale(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('x', evt.detail.x)
            domNode.$$setAttributeWithoutUpdate('y', evt.detail.y)
            domNode.$$setAttributeWithoutUpdate('scale-value', evt.detail.scale)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.x = evt.detail.x
            domNode._oldValues.y = evt.detail.y
            domNode._oldValues.scaleValue = evt.detail.scale

            this.callSingleEvent('scale', evt)
        },

        onMovableViewHtouchmove(evt) {
            this.callSingleEvent('htouchmove', evt)
        },

        onMovableViewVtouchmove(evt) {
            this.callSingleEvent('vtouchmove', evt)
        },
    },
}
