import registerDomExtend from './utils/dom-extend'
import weuiStyle from './styles/weui.less'

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
import WxForm from './components/wx-form'
import WxInput from './components/wx-input'
import WxLabel from './components/wx-label'
import WxPicker from './components/wx-picker'
import WxPickerView from './components/wx-picker-view'
import WxPickerViewColumn from './components/wx-picker-view-column'
import WxRadio from './components/wx-radio'
import WxRadioGroup from './components/wx-radio-group'
import WxSlider from './components/wx-slider'
import WxSwitch from './components/wx-switch'
import WxTextarea from './components/wx-textarea'
import WxImage from './components/wx-image'
import WxCanvas from './components/wx-canvas'

import WxCapture from './components/wx-capture'
import WxCatch from './components/wx-catch'
import WxAnimation from './components/wx-animation'

import MpBadge from './weui-components/mp-badge'
import MpGallery from './weui-components/mp-gallery'
import MpLoading from './weui-components/mp-loading'
import MpIcon from './weui-components/mp-icon'
import MpForm from './weui-components/mp-form'
import MpFormPage from './weui-components/mp-form-page'
import MpCell from './weui-components/mp-cell'
import MpCells from './weui-components/mp-cells'
import MpCheckboxGroup from './weui-components/mp-checkbox-group'
import MpCheckbox from './weui-components/mp-checkbox'
import MpSlideview from './weui-components/mp-slideview'
import MpUploader from './weui-components/mp-uploader'
import MpDialog from './weui-components/mp-dialog'
import MpMsg from './weui-components/mp-msg'
import MpToptips from './weui-components/mp-toptips'
import MpHalfScreenDialog from './weui-components/mp-half-screen-dialog'
import MpActionsheet from './weui-components/mp-actionsheet'
import MpNavigationBar from './weui-components/mp-navigation-bar'
import MpTabbar from './weui-components/mp-tabbar'
import MpSearchbar from './weui-components/mp-searchbar'

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
    'wx-form': WxForm,
    'wx-input': WxInput,
    'wx-label': WxLabel,
    'wx-picker': WxPicker,
    'wx-picker-view': WxPickerView,
    'wx-picker-view-column': WxPickerViewColumn,
    'wx-radio': WxRadio,
    'wx-radio-group': WxRadioGroup,
    'wx-slider': WxSlider,
    'wx-switch': WxSwitch,
    'wx-textarea': WxTextarea,
    'wx-image': WxImage,
    'wx-canvas': WxCanvas,

    'wx-capture': WxCapture,
    'wx-catch': WxCatch,
    'wx-animation': WxAnimation,

    'mp-badge': MpBadge,
    'mp-gallery': MpGallery,
    'mp-loading': MpLoading,
    'mp-icon': MpIcon,
    'mp-form': MpForm,
    'mp-form-page': MpFormPage,
    'mp-cell': MpCell,
    'mp-cells': MpCells,
    'mp-checkbox-group': MpCheckboxGroup,
    'mp-checkbox': MpCheckbox,
    'mp-slideview': MpSlideview,
    'mp-uploader': MpUploader,
    'mp-dialog': MpDialog,
    'mp-msg': MpMsg,
    'mp-toptips': MpToptips,
    'mp-half-screen-dialog': MpHalfScreenDialog,
    'mp-actionsheet': MpActionsheet,
    'mp-navigation-bar': MpNavigationBar,
    'mp-tabbar': MpTabbar,
    'mp-searchbar': MpSearchbar,
}
const COMPONENT_LIST = Object.keys(COMPONENT_MAP)

export default {
    register(options = {}) {
        const components = Array.isArray(options.components) ? options.components : COMPONENT_LIST

        // 全局配置
        Base.setGlobal({
            mode: options.mode || 'open',
            style: options.style || {},
        })

        // 注册样式
        if (components.some(item => item.indexOf('mp-') === 0)) {
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
        })
    }
}
