const _ = require('./utils')

test('navigator', async() => {
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
    node.setAttribute('behavior', 'navigator')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // target
    await _.checkString(body, node, 'target', 'target', 'self')

    // url
    await _.checkString(body, node, 'url', 'url', '')

    // openType
    await _.checkString(body, node, 'openType', 'open-type', 'navigate')

    // delta
    await _.checkNumber(body, node, 'delta', 'delta', 1)

    // appId
    await _.checkString(body, node, 'appId', 'app-id', '')

    // path
    await _.checkString(body, node, 'path', 'path', '')

    // extraData
    expect(body.data.childNodes[0].extra.extraData).toEqual({})
    node.setAttribute('extra-data', {a: 123, b: 321})
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.extraData).toEqual({a: 123, b: 321})
    node.setAttribute('extra-data', undefined)
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.extraData).toEqual({a: null, b: null})

    // version
    await _.checkString(body, node, 'version', 'version', 'release')

    // hoverClass
    await _.checkString(body, node, 'hoverClass', 'hover-class', 'navigator-hover')

    // hoverStopPropagation
    await _.checkBoolean(body, node, 'hoverStopPropagation', 'hover-stop-propagation', false)

    // hoverStartTime
    await _.checkNumber(body, node, 'hoverStartTime', 'hover-start-time', 50)

    // hoverStayTime
    await _.checkNumber(body, node, 'hoverStayTime', 'hover-stay-time', 600)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['success', 'fail', 'complete'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
