export default function registerDomExtend() {
    const noop = () => {}

    window.$$getComputedStyle = function(dom, computedStyle = []) {
        const style = window.getComputedStyle(dom)
        const res = {}
        computedStyle.forEach(propName => res[propName] = style[propName])
        return new Promise(resolve => resolve(res))
    }

    window.$$forceRender = noop

    HTMLElement.prototype.$$getBoundingClientRect = function() {
        const rect = this.getBoundingClientRect()
        return new Promise(resolve => resolve({
            height: rect.height,
            width: rect.width,
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            dataset: this.dataset,
            id: this.id,
        }))
    }
}
