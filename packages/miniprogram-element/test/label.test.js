const _ = require('./utils')

test('label', async() => {
    const page = global.$$page
    const componentId = _.load({
        template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
        usingComponents: {
            element: _.load('index', 'element'),
        },
    }, 'page')
    const component = _.render(componentId)

    const wrapper = document.createElement('wrapper')
    document.body.appendChild(wrapper)
    component.attach(wrapper)
    expect(_.match(component.dom, `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`)).toBe(true)

    const body = component.querySelector('.h5-body')
    const node = page.document.createElement('label')
    page.document.body.appendChild(node)
    await _.sleep(10)
    const label = body.querySelector('.h5-label')

    // for
    await _.checkString(label, node, 'for', 'for', '')

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
