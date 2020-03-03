const mp = require('miniprogram-render')

const {
    cache,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/input.html
 */
module.exports = {
    properties: [{
        name: 'value',
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
            return domNode.type !== 'password' ? !!domNode.getAttribute('password') : true
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
            const value = parseFloat(domNode.maxlength)
            return !isNaN(value) ? value : 140
        },
    }, {
        name: 'cursorSpacing',
        get(domNode) {
            return +domNode.getAttribute('cursor-spacing') || 0
        },
    }, {
        name: 'autoFocus',
        get(domNode) {
            return !!domNode.getAttribute('autofocus')
        },
    }, {
        name: 'focus',
        get(domNode) {
            return !!domNode.getAttribute('focus')
        },
    }, {
        name: 'confirmType',
        get(domNode) {
            return domNode.getAttribute('confirm-type') || 'done'
        },
    }, {
        name: 'confirmHold',
        get(domNode) {
            return !!domNode.getAttribute('confirm-hold')
        },
    }, {
        name: 'cursor',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('cursor'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionStart',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-start'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionEnd',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-end'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'adjustPosition',
        get(domNode) {
            const value = domNode.getAttribute('adjust-position')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'checked',
        get(domNode) {
            return !!domNode.getAttribute('checked')
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
            domNode.setAttribute('value', value)
            this.callEvent('input', evt)
        },

        onInputFocus(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (domNode) domNode._inputOldValue = domNode.value

            domNode.setAttribute('focus', true)
            this.callSimpleEvent('focus', evt)
        },

        onInputBlur(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.setAttribute('focus', false)
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
            this.callSimpleEvent('keyboardheightchange', evt)
        },

        onRadioChange(evt) {
            const window = cache.getWindow(this.pageId)
            const domNode = this.domNode
            const value = evt.detail.value
            const name = domNode.name

            if (value === domNode.value) {
                domNode.setAttribute('checked', true)
                const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || []
                for (const otherDomNode of otherDomNodes) {
                    if (otherDomNode.type === 'radio' && otherDomNode !== domNode) {
                        otherDomNode.setAttribute('checked', false)
                    }
                }
            }
            this.callEvent('input', evt)
            this.callEvent('change', evt)
        },

        onCheckboxChange(evt) {
            const domNode = this.domNode
            const value = evt.detail.value || []
            if (value.indexOf(domNode.value) >= 0) {
                domNode.setAttribute('checked', true)
            } else {
                domNode.setAttribute('checked', false)
            }
            this.callEvent('input', evt)
            this.callEvent('change', evt)
        },
    },
}
