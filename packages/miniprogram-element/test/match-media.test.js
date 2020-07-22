const _ = require('./utils')

test('match-media', async() => {
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
    node.setAttribute('behavior', 'match-media')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // minWidth
    await _.checkNumber(body, node, 'minWidth', 'min-width', 0)

    // maxWidth
    await _.checkNumber(body, node, 'maxWidth', 'max-width', 0)

    // width
    await _.checkNumber(body, node, 'width', 'width', 0)

    // minHeight
    await _.checkNumber(body, node, 'minHeight', 'min-height', 0)

    // maxHeight
    await _.checkNumber(body, node, 'maxHeight', 'max-height', 0)

    // height
    await _.checkNumber(body, node, 'height', 'height', 0)

    // orientation
    await _.checkString(body, node, 'orientation', 'orientation', '')

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
