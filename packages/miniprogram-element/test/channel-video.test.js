const _ = require('./utils')

test('channel-video', async() => {
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
    node.setAttribute('behavior', 'channel-video')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // feedId
    await _.checkString(body, node, 'feedId', 'feed-id', '')

    // finderUserName
    await _.checkString(body, node, 'finderUserName', 'finder-user-name', '')

    // feedToken
    await _.checkString(body, node, 'feedToken', 'feed-token', '')

    // autoplay
    await _.checkBoolean(body, node, 'autoplay', 'autoplay', false)

    // loop
    await _.checkBoolean(body, node, 'loop', 'loop', false)

    // muted
    await _.checkBoolean(body, node, 'muted', 'muted', false)

    // objectFit
    await _.checkString(body, node, 'objectFit', 'object-fit', 'contain')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['error'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
