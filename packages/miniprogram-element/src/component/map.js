/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/map.html
 */

/**
 * 兼容开发者工具 bug
 */
function dealWithDevToolsEvt(evt) {
    if (!evt.detail) evt.detail = {}
    if (evt.markerId !== undefined) evt.detail.markerId = evt.markerId
    if (evt.controlId !== undefined) evt.detail.controlId = evt.controlId
    if (evt.name !== undefined) evt.detail.name = evt.name
    if (evt.longitude !== undefined) evt.detail.longitude = evt.longitude
    if (evt.latitude !== undefined) evt.detail.latitude = evt.latitude
}

/**
 * 兼容 react
 */
function dealWithReactAttr(value) {
    if (typeof value === 'string') {
        // react 会直接将属性值转成字符串
        try {
            value = JSON.parse(value)
        } catch (err) {
            value = undefined
        }
    }

    return value
}

module.exports = {
    properties: [{
        name: 'longitude',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('longitude'))
            return !isNaN(value) ? value : 39.92
        },
    }, {
        name: 'latitude',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('latitude'))
            return !isNaN(value) ? value : 116.46
        },
    }, {
        name: 'scale',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale'))
            return !isNaN(value) ? value : 16
        },
    }, {
        name: 'markers',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('markers'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'polyline',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('polyline'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'circles',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('circles'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'controls',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('controls'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'includePoints',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('include-points'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'showLocation',
        get(domNode) {
            return !!domNode.getAttribute('show-location')
        },
    }, {
        name: 'polygons',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('polygons'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'subkey',
        get(domNode) {
            return domNode.getAttribute('subkey') || ''
        },
    }, {
        name: 'layerStyle',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('layer-style'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'rotate',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('rotate') || 0
        },
    }, {
        name: 'skew',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('skew') || 0
        },
    }, {
        name: 'enable3D',
        get(domNode) {
            return !!domNode.getAttribute('enable-3D')
        },
    }, {
        name: 'showCompass',
        get(domNode) {
            return !!domNode.getAttribute('show-compass')
        },
    }, {
        name: 'enableOverlooking',
        get(domNode) {
            return !!domNode.getAttribute('enable-overlooking')
        },
    }, {
        name: 'enableZoom',
        get(domNode) {
            const value = domNode.getAttribute('enable-zoom')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableScroll',
        get(domNode) {
            const value = domNode.getAttribute('enable-scroll')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableRotate',
        get(domNode) {
            return !!domNode.getAttribute('enable-rotate')
        },
    }, {
        name: 'enableSatellite',
        get(domNode) {
            return !!domNode.getAttribute('enable-satellite')
        },
    }, {
        name: 'enableTraffic',
        get(domNode) {
            return !!domNode.getAttribute('enable-traffic')
        },
    }],
    handles: {
        onMapTap(evt) {
            this.callSingleEvent('tap', evt)
        },

        onMapMarkerTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('markertap', evt)
        },

        onMapLabelTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('labeltap', evt)
        },

        onMapControlTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('controltap', evt)
        },

        onMapCalloutTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('callouttap', evt)
        },

        onMapUpdated(evt) {
            this.callSingleEvent('updated', evt)
        },

        onMapRegionChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            if (!evt.detail.causedBy) evt.detail.causedBy = evt.causedBy
            if (evt.type === 'end' || evt.detail.type === 'end') {
                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                // 以下三项官方未支持
                // domNode._oldValues.longitude = evt.detail.longitude
                // domNode._oldValues.latitude = evt.detail.latitude
                // domNode._oldValues.scale = evt.detail.scale
                domNode._oldValues.rotate = evt.detail.rotate
                domNode._oldValues.skew = evt.detail.skew
            }

            this.callSingleEvent('regionchange', evt)
        },

        onMapPoiTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('poitap', evt)
        },

    },
}
