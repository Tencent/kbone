const _ = require('./utils')

test('editor', async() => {
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
    node.setAttribute('behavior', 'editor')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // readOnly
    await _.checkBoolean(body, node, 'readOnly', 'read-only', false)

    // placeholder
    await _.checkString(body, node, 'placeholder', 'placeholder', '')

    // showImgSize
    await _.checkBoolean(body, node, 'showImgSize', 'show-img-size', false)

    // showImgToolbar
    await _.checkBoolean(body, node, 'showImgToolbar', 'show-img-toolbar', false)

    // showImgResize
    await _.checkBoolean(body, node, 'showImgResize', 'show-img-resize', false)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['ready', 'focus', 'blur', 'input', 'statuschange'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
