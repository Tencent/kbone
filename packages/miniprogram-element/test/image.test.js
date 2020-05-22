const _ = require('./utils')

test('image', async() => {
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
    node.setAttribute('behavior', 'image')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // renderingMode
    await _.checkString(body, node, 'renderingMode', 'rendering-mode', '')

    // src
    await _.checkUrl(body, node, 'src', 'src', '')

    // mode
    await _.checkString(body, node, 'mode', 'mode', 'scaleToFill')

    // webp
    await _.checkBoolean(body, node, 'webp', 'webp', false)

    // lazyLoad
    await _.checkBoolean(body, node, 'lazyLoad', 'lazy-load', false)

    // showMenuByLongpress
    await _.checkBoolean(body, node, 'showMenuByLongpress', 'show-menu-by-longpress', false)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['error', 'load'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
