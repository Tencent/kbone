import registerFactory from './register'
import WxComponents from './wx-components'

import weuiStyle from './styles/weui.less'

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
import MpGrids from './weui-components/mp-grids'

const COMPONENT_MAP = {
    ...WxComponents.COMPONENT_MAP,

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
    'mp-grids': MpGrids,
}

export default {
    register: registerFactory(COMPONENT_MAP, weuiStyle),
    COMPONENT_MAP,
}
