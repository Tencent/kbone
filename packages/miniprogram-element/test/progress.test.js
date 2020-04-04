const _ = require('./utils')

test('progress', async() => {
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
    node.setAttribute('behavior', 'progress')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // percent
    await _.checkNumber(body, node, 'percent', 'percent', 0)

    // showInfo
    await _.checkBoolean(body, node, 'showInfo', 'show-info', false)

    // borderRadius
    await _.checkString(body, node, 'borderRadius', 'border-radius', '0')

    // fontSize
    await _.checkString(body, node, 'fontSize', 'font-size', '16')

    // strokeWidth
    await _.checkString(body, node, 'strokeWidth', 'stroke-width', '6')

    // color
    await _.checkString(body, node, 'color', 'color', '#09BB07')

    // activeColor
    await _.checkString(body, node, 'activeColor', 'active-color', '#09BB07')

    // backgroundColor
    await _.checkString(body, node, 'backgroundColor', 'background-color', '#EBEBEB')

    // active
    await _.checkBoolean(body, node, 'active', 'active', false)

    // activeMode
    await _.checkString(body, node, 'activeMode', 'active-mode', 'backwards')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['activeend'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
