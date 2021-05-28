const _ = require('./utils')

test('page-container', async() => {
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
    node.setAttribute('behavior', 'page-container')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // show
    await _.checkBoolean(body, node, 'show', 'show', false)

    // duration
    await _.checkNumber(body, node, 'duration', 'duration', 300)

    // zIndex
    await _.checkNumber(body, node, 'zIndex', 'z-index', 100)

    // overlay
    await _.checkBoolean(body, node, 'overlay', 'overlay', true)

    // position
    await _.checkString(body, node, 'position', 'position', 'bottom')

    // round
    await _.checkBoolean(body, node, 'round', 'round', false)

    // closeOnSlideDown
    await _.checkBoolean(body, node, 'closeOnSlideDown', 'close-on-slideDown', false)

    // overlayStyle
    await _.checkString(body, node, 'overlayStyle', 'overlay-style', '')

    // customStyle
    await _.checkString(body, node, 'customStyle', 'custom-style', '')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['beforeenter', 'enter', 'afterenter', 'beforeleave', 'leave', 'afterleave', 'clickoverlay'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
