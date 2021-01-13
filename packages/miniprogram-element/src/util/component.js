const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

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
function dealWithObjectString(value) {
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

/**
 * 处理布尔值
 */
function dealWithBoolValue(domNode, attrName, defaultIsTrue) {
    const value = domNode.getAttribute(attrName)
    if (value === 'false') return false
    if (defaultIsTrue && value === undefined) return true
    return !!value
}

/**
 * 处理数值
 */
function dealWithNumber(domNode, attrName, defaultValue) {
    const value = parseFloat(domNode.getAttribute(attrName))
    return !isNaN(value) ? value : defaultValue
}

/**
 * 兼容 canvas 相关 touch 事件，基础库没有提供 currentTarget 的问题
 */
function dealWithEvt(evt) {
    if (!evt.currentTarget || !evt.currentTarget.dataset.privateNodeId) {
        // 取 target
        evt.currentTarget = evt.currentTarget || {dataset: {}}
        evt.currentTarget.dataset.privateNodeId = evt.target.dataset.privateNodeId
    }
}

const wxComponentMap = {
    // 视图容器
    'cover-image': {
        wxCompName: 'cover-image',
        properties: [{
            name: 'src',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
            },
        }],
        handles: {
            onCoverImageLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onCoverImageError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    'cover-view': {
        wxCompName: 'cover-view',
        properties: [{
            name: 'scrollTop',
            get(domNode) {
                return domNode.getAttribute('scroll-top')
            },
        }, {
            // 是否需要强行开启 inCover
            name: 'forceInCover',
            get(domNode) {
                // 地图自定义 callout
                return domNode.getAttribute('marker-id') !== undefined
            },
        }, {
            // 地图自定义 callout 相关属性
            name: 'markerId',
            get(domNode) {
                return domNode.getAttribute('marker-id')
            },
        }],
    },
    'match-media': {
        wxCompName: 'match-media',
        properties: [{
            name: 'minWidth',
            get(domNode) {
                return +domNode.getAttribute('min-width') || 0
            },
        }, {
            name: 'maxWidth',
            get(domNode) {
                return +domNode.getAttribute('max-width') || 0
            },
        }, {
            name: 'width',
            get(domNode) {
                return +domNode.getAttribute('width') || 0
            },
        }, {
            name: 'minHeight',
            get(domNode) {
                return +domNode.getAttribute('min-height') || 0
            },
        }, {
            name: 'maxHeight',
            get(domNode) {
                return +domNode.getAttribute('max-height') || 0
            },
        }, {
            name: 'height',
            get(domNode) {
                return +domNode.getAttribute('height') || 0
            },
        }, {
            name: 'orientation',
            get(domNode) {
                return domNode.getAttribute('orientation') || ''
            },
        }],
    },
    'movable-area': {
        wxCompName: 'movable-area',
        properties: [{
            name: 'scaleArea',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scale-area')
            },
        }],
    },
    'scroll-view': {
        wxCompName: 'scroll-view',
        properties: [{
            name: 'scrollX',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scroll-x')
            },
        }, {
            name: 'scrollY',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scroll-y')
            },
        }, {
            name: 'upperThreshold',
            get(domNode) {
                return domNode.getAttribute('upper-threshold') || '50'
            },
        }, {
            name: 'lowerThreshold',
            get(domNode) {
                return domNode.getAttribute('lower-threshold') || '50'
            },
        }, {
            name: 'scrollTop',
            canBeUserChanged: true,
            get(domNode) {
                return domNode.getAttribute('scroll-top') || ''
            },
        }, {
            name: 'scrollLeft',
            canBeUserChanged: true,
            get(domNode) {
                return domNode.getAttribute('scroll-left') || ''
            },
        }, {
            name: 'scrollWithAnimation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scroll-with-animation')
            },
        }, {
            name: 'enableBackToTop',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-back-to-top')
            },
        }, {
            name: 'enableFlex',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-flex')
            },
        }, {
            name: 'scrollAnchoring',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scroll-anchoring')
            },
        }, {
            name: 'refresherEnabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'refresher-enabled')
            },
        }, {
            name: 'refresherThreshold',
            get(domNode) {
                return domNode.getAttribute('refresher-threshold') || '45'
            },
        }, {
            name: 'refresherDefaultStyle',
            get(domNode) {
                return domNode.getAttribute('refresher-default-style') || 'black'
            },
        }, {
            name: 'refresherBackground',
            get(domNode) {
                return domNode.getAttribute('refresher-background') || '#FFF'
            },
        }, {
            name: 'refresherTriggered',
            get(domNode) {
                const value = dealWithBoolValue(domNode, 'refresher-triggered')

                // 如果在禁止下拉刷新时设为 true，那么在重新开启下拉刷新时再设为 true 会被 diff 掉
                const refresherEnabled = dealWithBoolValue(domNode, 'refresher-enabled')
                if (!refresherEnabled && value) {
                    domNode.$$setAttributeWithoutUpdate('refresher-triggered', false)
                    return false
                }

                return value
            },
        }],
        handles: {
            onScrollViewScrolltoupper(evt) {
                this.callSingleEvent('scrolltoupper', evt)
            },

            onScrollViewScrolltolower(evt) {
                this.callSingleEvent('scrolltolower', evt)
            },

            onScrollViewScroll(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('scroll-into-view', '')
                domNode.$$setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop)
                domNode.$$setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.scrollIntoView = ''
                domNode._oldValues.scrollTop = evt.detail.scrollTop || ''
                domNode._oldValues.scrollLeft = evt.detail.scrollLeft || ''

                this.callSimpleEvent('scroll', evt)
            },

            onScrollViewRefresherPulling(evt) {
                this.callSingleEvent('refresherpulling', evt)
            },

            onScrollViewRefresherRefresh(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (domNode) domNode.setAttribute('refresher-triggered', true)

                this.callSingleEvent('refresherrefresh', evt)
            },

            onScrollViewRefresherRestore(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (domNode) domNode.setAttribute('refresher-triggered', false)

                this.callSingleEvent('refresherrestore', evt)
            },

            onScrollViewRefresherAbort(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (domNode) domNode.setAttribute('refresher-triggered', false)

                this.callSingleEvent('refresherabort', evt)
            },

        },
    },
    swiper: {
        wxCompName: 'swiper',
        properties: [{
            name: 'indicatorDots',
            get(domNode) {
                return dealWithBoolValue(domNode, 'indicator-dots')
            },
        }, {
            name: 'indicatorColor',
            get(domNode) {
                return domNode.getAttribute('indicator-color') || 'rgba(0, 0, 0, .3)'
            },
        }, {
            name: 'indicatorActiveColor',
            get(domNode) {
                return domNode.getAttribute('indicator-active-color') || '#000000'
            },
        }, {
            name: 'autoplay',
            get(domNode) {
                return dealWithBoolValue(domNode, 'autoplay')
            },
        }, {
            name: 'current',
            canBeUserChanged: true,
            get(domNode) {
                return +domNode.getAttribute('current') || 0
            },
        }, {
            name: 'interval',
            get(domNode) {
                return dealWithNumber(domNode, 'interval', 5000)
            },
        }, {
            name: 'duration',
            get(domNode) {
                return dealWithNumber(domNode, 'duration', 500)
            },
        }, {
            name: 'circular',
            get(domNode) {
                return dealWithBoolValue(domNode, 'circular')
            },
        }, {
            name: 'vertical',
            get(domNode) {
                return dealWithBoolValue(domNode, 'vertical')
            },
        }, {
            name: 'previousMargin',
            get(domNode) {
                return domNode.getAttribute('previous-margin') || '0px'
            },
        }, {
            name: 'nextMargin',
            get(domNode) {
                return domNode.getAttribute('next-margin') || '0px'
            },
        }, {
            name: 'snapToEdge',
            get(domNode) {
                return dealWithBoolValue(domNode, 'snap-to-edge')
            },
        }, {
            name: 'displayMultipleItems',
            get(domNode) {
                return dealWithNumber(domNode, 'display-multiple-items', 1)
            },
        }, {
            name: 'skipHiddenItemLayout',
            get(domNode) {
                return dealWithBoolValue(domNode, 'skip-hidden-item-layout')
            },
        }, {
            name: 'easingFunction',
            get(domNode) {
                return domNode.getAttribute('easing-function') || 'default'
            },
        }],
        handles: {
            onSwiperChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('current', evt.detail.current)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.current = evt.detail.current

                this.callSingleEvent('change', evt)
            },

            onSwiperTransition(evt) {
                this.callSingleEvent('transition', evt)
            },

            onSwiperAnimationfinish(evt) {
                this.callSingleEvent('animationfinish', evt)
            },
        },
    },
    view: {
        wxCompName: 'view',
        properties: [{
            name: 'hoverClass',
            get(domNode) {
                return domNode.getAttribute('hover-class') || 'none'
            },
        }, {
            name: 'hoverStopPropagation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'hover-stop-propagation')
            },
        }, {
            name: 'hoverStartTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-start-time', 50)
            },
        }, {
            name: 'hoverStayTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-stay-time', 400)
            },
        }],
    },
    // 基础内容
    icon: {
        wxCompName: 'icon',
        properties: [{
            name: 'type',
            get(domNode) {
                return domNode.getAttribute('type') || ''
            },
        }, {
            name: 'size',
            get(domNode) {
                return domNode.getAttribute('size') || '23'
            },
        }, {
            name: 'color',
            get(domNode) {
                return domNode.getAttribute('color') || ''
            },
        }],
    },
    progress: {
        wxCompName: 'progress',
        properties: [{
            name: 'percent',
            get(domNode) {
                return +domNode.getAttribute('percent') || 0
            },
        }, {
            name: 'showInfo',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-info')
            },
        }, {
            name: 'borderRadius',
            get(domNode) {
                return domNode.getAttribute('border-radius') || '0'
            },
        }, {
            name: 'fontSize',
            get(domNode) {
                return domNode.getAttribute('font-size') || '16'
            },
        }, {
            name: 'strokeWidth',
            get(domNode) {
                return domNode.getAttribute('stroke-width') || '6'
            },
        }, {
            name: 'color',
            get(domNode) {
                return domNode.getAttribute('color') || '#09BB07'
            },
        }, {
            name: 'activeColor',
            get(domNode) {
                return domNode.getAttribute('active-color') || '#09BB07'
            },
        }, {
            name: 'backgroundColor',
            get(domNode) {
                return domNode.getAttribute('background-color') || '#EBEBEB'
            },
        }, {
            name: 'active',
            get(domNode) {
                return dealWithBoolValue(domNode, 'active')
            },
        }, {
            name: 'activeMode',
            get(domNode) {
                return domNode.getAttribute('active-mode') || 'backwards'
            },
        }, {
            name: 'duration',
            get(domNode) {
                return dealWithNumber(domNode, 'duration', 30)
            },
        }],
        handles: {
            onProgressActiveEnd(evt) {
                this.callSingleEvent('activeend', evt)
            },
        },
    },
    'rich-text': {
        wxCompName: 'rich-text',
        properties: [{
            name: 'nodes',
            get(domNode) {
                const value = domNode.getAttribute('nodes')
                const parseValue = dealWithObjectString(value)
                return parseValue !== undefined ? parseValue : (value || [])
            },
        }, {
            name: 'space',
            get(domNode) {
                return domNode.getAttribute('space') || ''
            },
        }],
    },
    text: {
        wxCompName: 'text',
        properties: [{
            name: 'selectable',
            get(domNode) {
                return dealWithBoolValue(domNode, 'selectable')
            },
        }, {
            name: 'space',
            get(domNode) {
                return domNode.getAttribute('space') || ''
            },
        }, {
            name: 'decode',
            get(domNode) {
                return dealWithBoolValue(domNode, 'decode')
            },
        }],
    },
    // 表单组件
    button: {
        wxCompName: 'button',
        properties: [{
            name: 'size',
            get(domNode) {
                return domNode.getAttribute('size') || 'default'
            },
        }, {
            name: 'type',
            get(domNode) {
                // 如果使用默认值 default，基础库中会补充 wx-button[type=default]，导致部分样式优先级处理有问题
                return domNode.getAttribute('type') || undefined
            },
        }, {
            name: 'plain',
            get(domNode) {
                return dealWithBoolValue(domNode, 'plain')
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disabled')
            },
        }, {
            name: 'loading',
            get(domNode) {
                return dealWithBoolValue(domNode, 'loading')
            },
        }, {
            name: 'formType',
            get(domNode) {
                return domNode.getAttribute('form-type') || ''
            },
        }, {
            name: 'openType',
            get(domNode) {
                return domNode.getAttribute('open-type') || ''
            },
        }, {
            name: 'hoverClass',
            get(domNode) {
                return domNode.getAttribute('hover-class') || 'button-hover'
            },
        }, {
            name: 'hoverStopPropagation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'hover-stop-propagation')
            },
        }, {
            name: 'hoverStartTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-start-time', 20)
            },
        }, {
            name: 'hoverStayTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-stay-time', 70)
            },
        }, {
            name: 'lang',
            get(domNode) {
                return domNode.getAttribute('lang') || 'en'
            },
        }, {
            name: 'sessionFrom',
            get(domNode) {
                return domNode.getAttribute('session-from') || ''
            },
        }, {
            name: 'sendMessageTitle',
            get(domNode) {
                return domNode.getAttribute('send-message-title') || ''
            },
        }, {
            name: 'sendMessagePath',
            get(domNode) {
                return domNode.getAttribute('send-message-path') || ''
            },
        }, {
            name: 'sendMessageImg',
            get(domNode) {
                return domNode.getAttribute('send-message-img') || ''
            },
        }, {
            name: 'appParameter',
            get(domNode) {
                return domNode.getAttribute('app-parameter') || ''
            },
        }, {
            name: 'showMessageCard',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-message-card')
            },
        }, {
            name: 'businessId',
            get(domNode) {
                return domNode.getAttribute('business-id') || ''
            },
        }, {
            // qq 小程序特有属性
            name: 'shareType',
            get(domNode) {
                return dealWithNumber(domNode, 'share-type', 27)
            },
        }, {
            // qq 小程序特有属性
            name: 'shareMode',
            get(domNode) {
                return domNode.getAttribute('share-mode')
            },
        }],
        handles: {
            onButtonGetUserInfo(evt) {
                this.callSingleEvent('getuserinfo', evt)
            },

            onButtonContact(evt) {
                this.callSingleEvent('contact', evt)
            },

            onButtonGetPhoneNumber(evt) {
                this.callSingleEvent('getphonenumber', evt)
            },

            onButtonError(evt) {
                this.callSingleEvent('error', evt)
            },

            onButtonOpenSetting(evt) {
                this.callSingleEvent('opensetting', evt)
            },

            onButtonLaunchApp(evt) {
                this.callSingleEvent('launchapp', evt)
            },

            onButtonGetRealnameAuthInfo(evt) {
                // 已废弃，建议使用：https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-checkrealnameinfo.html
                this.callSingleEvent('getrealnameauthinfo', evt)
            },
        },
    },
    editor: {
        wxCompName: 'editor',
        properties: [{
            name: 'readOnly',
            get(domNode) {
                return dealWithBoolValue(domNode, 'read-only')
            },
        }, {
            name: 'placeholder',
            get(domNode) {
                return domNode.getAttribute('placeholder') || ''
            },
        }, {
            name: 'showImgSize',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-img-size')
            },
        }, {
            name: 'showImgToolbar',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-img-toolbar')
            },
        }, {
            name: 'showImgResize',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-img-resize')
            },
        }],
        handles: {
            onEditorReady(evt) {
                this.callSingleEvent('ready', evt)
            },

            onEditorFocus(evt) {
                this.callSingleEvent('focus', evt)
            },

            onEditorBlur(evt) {
                this.callSingleEvent('blur', evt)
            },

            onEditorInput(evt) {
                this.callSingleEvent('input', evt)
            },

            onEditorStatusChange(evt) {
                this.callSingleEvent('statuschange', evt)
            },
        },
    },
    form: {
        // 可以认为下述 form 组件的属性和事件是几乎没有用的，因为 button 组件会被封装到自定义组件内
        wxCompName: 'form',
        properties: [{
            name: 'reportSubmit',
            get(domNode) {
                return dealWithBoolValue(domNode, 'report-submit')
            },
        }, {
            name: 'reportSubmitTimeout',
            get(domNode) {
                return +domNode.getAttribute('report-submit-timeout') || 0
            },
        }],
        handles: {
            onFormSubmit(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode._formId = evt.detail.formId
                // submit 事件由 kbone 模拟，不需要原生 submit 事件
            },

            onFormReset() {
                // reset 事件由 kbone 模拟，不需要原生 reset 事件
            },
        },
    },
    INPUT: {
        wxCompName: 'input',
        properties: [{
            name: 'value',
            canBeUserChanged: true,
            get(domNode) {
                return domNode.value || ''
            },
        }, {
            name: 'type',
            get(domNode) {
                const value = domNode.type || 'text'
                return value !== 'password' ? value : 'text'
            },
        }, {
            name: 'password',
            get(domNode) {
                return domNode.type !== 'password' ? dealWithBoolValue(domNode, 'password') : true
            },
        }, {
            name: 'placeholder',
            get(domNode) {
                return domNode.placeholder
            },
        }, {
            name: 'placeholderStyle',
            get(domNode) {
                return domNode.getAttribute('placeholder-style') || ''
            },
        }, {
            name: 'placeholderClass',
            get(domNode) {
                return domNode.getAttribute('placeholder-class') || 'input-placeholder'
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return domNode.disabled
            },
        }, {
            name: 'maxlength',
            get(domNode) {
                return dealWithNumber(domNode, 'maxlength', 140)
            },
        }, {
            name: 'cursorSpacing',
            get(domNode) {
                return +domNode.getAttribute('cursor-spacing') || 0
            },
        }, {
            name: 'autoFocus',
            get(domNode) {
                return dealWithBoolValue(domNode, 'autofocus')
            },
        }, {
            name: 'focus',
            canBeUserChanged: true,
            get(domNode) {
                return dealWithBoolValue(domNode, 'focus')
            },
        }, {
            name: 'confirmType',
            get(domNode) {
                return domNode.getAttribute('confirm-type') || 'done'
            },
        }, {
            name: 'confirmHold',
            get(domNode) {
                return dealWithBoolValue(domNode, 'confirm-hold')
            },
        }, {
            name: 'cursor',
            get(domNode) {
                return dealWithNumber(domNode, 'cursor', -1)
            },
        }, {
            name: 'selectionStart',
            get(domNode) {
                return dealWithNumber(domNode, 'selection-start', -1)
            },
        }, {
            name: 'selectionEnd',
            get(domNode) {
                return dealWithNumber(domNode, 'selection-end', -1)
            },
        }, {
            name: 'adjustPosition',
            get(domNode) {
                return dealWithBoolValue(domNode, 'adjust-position', true)
            },
        }, {
            name: 'holdKeyboard',
            get(domNode) {
                return dealWithBoolValue(domNode, 'hold-keyboard')
            },
        }, {
            name: 'checked',
            canBeUserChanged: true,
            get(domNode) {
                return dealWithBoolValue(domNode, 'checked')
            },
        }, {
            name: 'color',
            get(domNode) {
                return domNode.getAttribute('color') || '#09BB07'
            },
        }],
        handles: {
            onInputInput(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                const value = '' + evt.detail.value
                domNode.$$setAttributeWithoutUpdate('value', value)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.value = value

                this.callEvent('input', evt)
            },

            onInputFocus(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode._inputOldValue = domNode.value
                domNode.$$setAttributeWithoutUpdate('focus', true)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.focus = true

                this.callSimpleEvent('focus', evt)
            },

            onInputBlur(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('focus', false)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.focus = false

                if (domNode._inputOldValue !== undefined && domNode.value !== domNode._inputOldValue) {
                    domNode._inputOldValue = undefined
                    this.callEvent('change', evt)
                }
                this.callSimpleEvent('blur', evt)
            },

            onInputConfirm(evt) {
                this.callSimpleEvent('confirm', evt)
            },

            onInputKeyBoardHeightChange(evt) {
                this.callSingleEvent('keyboardheightchange', evt)
            },

            onRadioChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                const window = cache.getWindow(this.pageId)
                const value = evt.detail.value
                const name = domNode.name

                if (value === domNode.value) {
                    domNode.$$setAttributeWithoutUpdate('checked', true)

                    // 可被用户行为改变的值，需要记录
                    domNode._oldValues = domNode._oldValues || {}
                    domNode._oldValues.checked = true

                    const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || []
                    for (const otherDomNode of otherDomNodes) {
                        if (otherDomNode.type === 'radio' && otherDomNode !== domNode) {
                            otherDomNode.setAttribute('checked', false)

                            // 可被用户行为改变的值，需要记录
                            otherDomNode._oldValues = otherDomNode._oldValues || {}
                            otherDomNode._oldValues.checked = false
                        }
                    }
                    this.callEvent('$$radioChange', evt)
                }
                this.callEvent('input', evt)
                this.callEvent('change', evt)
            },

            onCheckboxChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                const value = evt.detail.value || []
                if (value.indexOf(domNode.value) >= 0) {
                    domNode.$$setAttributeWithoutUpdate('checked', true)

                    // 可被用户行为改变的值，需要记录
                    domNode._oldValues = domNode._oldValues || {}
                    domNode._oldValues.checked = true
                } else {
                    domNode.$$setAttributeWithoutUpdate('checked', false)

                    // 可被用户行为改变的值，需要记录
                    domNode._oldValues = domNode._oldValues || {}
                    domNode._oldValues.checked = false
                }
                this.callEvent('$$checkboxChange', evt)
                this.callEvent('input', evt)
                this.callEvent('change', evt)
            },
        },
    },
    picker: {
        wxCompName: 'picker',
        properties: [{
            name: 'headerText',
            get(domNode) {
                return domNode.getAttribute('header-text') || ''
            },
        }, {
            name: 'mode',
            get(domNode) {
                return domNode.getAttribute('mode') || 'selector'
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disabled')
            },
        }, {
            name: 'range',
            get(domNode) {
                if (domNode.tagName === 'SELECT') {
                    return domNode.options.map(item => ({
                        label: item.label,
                        value: item.value,
                    }))
                }

                let value = domNode.getAttribute('range')
                if (typeof value === 'string') {
                    const parseValue = dealWithObjectString(value)
                    value = parseValue !== undefined ? parseValue : value.split(',')
                }
                return value !== undefined ? value : []
            },
        }, {
            name: 'rangeKey',
            get(domNode) {
                if (domNode.tagName === 'SELECT') return 'label'

                return domNode.getAttribute('range-key') || ''
            },
        }, {
            name: 'value',
            canBeUserChanged: true,
            get(domNode) {
                if (domNode.tagName === 'SELECT') return +domNode.selectedIndex || 0

                const mode = domNode.getAttribute('mode') || 'selector'
                let value = domNode.getAttribute('value')

                if (mode === 'selector') {
                    return +value || 0
                } else if (mode === 'multiSelector') {
                    if (typeof value === 'string') {
                        const parseValue = dealWithObjectString(value)
                        value = parseValue !== undefined ? parseValue : value.split(',')
                        value = value.map(item => parseInt(item, 10))
                    }
                    return value || []
                } else if (mode === 'time') {
                    return value || ''
                } else if (mode === 'date') {
                    return value || '0'
                } else if (mode === 'region') {
                    if (typeof value === 'string') {
                        const parseValue = dealWithObjectString(value)
                        value = parseValue !== undefined ? parseValue : value.split(',')
                    }
                    return value || []
                }

                return value
            },
        }, {
            name: 'start',
            get(domNode) {
                return domNode.getAttribute('start') || ''
            },
        }, {
            name: 'end',
            get(domNode) {
                return domNode.getAttribute('end') || ''
            },
        }, {
            name: 'fields',
            get(domNode) {
                return domNode.getAttribute('fields') || 'day'
            },
        }, {
            name: 'customItem',
            get(domNode) {
                return domNode.getAttribute('custom-item') || ''
            }
        }],
        handles: {
            onPickerChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                let value = evt.detail.value

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.value = value

                if (domNode.tagName === 'SELECT') {
                    value = +value
                    domNode.$$setAttributeWithoutUpdate('value', domNode.options[value] && domNode.options[value].value || '')
                    domNode.$$setAttributeWithoutUpdate('selectedIndex', value)
                    domNode.$$resetOptions()

                    this.callEvent('change', evt)
                } else {
                    domNode.$$setAttributeWithoutUpdate('value', value)

                    this.callSingleEvent('change', evt)
                }
            },

            onPickerColumnChange(evt) {
                this.callSingleEvent('columnchange', evt)
            },

            onPickerCancel(evt) {
                this.callSingleEvent('cancel', evt)
            },
        },
    },
    'picker-view': {
        wxCompName: 'picker-view',
        properties: [{
            name: 'value',
            canBeUserChanged: true,
            get(domNode) {
                let value = domNode.getAttribute('value')
                if (typeof value === 'string') {
                    const parseValue = dealWithObjectString(value)
                    value = parseValue !== undefined ? parseValue : value.split(',')
                    value = value.map(item => parseInt(item, 10))
                }
                return value !== undefined ? value : []
            },
        }, {
            name: 'indicatorStyle',
            get(domNode) {
                return domNode.getAttribute('indicator-style') || ''
            },
        }, {
            name: 'indicatorClass',
            get(domNode) {
                return domNode.getAttribute('indicator-class') || ''
            },
        }, {
            name: 'maskStyle',
            get(domNode) {
                return domNode.getAttribute('mask-style') || ''
            },
        }, {
            name: 'maskClass',
            get(domNode) {
                return domNode.getAttribute('mask-class') || ''
            },
        }],
        handles: {
            onPickerViewChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.value = evt.detail.value

                this.callSingleEvent('change', evt)
            },

            onPickerViewPickstart(evt) {
                this.callSingleEvent('pickstart', evt)
            },

            onPickerViewPickend(evt) {
                this.callSingleEvent('pickend', evt)
            },
        },
    },
    slider: {
        wxCompName: 'slider',
        properties: [{
            name: 'min',
            get(domNode) {
                return +domNode.getAttribute('min') || 0
            },
        }, {
            name: 'max',
            get(domNode) {
                return dealWithNumber(domNode, 'max', 100)
            },
        }, {
            name: 'step',
            get(domNode) {
                return dealWithNumber(domNode, 'step', 1)
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disabled')
            },
        }, {
            name: 'value',
            canBeUserChanged: true,
            get(domNode) {
                return +domNode.getAttribute('value') || 0
            },
        }, {
            name: 'color',
            get(domNode) {
                return domNode.getAttribute('color') || '#e9e9e9'
            },
        }, {
            name: 'selectedColor',
            get(domNode) {
                return domNode.getAttribute('selected-color') || '#1aad19'
            },
        }, {
            name: 'activeColor',
            get(domNode) {
                return domNode.getAttribute('active-color') || '#1aad19'
            },
        }, {
            name: 'backgroundColor',
            get(domNode) {
                return domNode.getAttribute('background-color') || '#e9e9e9'
            },
        }, {
            name: 'blockSize',
            get(domNode) {
                return dealWithNumber(domNode, 'block-size', 28)
            },
        }, {
            name: 'blockColor',
            get(domNode) {
                return domNode.getAttribute('block-color') || '#ffffff'
            },
        }, {
            name: 'showValue',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-value')
            },
        }],
        handles: {
            onSliderChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.value = evt.detail.value

                this.callSingleEvent('change', evt)
            },

            onSliderChanging(evt) {
                this.callSingleEvent('changing', evt)
            },
        },
    },
    switch: {
        wxCompName: 'switch',
        properties: [{
            name: 'checked',
            canBeUserChanged: true,
            get(domNode) {
                return dealWithBoolValue(domNode, 'checked')
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disabled')
            },
        }, {
            name: 'type',
            get(domNode) {
                return domNode.getAttribute('type') || 'switch'
            },
        }, {
            name: 'color',
            get(domNode) {
                return domNode.getAttribute('color') || '#04BE02'
            },
        }],
        handles: {
            onSwitchChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('checked', evt.detail.value)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.checked = evt.detail.value

                this.callSingleEvent('change', evt)
            },
        },
    },
    TEXTAREA: {
        wxCompName: 'textarea',
        properties: [{
            name: 'value',
            canBeUserChanged: true,
            get(domNode) {
                return domNode.value || ''
            },
        }, {
            name: 'placeholder',
            get(domNode) {
                return domNode.placeholder
            },
        }, {
            name: 'placeholderStyle',
            get(domNode) {
                return domNode.getAttribute('placeholder-style') || ''
            },
        }, {
            name: 'placeholderClass',
            get(domNode) {
                return domNode.getAttribute('placeholder-class') || 'textarea-placeholder'
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return domNode.disabled
            },
        }, {
            name: 'maxlength',
            get(domNode) {
                return dealWithNumber(domNode, 'maxlength', 140)
            }
        }, {
            name: 'autoFocus',
            get(domNode) {
                return dealWithBoolValue(domNode, 'autofocus')
            },
        }, {
            name: 'focus',
            canBeUserChanged: true,
            get(domNode) {
                return dealWithBoolValue(domNode, 'focus')
            },
        }, {
            name: 'autoHeight',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-height')
            },
        }, {
            name: 'fixed',
            get(domNode) {
                return dealWithBoolValue(domNode, 'fixed')
            },
        }, {
            name: 'cursorSpacing',
            get(domNode) {
                return +domNode.getAttribute('cursor-spacing') || 0
            },
        }, {
            name: 'cursor',
            get(domNode) {
                return dealWithNumber(domNode, 'cursor', -1)
            },
        }, {
            name: 'showConfirmBar',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-confirm-bar', true)
            },
        }, {
            name: 'selectionStart',
            get(domNode) {
                return dealWithNumber(domNode, 'selection-start', -1)
            },
        }, {
            name: 'selectionEnd',
            get(domNode) {
                return dealWithNumber(domNode, 'selection-end', -1)
            },
        }, {
            name: 'adjustPosition',
            get(domNode) {
                return dealWithBoolValue(domNode, 'adjust-position', true)
            },
        }, {
            name: 'holdKeyboard',
            get(domNode) {
                return dealWithBoolValue(domNode, 'hold-keyboard')
            },
        }, {
            name: 'disableDefaultPadding',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disable-default-padding')
            },
        }],
        handles: {
            onTextareaFocus(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode._textareaOldValue = domNode.value
                domNode.$$setAttributeWithoutUpdate('focus', true)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.focus = true

                this.callSimpleEvent('focus', evt)
            },

            onTextareaBlur(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('focus', false)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.focus = false

                if (domNode._textareaOldValue !== undefined && domNode.value !== domNode._textareaOldValue) {
                    domNode._textareaOldValue = undefined
                    this.callEvent('change', evt)
                }
                this.callSimpleEvent('blur', evt)
            },

            onTextareaLineChange(evt) {
                this.callSingleEvent('linechange', evt)
            },

            onTextareaInput(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                const value = '' + evt.detail.value
                domNode.$$setAttributeWithoutUpdate('value', value)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.value = value

                this.callEvent('input', evt)
            },

            onTextareaConfirm(evt) {
                this.callSimpleEvent('confirm', evt)
            },

            onTextareaKeyBoardHeightChange(evt) {
                this.callSingleEvent('keyboardheightchange', evt)
            },
        },
    },
    // 导航
    navigator: {
        wxCompName: 'navigator',
        properties: [{
            name: 'target',
            get(domNode) {
                return domNode.getAttribute('target') || 'self'
            },
        }, {
            name: 'url',
            get(domNode) {
                return domNode.getAttribute('url') || ''
            },
        }, {
            name: 'openType',
            get(domNode) {
                return domNode.getAttribute('open-type') || 'navigate'
            },
        }, {
            name: 'delta',
            get(domNode) {
                return dealWithNumber(domNode, 'delta', 1)
            },
        }, {
            name: 'appId',
            get(domNode) {
                return domNode.getAttribute('app-id') || ''
            },
        }, {
            name: 'path',
            get(domNode) {
                return domNode.getAttribute('path') || ''
            },
        }, {
            name: 'extraData',
            get(domNode) {
                return domNode.getAttribute('extra-data') || {}
            },
        }, {
            name: 'version',
            get(domNode) {
                return domNode.getAttribute('version') || 'release'
            },
        }, {
            name: 'hoverClass',
            get(domNode) {
                return domNode.getAttribute('hover-class') || 'navigator-hover'
            },
        }, {
            name: 'hoverStopPropagation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'hover-stop-propagation')
            },
        }, {
            name: 'hoverStartTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-start-time', 50)
            },
        }, {
            name: 'hoverStayTime',
            get(domNode) {
                return dealWithNumber(domNode, 'hover-stay-time', 600)
            },
        }],
        handles: {
            onNavigatorSuccess(evt) {
                this.callSingleEvent('success', evt)
            },

            onNavigatorFail(evt) {
                this.callSingleEvent('fail', evt)
            },

            onNavigatorComplete(evt) {
                this.callSingleEvent('complete', evt)
            },
        },
    },
    // 媒体组件
    camera: {
        wxCompName: 'camera',
        properties: [{
            name: 'mode',
            get(domNode) {
                return domNode.getAttribute('mode') || 'normal'
            },
        }, {
            name: 'resolution',
            get(domNode) {
                return domNode.getAttribute('resolution') || 'medium'
            },
        }, {
            name: 'devicePosition',
            get(domNode) {
                return domNode.getAttribute('device-position') || 'back'
            },
        }, {
            name: 'flash',
            get(domNode) {
                return domNode.getAttribute('flash') || 'auto'
            },
        }, {
            name: 'frameSize',
            get(domNode) {
                return domNode.getAttribute('frame-size') || 'medium'
            },
        }],
        handles: {
            onCameraStop(evt) {
                this.callSingleEvent('stop', evt)
            },

            onCameraError(evt) {
                this.callSingleEvent('error', evt)
            },

            onCameraInitDone(evt) {
                this.callSingleEvent('initdone', evt)
            },

            onCameraScanCode(evt) {
                this.callSingleEvent('scancode', evt)
            },
        },
    },
    image: {
        wxCompName: 'image',
        properties: [{
            name: 'renderingMode',
            get(domNode) {
                return domNode.getAttribute('rendering-mode') || ''
            },
        }, {
            name: 'src',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
            },
        }, {
            name: 'mode',
            get(domNode) {
                return domNode.getAttribute('mode') || 'scaleToFill'
            },
        }, {
            name: 'webp',
            get(domNode) {
                return dealWithBoolValue(domNode, 'webp')
            },
        }, {
            name: 'lazyLoad',
            get(domNode) {
                return dealWithBoolValue(domNode, 'lazy-load')
            },
        }, {
            name: 'showMenuByLongpress',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-menu-by-longpress')
            },
        }],
        handles: {
            onImageLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onImageError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    'live-player': {
        wxCompName: 'live-player',
        properties: [{
            name: 'src',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
            },
        }, {
            name: 'mode',
            get(domNode) {
                return domNode.getAttribute('mode') || 'live'
            },
        }, {
            name: 'autoplay',
            get(domNode) {
                return dealWithBoolValue(domNode, 'autoplay')
            },
        }, {
            name: 'muted',
            get(domNode) {
                return dealWithBoolValue(domNode, 'muted')
            },
        }, {
            name: 'orientation',
            get(domNode) {
                return domNode.getAttribute('orientation') || 'vertical'
            },
        }, {
            name: 'objectFit',
            get(domNode) {
                return domNode.getAttribute('object-fit') || 'contain'
            },
        }, {
            name: 'backgroundMute',
            get(domNode) {
                return dealWithBoolValue(domNode, 'background-mute')
            },
        }, {
            name: 'minCache',
            get(domNode) {
                return dealWithNumber(domNode, 'min-cache', 1)
            },
        }, {
            name: 'maxCache',
            get(domNode) {
                return dealWithNumber(domNode, 'max-cache', 3)
            },
        }, {
            name: 'soundMode',
            get(domNode) {
                return domNode.getAttribute('sound-mode') || 'speaker'
            },
        }, {
            name: 'autoPauseIfNavigate',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-pause-if-navigate', true)
            },
        }, {
            name: 'autoPauseIfOpenNative',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-pause-if-open-native', true)
            },
        }, {
            name: 'pictureInPictureMode',
            get(domNode) {
                let value = domNode.getAttribute('picture-in-picture-mode')
                if (typeof value === 'string') {
                    const parseValue = dealWithObjectString(value)
                    value = parseValue !== undefined ? parseValue : value.split(',')

                    if (Array.isArray(value) && value.length === 1) value = '' + value[0]
                }

                return value
            },
        }],
        handles: {
            onLivePlayerStateChange(evt) {
                this.callSingleEvent('statechange', evt)
            },

            onLivePlayerFullScreenChange(evt) {
                this.callSingleEvent('fullscreenchange', evt)
            },

            onLivePlayerNetStatus(evt) {
                this.callSingleEvent('netstatus', evt)
            },

            onLivePlayerAudioVolumeNotify(evt) {
                this.callSingleEvent('audiovolumenotify', evt)
            },

            onLivePlayerEnterPictureInPicture(evt) {
                this.callSingleEvent('enterpictureinpicture', evt)
            },

            onLivePlayerLeavePictureInPicture(evt) {
                this.callSingleEvent('leavepictureinpicture', evt)
            },
        },
    },
    'live-pusher': {
        wxCompName: 'live-pusher',
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
                return dealWithBoolValue(domNode, 'autopush')
            },
        }, {
            name: 'muted',
            get(domNode) {
                return dealWithBoolValue(domNode, 'muted')
            },
        }, {
            name: 'enableCamera',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-camera', true)
            },
        }, {
            name: 'autoFocus',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-focus', true)
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
                return dealWithNumber(domNode, 'min-bitrate', 200)
            },
        }, {
            name: 'maxBitrate',
            get(domNode) {
                return dealWithNumber(domNode, 'max-bitrate', 1000)
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
                return dealWithBoolValue(domNode, 'zoom')
            },
        }, {
            name: 'devicePosition',
            get(domNode) {
                return domNode.getAttribute('device-position') || 'front'
            },
        }, {
            name: 'backgroundMute',
            get(domNode) {
                return dealWithBoolValue(domNode, 'background-mute')
            },
        }, {
            name: 'mirror',
            get(domNode) {
                return dealWithBoolValue(domNode, 'mirror')
            },
        }, {
            name: 'remoteMirror',
            get(domNode) {
                return dealWithBoolValue(domNode, 'remote-mirror')
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
                return dealWithBoolValue(domNode, 'enable-mic', true)
            },
        }, {
            name: 'enableAgc',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-agc')
            },
        }, {
            name: 'enableAns',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-ans')
            },
        }, {
            name: 'audioVolumeType',
            get(domNode) {
                return domNode.getAttribute('audio-volume-type') || 'voicecall'
            },
        }, {
            name: 'videoWidth',
            get(domNode) {
                return dealWithNumber(domNode, 'video-width', 360)
            },
        }, {
            name: 'videoHeight',
            get(domNode) {
                return dealWithNumber(domNode, 'video-height', 640)
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
    },
    VIDEO: {
        wxCompName: 'video',
        properties: [{
            name: 'src',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
            },
        }, {
            name: 'duration',
            get(domNode) {
                return +domNode.getAttribute('duration') || 0
            },
        }, {
            name: 'controls',
            get(domNode) {
                return domNode.controls
            },
        }, {
            name: 'danmuList',
            get(domNode) {
                const value = domNode.getAttribute('danmu-list')
                return value !== undefined ? value : []
            },
        }, {
            name: 'danmuBtn',
            get(domNode) {
                return dealWithBoolValue(domNode, 'danmu-btn')
            },
        }, {
            name: 'enableDanmu',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-danmu')
            },
        }, {
            name: 'autoplay',
            get(domNode) {
                return domNode.autoplay
            },
        }, {
            name: 'loop',
            get(domNode) {
                return domNode.loop
            },
        }, {
            name: 'muted',
            get(domNode) {
                return domNode.muted
            },
        }, {
            name: 'initialTime',
            get(domNode) {
                return +domNode.getAttribute('initial-time') || 0
            },
        }, {
            name: 'direction',
            get(domNode) {
                return dealWithNumber(domNode, 'direction', -1)
            },
        }, {
            name: 'showProgress',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-progress', true)
            },
        }, {
            name: 'showFullscreenBtn',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-fullscreen-btn', true)
            },
        }, {
            name: 'showPlayBtn',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-play-btn', true)
            },
        }, {
            name: 'showCenterPlayBtn',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-center-play-btn', true)
            },
        }, {
            name: 'enableProgressGesture',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-progress-gesture', true)
            },
        }, {
            name: 'objectFit',
            get(domNode) {
                return domNode.getAttribute('object-fit') || 'contain'
            },
        }, {
            name: 'poster',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.poster ? tool.completeURL(domNode.poster, window.location.origin, true) : ''
            },
        }, {
            name: 'showMuteBtn',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-mute-btn')
            },
        }, {
            name: 'title',
            get(domNode) {
                return domNode.getAttribute('title') || ''
            },
        }, {
            name: 'playBtnPosition',
            get(domNode) {
                return domNode.getAttribute('play-btn-position') || 'bottom'
            },
        }, {
            name: 'enablePlayGesture',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-play-gesture')
            },
        }, {
            name: 'autoPauseIfNavigate',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-pause-if-navigate', true)
            },
        }, {
            name: 'autoPauseIfOpenNative',
            get(domNode) {
                return dealWithBoolValue(domNode, 'auto-pause-if-open-native', true)
            },
        }, {
            name: 'vslideGesture',
            get(domNode) {
                return dealWithBoolValue(domNode, 'vslide-gesture')
            },
        }, {
            name: 'vslideGestureInFullscreen',
            get(domNode) {
                return dealWithBoolValue(domNode, 'vslide-gesture-in-fullscreen', true)
            },
        }, {
            name: 'adUnitId',
            get(domNode) {
                return domNode.getAttribute('ad-unit-id') || ''
            },
        }, {
            name: 'posterForCrawler',
            get(domNode) {
                return domNode.getAttribute('poster-for-crawler') || ''
            },
        }, {
            name: 'showCastingButton',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-casting-button')
            },
        }, {
            name: 'pictureInPictureMode',
            get(domNode) {
                let value = domNode.getAttribute('picture-in-picture-mode')
                if (typeof value === 'string') {
                    const parseValue = dealWithObjectString(value)
                    value = parseValue !== undefined ? parseValue : value.split(',')

                    if (Array.isArray(value) && value.length === 1) value = '' + value[0]
                }

                return value
            },
        }, {
            name: 'pictureInPictureShowProgress',
            get(domNode) {
                return dealWithBoolValue(domNode, 'picture-in-picture-show-progress')
            },
        }, {
            name: 'enableAutoRotation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-auto-rotation')
            },
        }, {
            name: 'showScreenLockButton',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-screen-lock-button')
            },
        }],
        handles: {
            onVideoPlay(evt) {
                this.callSingleEvent('play', evt)
            },

            onVideoPause(evt) {
                this.callSingleEvent('pause', evt)
            },

            onVideoEnded(evt) {
                this.callSingleEvent('ended', evt)
            },

            onVideoTimeUpdate(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('currentTime', evt.detail.currentTime)
                this.callSingleEvent('timeupdate', evt)
            },

            onVideoFullScreenChange(evt) {
                this.callSingleEvent('fullscreenchange', evt)
            },

            onVideoWaiting(evt) {
                this.callSingleEvent('waiting', evt)
            },

            onVideoError(evt) {
                this.callSingleEvent('error', evt)
            },

            onVideoProgress(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('buffered', evt.detail.buffered)
                this.callSingleEvent('progress', evt)
            },

            onVideoLoadedMetaData(evt) {
                this.callSingleEvent('loadedmetadata', evt)
            },

            onVideoControlsToggle(evt) {
                this.callSingleEvent('controlstoggle', evt)
            },

            onVideoEnterPictureInPicture(evt) {
                this.callSingleEvent('enterpictureinpicture', evt)
            },

            onVideoLeavePictureInPicture(evt) {
                this.callSingleEvent('leavepictureinpicture', evt)
            },
        },
    },
    'voip-room': {
        wxCompName: 'voip-room',
        properties: [{
            name: 'openid',
            get(domNode) {
                return domNode.getAttribute('openid') || ''
            },
        }, {
            name: 'mode',
            get(domNode) {
                return domNode.getAttribute('mode') || 'camera'
            },
        }, {
            name: 'devicePosition',
            get(domNode) {
                return domNode.getAttribute('device-position') || 'front'
            },
        }],
        handles: {
            onVoipRoomError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    // 地图
    map: {
        wxCompName: 'map',
        properties: [{
            name: 'longitude',
            // TODO：需要客户端支持在 regionchange 中返回
            // canBeUserChanged: true,
            get(domNode) {
                return dealWithNumber(domNode, 'longitude', 39.92)
            },
        }, {
            name: 'latitude',
            // TODO：需要客户端支持在 regionchange 中返回
            // canBeUserChanged: true,
            get(domNode) {
                return dealWithNumber(domNode, 'latitude', 116.46)
            },
        }, {
            name: 'scale',
            // TODO：需要客户端支持在 regionchange 中返回
            // canBeUserChanged: true,
            get(domNode) {
                return dealWithNumber(domNode, 'scale', 16)
            },
        }, {
            name: 'markers',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('markers'))
                return value !== undefined ? value : []
            },
        }, {
            name: 'polyline',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('polyline'))
                return value !== undefined ? value : []
            },
        }, {
            name: 'circles',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('circles'))
                return value !== undefined ? value : []
            },
        }, {
            name: 'controls',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('controls'))
                return value !== undefined ? value : []
            },
        }, {
            name: 'includePoints',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('include-points'))
                return value !== undefined ? value : []
            },
        }, {
            name: 'showLocation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-location')
            },
        }, {
            name: 'polygons',
            get(domNode) {
                const value = dealWithObjectString(domNode.getAttribute('polygons'))
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
                return dealWithNumber(domNode, 'layer-style', 1)
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
                return dealWithBoolValue(domNode, 'enable-3D')
            },
        }, {
            name: 'showCompass',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-compass')
            },
        }, {
            name: 'showScale',
            get(domNode) {
                return dealWithBoolValue(domNode, 'show-scale')
            },
        }, {
            name: 'enableOverlooking',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-overlooking')
            },
        }, {
            name: 'enableZoom',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-zoom', true)
            },
        }, {
            name: 'enableScroll',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-scroll', true)
            },
        }, {
            name: 'enableRotate',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-rotate')
            },
        }, {
            name: 'enableSatellite',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-satellite')
            },
        }, {
            name: 'enableTraffic',
            get(domNode) {
                return dealWithBoolValue(domNode, 'enable-traffic')
            },
        }, {
            name: 'setting',
            get(domNode) {
                return dealWithObjectString(domNode.getAttribute('setting')) || {}
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
                    // domNode._oldValues.longitude = evt.detail.centerLocation && evt.detail.centerLocation.longitude
                    // domNode._oldValues.latitude = evt.detail.centerLocation && evt.detail.centerLocation.latitude
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
    },
    // 画布
    CANVAS: {
        wxCompName: 'canvas',
        properties: [{
            name: 'type',
            get(domNode) {
                return domNode.getAttribute('type') || ''
            },
        }, {
            name: 'canvasId',
            get(domNode) {
                return domNode.getAttribute('canvas-id') || ''
            },
        }, {
            name: 'disableScroll',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disable-scroll')
            },
        }, {
            // kbone 自定义的特殊属性，用于兼容 iOS 端绑定了 canvas touch 事件后，触发不了页面滚动的 bug
            name: 'disableEvent',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disable-event')
            },
        }],
        handles: {
            onCanvasTouchStart(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('canvastouchstart', evt)
                this.onTouchStart(evt)
            },

            onCanvasTouchMove(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('canvastouchmove', evt)
                this.onTouchMove(evt)
            },

            onCanvasTouchEnd(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('canvastouchend', evt)
                this.onTouchEnd(evt)
            },

            onCanvasTouchCancel(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('canvastouchcancel', evt)
                this.onTouchCancel(evt)
            },

            onCanvasLongTap(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('longtap', evt)
            },

            onCanvasError(evt) {
                dealWithEvt(evt)
                this.callSingleEvent('error', evt)
            },
        },
    },
    // 开放能力
    ad: {
        wxCompName: 'ad',
        properties: [{
            name: 'unitId',
            get(domNode) {
                return domNode.getAttribute('unit-id') || ''
            },
        }, {
            name: 'adIntervals',
            get(domNode) {
                return +domNode.getAttribute('ad-intervals') || 0
            },
        }, {
            name: 'adType',
            get(domNode) {
                return domNode.getAttribute('ad-type') || 'banner'
            },
        }, {
            name: 'adTheme',
            get(domNode) {
                return domNode.getAttribute('ad-theme') || 'white'
            },
        }],
        handles: {
            onAdLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onAdError(evt) {
                this.callSingleEvent('error', evt)
            },

            onAdClose(evt) {
                this.callSingleEvent('close', evt)
            },
        },
    },
    'ad-custom': {
        wxCompName: 'ad-custom',
        properties: [{
            name: 'unitId',
            get(domNode) {
                return domNode.getAttribute('unit-id') || ''
            },
        }, {
            name: 'adIntervals',
            get(domNode) {
                return +domNode.getAttribute('ad-intervals') || 0
            },
        }],
        handles: {
            onAdCustomLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onAdCustomError(evt) {
                this.callSingleEvent('error', evt)
            },
        },

    },
    'official-account': {
        wxCompName: 'official-account',
        handles: {
            onOfficialAccountLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onOfficialAccountError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    'open-data': {
        wxCompName: 'open-data',
        properties: [{
            name: 'type',
            get(domNode) {
                return domNode.getAttribute('type') || ''
            },
        }, {
            name: 'openGid',
            get(domNode) {
                return domNode.getAttribute('open-gid') || ''
            },
        }, {
            name: 'lang',
            get(domNode) {
                return domNode.getAttribute('lang') || 'en'
            },
        }, {
            name: 'defaultText',
            get(domNode) {
                return domNode.getAttribute('default-text') || ''
            },
        }, {
            name: 'defaultAvatar',
            get(domNode) {
                return domNode.getAttribute('default-avatar') || ''
            },
        }],
        handles: {
            onOpenDataError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    'web-view': {
        wxCompName: 'web-view',
        properties: [{
            name: 'src',
            get(domNode) {
                const window = cache.getWindow(domNode.$$pageId)
                return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
            },
        }],
        handles: {
            onWebviewMessage(evt) {
                this.callSingleEvent('message', evt)
            },

            onWebviewLoad(evt) {
                this.callSingleEvent('load', evt)
            },

            onWebviewError(evt) {
                this.callSingleEvent('error', evt)
            },
        },
    },
    // 特殊补充
    capture: {
        wxCompName: 'capture',
    },
    catch: {
        wxCompName: 'catch',
    },
    animation: {
        wxCompName: 'animation',
        properties: [{
            name: 'animation',
            get(domNode) {
                return dealWithObjectString(domNode.getAttribute('animation'))
            },
        }],
    },
    'not-support': {
        wxCompName: 'not-support',
    },
}

// 补充标签
wxComponentMap.SELECT = wxComponentMap.picker

const wxSubComponentMap = {
    'movable-view': {
        properties: [{
            name: 'direction',
            get(domNode) {
                return domNode.getAttribute('direction') || 'none'
            },
        }, {
            name: 'inertia',
            get(domNode) {
                return dealWithBoolValue(domNode, 'inertia')
            },
        }, {
            name: 'outOfBounds',
            get(domNode) {
                return dealWithBoolValue(domNode, 'out-of-bounds')
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
                return dealWithNumber(domNode, 'damping', 20)
            },
        }, {
            name: 'friction',
            get(domNode) {
                return dealWithNumber(domNode, 'friction', 2)
            },
        }, {
            name: 'disabled',
            get(domNode) {
                return dealWithBoolValue(domNode, 'disabled')
            },
        }, {
            name: 'scale',
            get(domNode) {
                return dealWithBoolValue(domNode, 'scale')
            },
        }, {
            name: 'scaleMin',
            get(domNode) {
                return dealWithNumber(domNode, 'scale-min', 0.5)
            },
        }, {
            name: 'scaleMax',
            get(domNode) {
                return dealWithNumber(domNode, 'scale-max', 10)
            },
        }, {
            name: 'scaleValue',
            canBeUserChanged: true,
            get(domNode) {
                return dealWithNumber(domNode, 'scale-value', 1)
            },
        }, {
            name: 'animation',
            get(domNode) {
                return dealWithBoolValue(domNode, 'animation', true)
            },
        }],
        handles: {
            onMovableViewChange(evt) {
                const domNode = this.getDomNodeFromEvt(evt)
                if (!domNode) return

                domNode.$$setAttributeWithoutUpdate('x', evt.detail.x)
                domNode.$$setAttributeWithoutUpdate('y', evt.detail.y)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {scaleValue: dealWithNumber(domNode, 'scale-value', 1)}
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
    },
    'swiper-item': {
        properties: [{
            name: 'itemId',
            get(domNode) {
                return domNode.getAttribute('item-id') || ''
            },
        }],
    },
}

const wxComponentKeys = Object.keys(wxComponentMap)
const wxCompNameMap = {}
const wxCompData = {}
const wxCompHandles = {}
wxComponentKeys.forEach(key => {
    const {wxCompName, properties, handles} = wxComponentMap[key]

    wxCompNameMap[key] = wxCompName
    wxCompData[wxCompName] = properties || []
    if (handles) Object.assign(wxCompHandles, handles)
})
Object.keys(wxSubComponentMap).forEach(key => {
    const {handles} = wxSubComponentMap[key]
    if (handles) Object.assign(wxCompHandles, handles)
})

module.exports = {
    wxCompData,
    wxCompHandles,
    wxCompNameMap,
    wxSubComponentMap,
}
