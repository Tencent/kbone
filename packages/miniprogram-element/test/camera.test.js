const _ = require('./utils')

test('camera', async() => {
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
    node.setAttribute('behavior', 'camera')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // mode
    await _.checkString(body, node, 'mode', 'mode', 'normal')

    // resolution
    await _.checkString(body, node, 'resolution', 'resolution', 'medium')

    // devicePosition
    await _.checkString(body, node, 'devicePosition', 'device-position', 'back')

    // flash
    await _.checkString(body, node, 'flash', 'flash', 'auto')

    // frameSize
    await _.checkString(body, node, 'frameSize', 'frame-size', 'medium')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['stop', 'error', 'initdone', 'scancode'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
