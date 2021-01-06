module.exports = [
    // 基础组件
    {
        name: 'badge',
        props: ['extClass', 'content'],
    }, {
        name: 'gallery',
        props: ['extClass', 'show', 'imgUrls', 'current', 'showDelete', 'hideOnClick'],
        events: ['change', 'delete', 'hide'],
    }, {
        name: 'loading',
        props: ['extClass', 'show', 'animated', 'duration', 'type', 'tips'],
    }, {
        name: 'icon',
        props: ['extClass', 'type', 'icon', 'size', 'color'],
    },
    // 表单组件
    {
        name: 'form',
        props: ['extClass', 'rules', 'models'],
        events: ['success', 'fail'],
    }, {
        name: 'form-page',
        props: ['title', 'subtitle'],
    }, {
        name: 'cell',
        props: ['extClass', 'icon', 'title', 'hover', 'link', 'value', 'showError', 'prop', 'footer', 'inline'],
    }, {
        name: 'cells',
        props: ['extClass', 'title', 'footer'],
    }, {
        name: 'checkbox-group',
        props: ['extClass', 'multi', 'prop'],
        events: ['change'],
    }, {
        name: 'checkbox',
        props: ['extClass', 'multi', 'checked', 'value'],
        events: ['change'],
    }, {
        name: 'slideview',
        props: ['extClass', 'disable', 'buttons', 'icon', 'show', 'duration', 'throttle'],
        events: ['buttontap', 'hide', 'show'],
    }, {
        name: 'uploader',
        props: ['extClass', 'title', 'tips', 'delete', 'sizeType', 'sourceType', 'maxSize', 'maxCount', 'files', 'select', 'upload'],
        events: ['select', 'cancel', 'success', 'fail', 'delete'],
    },
    // 操作反馈
    {
        name: 'dialog',
        props: ['extClass', 'title', 'buttons', 'mask', 'maskClosable', 'show'],
        events: ['close', 'buttontap'],
    }, {
        name: 'msg',
        props: ['extClass', 'type', 'size', 'icon', 'title', 'desc'],
    }, {
        name: 'toptips',
        props: ['extClass', 'type', 'show', 'msg', 'delay'],
        events: ['hide'],
    }, {
        name: 'half-screen-dialog',
        props: ['extClass', 'closabled', 'title', 'subTitle', 'desc', 'tips', 'maskClosable', 'mask', 'show', 'buttons'],
        events: ['buttontap', 'close'],
    }, {
        name: 'actionsheet',
        props: ['title', 'showCancel', 'cancelText', 'maskClass', 'extClass', 'maskClosable', 'mask', 'show', 'actions'],
        events: ['close', 'actiontap'],
    },
    // 导航组件
    {
        name: 'navigation-bar',
        props: ['extClass', 'title', 'back', 'delta', 'background', 'color', 'loading', 'show', 'animated'],
        events: ['back'],
    }, {
        name: 'tabbar',
        props: ['extClass', 'list', 'current'],
        events: ['change'],
    },
    // 搜索组件
    {
        name: 'searchbar',
        props: ['extClass', 'focus', 'placeholder', 'value', 'search', 'throttle', 'cancelText', 'cancel'],
        events: ['focus', 'blur', 'clear', 'input', 'selectresult'],
    },
    // 其他
    {
        name: 'grids',
        props: ['extClass', 'grids'],
    }]
