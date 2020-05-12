const _ = require('./utils')

test('canvas', async() => {
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
    const node = page.document.createElement('canvas')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // type
    await _.checkString(body, node, 'type', 'type', '')

    // canvasId
    await _.checkString(body, node, 'canvasId', 'canvas-id', '')

    // disableScroll
    await _.checkBoolean(body, node, 'disableScroll', 'disable-scroll', false)

    // disableEvent
    await _.checkBoolean(body, node, 'disableEvent', 'disable-event', false)

    // event
    await _.checkEvent(body.querySelector('.h5-canvas'), node, [['touchstart', 'canvastouchstart'], ['touchmove', 'canvastouchmove'], ['touchend', 'canvastouchend'], ['touchcancel', 'canvastouchcancel'], 'longtap', 'error'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
