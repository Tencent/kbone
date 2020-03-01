const _ = require('./utils')

test('rich-text', async() => {
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
    node.setAttribute('behavior', 'rich-text')
    page.document.body.appendChild(node)
    await _.sleep(10)
    const richText = body.querySelector('.h5-wx-component')

    // nodes
    await _.checkArray(richText, node, 'nodes', 'nodes', [])

    // space
    await _.checkString(richText, node, 'space', 'space', '')

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
