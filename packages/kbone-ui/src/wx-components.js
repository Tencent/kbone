import registerFactory from './register'

import WxMatchMedia from './components/wx-match-media'
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

const COMPONENT_MAP = {
    'wx-match-media': WxMatchMedia,
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
}

export default {
    register: registerFactory(COMPONENT_MAP),
    COMPONENT_MAP,
}
