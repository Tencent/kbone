const _ = require('./utils')

test('live-player', async() => {
    const page = global.$$page
    const componentId = _.load({
        template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
        usingComponents: {
            element: _.elementId,
        },
    }, 'page')
    const component = _.render(componentId)

    const wrapper = document.createElement('wrapper')
    document.body.appendChild(wrapper)
    component.attach(wrapper)
    expect(_.match(component.dom, `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`)).toBe(true)

    const body = component.querySelector('.h5-body')
    const node = page.document.createElement('wx-component')
    node.setAttribute('behavior', 'live-player')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // src
    await _.checkUrl(body, node, 'src', 'src', '')

    // mode
    await _.checkString(body, node, 'mode', 'mode', 'live')

    // autoplay
    await _.checkBoolean(body, node, 'autoplay', 'autoplay', false)

    // muted
    await _.checkBoolean(body, node, 'muted', 'muted', false)

    // orientation
    await _.checkString(body, node, 'orientation', 'orientation', 'vertical')

    // objectFit
    await _.checkString(body, node, 'objectFit', 'object-fit', 'contain')

    // backgroundMute
    await _.checkBoolean(body, node, 'backgroundMute', 'background-mute', false)

    // minCache
    await _.checkNumber(body, node, 'minCache', 'min-cache', 1)

    // maxCache
    await _.checkNumber(body, node, 'maxCache', 'max-cache', 3)

    // soundMode
    await _.checkString(body, node, 'soundMode', 'sound-mode', 'speaker')

    // autoPauseIfNavigate
    await _.checkBoolean(body, node, 'autoPauseIfNavigate', 'auto-pause-if-navigate', true)

    // autoPauseIfOpenNative
    await _.checkBoolean(body, node, 'autoPauseIfOpenNative', 'auto-pause-if-open-native', true)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['statechange', 'fullscreenchange', 'netstatus'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
