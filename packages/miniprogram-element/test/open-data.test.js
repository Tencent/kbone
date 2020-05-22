const _ = require('./utils')

test('open-data', async() => {
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
    node.setAttribute('behavior', 'open-data')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // type
    await _.checkString(body, node, 'type', 'type', '')

    // openGid
    await _.checkString(body, node, 'openGid', 'open-gid', '')

    // lang
    await _.checkString(body, node, 'lang', 'lang', 'en')

    // defaultText
    await _.checkString(body, node, 'defaultText', 'default-text', '')

    // defaultAvatar
    await _.checkString(body, node, 'defaultAvatar', 'default-avatar', '')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['error'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
