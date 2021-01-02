import Base from './components/base'
import WxRefresher from './inner-components/wx-refresher'

import WxMovableArea from './components/wx-movable-area'
import WxMovableView from './components/wx-movable-view'
import WxScrollView from './components/wx-scroll-view'
import WxSwiper from './components/wx-swiper'
import WxSwiperItem from './components/wx-swiper-item'
import WxView from './components/wx-view/index'
import WxIcon from './components/wx-icon'
import WxProgress from './components/wx-progress'
import WxRichText from './components/wx-rich-text'
import WxText from './components/wx-text/index'
import WxButton from './components/wx-button'
import WxCheckbox from './components/wx-checkbox'
import WxCheckboxGroup from './components/wx-checkbox-group'
import WxInput from './components/wx-input'
import WxPicker from './components/wx-picker'
import WxPickerView from './components/wx-picker-view'
import WxPickerViewColumn from './components/wx-picker-view-column'
import WxRadio from './components/wx-radio'
import WxRadioGroup from './components/wx-radio-group'
import WxSlider from './components/wx-slider'
import WxSwitch from './components/wx-switch'
import WxTextarea from './components/wx-textarea'
import WxImage from './components/wx-image'

const COMPONENT_MAP = {
    'wx-movable-area': WxMovableArea,
    'wx-movable-view': WxMovableView,
    'wx-scroll-view': WxScrollView,
    'wx-swiper': WxSwiper,
    'wx-swiper-item': WxSwiperItem,
    'wx-view': WxView,
    'wx-icon': WxIcon,
    'wx-progress': WxProgress,
    'wx-rich-text': WxRichText,
    'wx-text': WxText,
    'wx-button': WxButton,
    'wx-checkbox': WxCheckbox,
    'wx-checkbox-group': WxCheckboxGroup,
    'wx-input': WxInput,
    'wx-picker': WxPicker,
    'wx-picker-view': WxPickerView,
    'wx-picker-view-column': WxPickerViewColumn,
    'wx-radio': WxRadio,
    'wx-radio-group': WxRadioGroup,
    'wx-slider': WxSlider,
    'wx-switch': WxSwitch,
    'wx-textarea': WxTextarea,
    'wx-image': WxImage,
}
const COMPONENT_LIST = Object.keys(COMPONENT_MAP)

export default {
    register(options = {}) {
        const components = Array.isArray(options.components) ? options.components : COMPONENT_LIST
        const mode = options.mode || 'open'
        const style = options.style || {}

        // 全局配置
        Base.setGlobal({
            mode,
            style,
        })

        // 注册内部组件
        if (components.length) {
            WxRefresher.register()
        }

        // 注册组件
        for (const component of components) {
            const componentClass = COMPONENT_MAP[component]
            if (componentClass) {
                componentClass.register()
            }
        }

        // 监听事件
        window.addEventListener('scroll', evt => {
            // 标记滚动元素
            const scrollDom = evt.target !== document ? evt.target : document.documentElement.scrollTop ? document.documentElement : document.body
            scrollDom._scrolling = +new Date()
        })
        window.addEventListener('load', () => {
            window._isLoaded = true
        })
    }
}
