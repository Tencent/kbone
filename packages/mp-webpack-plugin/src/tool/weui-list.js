module.exports = [
    // 基础组件
    {
        name: 'badge',
        props: ['extClass', 'content'],
        propsVal: ['', ''],
    }, {
        name: 'gallery',
        props: ['extClass', 'show', 'imgUrls', 'current', 'showDelete', 'hideOnClick'],
        propsVal: ['', false, [], 0, true, true],
        events: ['change', 'delete', 'hide'],
    }, {
        name: 'loading',
        props: ['extClass', 'show', 'animated', 'duration', 'type', 'tips'],
        propsVal: ['', true, false, 350, 'dot-gray', '加载中'],
    }, {
        name: 'icon',
        props: ['extClass', 'type', 'icon', 'size', 'color'],
        propsVal: ['', 'outline', '', 20, 'black'],
    },
    // 表单组件
    {
        name: 'form',
        props: ['extClass', 'rules', 'models'],
        propsVal: ['', [], {}],
        events: ['success', 'fail'],
    }, {
        name: 'form-page',
        props: ['title', 'subtitle'],
        propsVal: ['', ''],
    }, {
        name: 'cell',
        props: ['extClass', 'icon', 'title', 'hover', 'link', 'value', 'showError', 'prop', 'footer', 'inline', 'hasHeader'],
        propsVal: ['', '', '', false, false, '', false, '', '', true, true],
    }, {
        name: 'cells',
        props: ['extClass', 'title', 'footer'],
        propsVal: ['', '', ''],
    }, {
        name: 'checkbox-group',
        props: ['extClass', 'multi', 'prop'],
        propsVal: ['', true, ''],
        events: ['change'],
    }, {
        name: 'checkbox',
        props: ['extClass', 'multi', 'checked', 'value', 'label'],
        propsVal: ['', true, false, '', 'label'],
        events: ['change'],
    }, {
        name: 'slideview',
        props: ['extClass', 'disable', 'buttons', 'icon', 'show', 'duration', 'throttle'],
        propsVal: ['', false, [], false, false, 350, 40],
        events: ['buttontap', 'hide', 'show'],
    }, {
        name: 'uploader',
        props: ['extClass', 'title', 'tips', 'showDelete', 'sizeType', 'sourceType', 'maxSize', 'maxCount', 'files', 'select', 'upload'],
        propsVal: ['', '', '', true, [], [], 5 * 1024 * 1024, 1, [], null, null],
        events: ['select', 'cancel', 'success', 'fail', 'delete'],
    },
    // 操作反馈
    {
        name: 'dialog',
        props: ['extClass', 'title', 'buttons', 'mask', 'maskClosable', 'show'],
        propsVal: ['', '', [], true, true, false],
        events: ['close', 'buttontap'],
    }, {
        name: 'msg',
        props: ['extClass', 'type', 'size', 'icon', 'title', 'desc'],
        propsVal: ['', '', 64, '', '', ''],
    }, {
        name: 'toptips',
        props: ['extClass', 'type', 'show', 'msg', 'delay'],
        propsVal: ['', '', false, '', 2000],
        events: ['hide'],
    }, {
        name: 'half-screen-dialog',
        props: ['extClass', 'closabled', 'title', 'subTitle', 'desc', 'tips', 'maskClosable', 'mask', 'show', 'buttons'],
        propsVal: ['', true, '', '', '', '', true, true, false, []],
        events: ['buttontap', 'close'],
    }, {
        name: 'actionsheet',
        props: ['extClass', 'title', 'showCancel', 'cancelText', 'maskClass', 'maskClosable', 'mask', 'show', 'actions'],
        propsVal: ['', '', true, '', '', true, true, false, []],
        events: ['close', 'actiontap'],
    },
    // 导航组件
    {
        name: 'navigation-bar',
        props: ['extClass', 'title', 'back', 'delta', 'background', 'color', 'loading', 'show', 'animated'],
        propsVal: ['', '', true, 1, '#f8f8f8', '', false, true, true],
        events: ['back'],
    }, {
        name: 'tabbar',
        props: ['extClass', 'list', 'current'],
        propsVal: ['', [], 0],
        events: ['change'],
    },
    // 搜索组件
    {
        name: 'searchbar',
        props: ['extClass', 'focus', 'placeholder', 'value', 'search', 'throttle', 'cancelText', 'cancel'],
        propsVal: ['', false, '搜索', '', null, 500, '取消', true],
        events: ['focus', 'blur', 'clear', 'input', 'selectresult'],
    },
    // 其他
    {
        name: 'grids',
        props: ['extClass', 'grids'],
        propsVal: ['', []],
    }]
