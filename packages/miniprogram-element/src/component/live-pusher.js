const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html
 */
module.exports = {
    properties: [{
        name: 'url',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            const url = domNode.getAttribute('url')
            return url ? tool.completeURL(url, window.location.origin, true) : ''
        },
    }, {
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'RTC'
        },
    }, {
        name: 'autopush',
        get(domNode) {
            return !!domNode.getAttribute('autopush')
        },
    }, {
        name: 'muted',
        get(domNode) {
            return !!domNode.getAttribute('muted')
        },
    }, {
        name: 'enableCamera',
        get(domNode) {
            const value = domNode.getAttribute('enable-camera')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'autoFocus',
        get(domNode) {
            const value = domNode.getAttribute('auto-focus')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'orientation',
        get(domNode) {
            return domNode.getAttribute('orientation') || 'vertical'
        },
    }, {
        name: 'beauty',
        get(domNode) {
            return +domNode.getAttribute('beauty') || 0
        },
    }, {
        name: 'whiteness',
        get(domNode) {
            return +domNode.getAttribute('whiteness') || 0
        },
    }, {
        name: 'aspect',
        get(domNode) {
            return domNode.getAttribute('aspect') || '9:16'
        },
    }, {
        name: 'minBitrate',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('min-bitrate'))
            return !isNaN(value) ? value : 200
        },
    }, {
        name: 'maxBitrate',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('max-bitrate'))
            return !isNaN(value) ? value : 1000
        },
    }, {
        name: 'waitingImage',
        get(domNode) {
            return domNode.getAttribute('waiting-image') || ''
        },
    }, {
        name: 'waitingImageHash',
        get(domNode) {
            return domNode.getAttribute('waiting-image-hash') || ''
        },
    }, {
        name: 'zoom',
        get(domNode) {
            return !!domNode.getAttribute('zoom')
        },
    }, {
        name: 'devicePosition',
        get(domNode) {
            return domNode.getAttribute('device-position') || 'front'
        },
    }, {
        name: 'backgroundMute',
        get(domNode) {
            return !!domNode.getAttribute('background-mute')
        },
    }, {
        name: 'mirror',
        get(domNode) {
            return !!domNode.getAttribute('mirror')
        },
    }, {
        name: 'remoteMirror',
        get(domNode) {
            return !!domNode.getAttribute('remote-mirror')
        },
    }, {
        name: 'localMirror',
        get(domNode) {
            return domNode.getAttribute('local-mirror') || 'auto'
        },
    }, {
        name: 'audioReverbType',
        get(domNode) {
            return +domNode.getAttribute('audio-reverb-type') || 0
        },
    }, {
        name: 'enableMic',
        get(domNode) {
            const value = domNode.getAttribute('enable-mic')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableAgc',
        get(domNode) {
            return !!domNode.getAttribute('enable-agc')
        },
    }, {
        name: 'enableAns',
        get(domNode) {
            return !!domNode.getAttribute('enable-ans')
        },
    }, {
        name: 'audioVolumeType',
        get(domNode) {
            return domNode.getAttribute('audio-volume-type') || 'voicecall'
        },
    }, {
        name: 'videoWidth',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('video-width'))
            return !isNaN(value) ? value : 360
        },
    }, {
        name: 'videoHeight',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('video-height'))
            return !isNaN(value) ? value : 640
        },
    }],
    handles: {
        onLivePusherStateChange(evt) {
            this.callSingleEvent('statechange', evt)
        },

        onLivePusherNetStatus(evt) {
            this.callSingleEvent('netstatus', evt)
        },

        onLivePusherError(evt) {
            this.callSingleEvent('error', evt)
        },

        onLivePusherBgmStart(evt) {
            this.callSingleEvent('bgmstart', evt)
        },

        onLivePusherBgmProgress(evt) {
            this.callSingleEvent('bgmprogress', evt)
        },

        onLivePusherBgmComplete(evt) {
            this.callSingleEvent('bgmcomplete', evt)
        },

    },
}
