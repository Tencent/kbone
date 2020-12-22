const _ = require('./utils')

test('scroll-view', async() => {
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
    node.setAttribute('behavior', 'scroll-view')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // scrollX
    await _.checkBoolean(body, node, 'scrollX', 'scroll-x', false)

    // scrollY
    await _.checkBoolean(body, node, 'scrollY', 'scroll-y', false)

    // upperThreshold
    await _.checkString(body, node, 'upperThreshold', 'upper-threshold', '50')

    // lowerThreshold
    await _.checkString(body, node, 'lowerThreshold', 'lower-threshold', '50')

    // scrollTop
    await _.checkString(body, node, 'scrollTop', 'scroll-top', '')

    // scrollLeft
    await _.checkString(body, node, 'scrollLeft', 'scroll-left', '')

    // scrollWithAnimation
    await _.checkBoolean(body, node, 'scrollWithAnimation', 'scroll-with-animation', false)

    // enableBackToTop
    await _.checkBoolean(body, node, 'enableBackToTop', 'enable-back-to-top', false)

    // enableFlex
    await _.checkBoolean(body, node, 'enableFlex', 'enable-flex', false)

    // scrollAnchoring
    await _.checkBoolean(body, node, 'scrollAnchoring', 'scroll-anchoring', false)

    // refresherEnabled
    await _.checkBoolean(body, node, 'refresherEnabled', 'refresher-enabled', false)

    // refresherThreshold
    await _.checkString(body, node, 'refresherThreshold', 'refresher-threshold', '45')

    // refresherDefaultStyle
    await _.checkString(body, node, 'refresherDefaultStyle', 'refresher-default-style', 'black')

    // refresherBackground
    await _.checkString(body, node, 'refresherBackground', 'refresher-background', '#FFF')

    // refresherTriggered
    node.setAttribute('refresher-enabled', true)
    await _.checkBoolean(body, node, 'refresherTriggered', 'refresher-triggered', false)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['scrolltoupper', 'scrolltolower', 'refresherpulling', 'refresherrefresh', 'refresherrestore', 'refresherabort'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
