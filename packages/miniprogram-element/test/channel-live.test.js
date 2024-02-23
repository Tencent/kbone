const _ = require('./utils')

test('channel-live', async() => {
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
    node.setAttribute('behavior', 'channel-live')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // feedId
    await _.checkString(body, node, 'feedId', 'feed-id', '')

    // finderUserName
    await _.checkString(body, node, 'finderUserName', 'finder-user-name', '')

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
