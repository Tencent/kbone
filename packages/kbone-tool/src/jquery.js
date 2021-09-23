/**
 * 兼容 jquery 的一些逻辑
 */
function compat() {
    window.$$extend('document', {
        implementation: {
            createHTMLDocument() {
                const body = document.createElement('div')
                return {body}
            },
        },
    })
    window.$$addAspect('document.getElementsByTagName.after', res => {
        res.item = num => res[num]
        return res
    })
    window.$$extend('element', {
        dir: '',
    })
    window.$$extend('window', {
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return ''
                }
            }
        }
    })

    document.querySelectorAll = document.querySelectorAll.bind(document)
}

module.exports = {
    compat,
}
