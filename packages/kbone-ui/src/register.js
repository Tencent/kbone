import registerDomExtend from './utils/dom-extend'

import Base from './components/base'
import WxRefresher from './inner-components/wx-refresher'

export default function(COMPONENT_MAP, weuiStyle) {
    const COMPONENT_LIST = Object.keys(COMPONENT_MAP)

    /**
     * 注册 kbone-ui
     */
    return function register(options = {}) {
        const components = Array.isArray(options.components) ? options.components : COMPONENT_LIST

        // 全局配置
        Base.setGlobal({
            mode: options.mode || 'open',
            style: options.style || {},
        })

        // 注册样式
        if (weuiStyle && components.some(item => item.indexOf('mp-') === 0)) {
            // 包含 weui 组件
            const style = document.createElement('style')
            style.innerHTML = weuiStyle
            document.head.appendChild(style)
        }

        // 注册内部组件
        if (components.length) WxRefresher.register()

        // 注册组件
        for (const component of components) {
            const componentClass = COMPONENT_MAP[component]
            if (componentClass) componentClass.register()
        }

        // dom/bom 扩展
        const domExtend = options.domExtend === undefined ? true : options.domExtend
        if (domExtend) registerDomExtend()

        // 监听事件
        window.addEventListener('scroll', evt => {
            // 标记滚动元素
            const scrollDom = evt.target !== document ? evt.target : document.documentElement.scrollTop ? document.documentElement : document.body
            scrollDom._scrolling = +new Date()
        })
        window.addEventListener('load', () => {
            window._isLoaded = true
            window.dispatchEvent(new CustomEvent('windowload'))
        })
    }
}
