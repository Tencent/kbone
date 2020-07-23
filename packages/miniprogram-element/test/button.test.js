const _ = require('./utils')

test('button', async() => {
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
    node.setAttribute('behavior', 'button')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // size
    await _.checkString(body, node, 'size', 'size', 'default')

    // type
    await _.checkString(body, node, 'type', 'type', undefined)

    // plain
    await _.checkBoolean(body, node, 'plain', 'plain', false)

    // disabled
    await _.checkBoolean(body, node, 'disabled', 'disabled', false)

    // loading
    await _.checkBoolean(body, node, 'loading', 'loading', false)

    // formType
    await _.checkString(body, node, 'formType', 'form-type', '')

    // openType
    await _.checkString(body, node, 'openType', 'open-type', '')

    // hoverClass
    await _.checkString(body, node, 'hoverClass', 'hover-class', 'button-hover')

    // hoverStopPropagation
    await _.checkBoolean(body, node, 'hoverStopPropagation', 'hover-stop-propagation', false)

    // hoverStartTime
    await _.checkNumber(body, node, 'hoverStartTime', 'hover-start-time', 20)

    // hoverStayTime
    await _.checkNumber(body, node, 'hoverStayTime', 'hover-stay-time', 70)

    // lang
    await _.checkString(body, node, 'lang', 'lang', 'en')

    // sessionFrom
    await _.checkString(body, node, 'sessionFrom', 'session-from', '')

    // sendMessageTitle
    await _.checkString(body, node, 'sendMessageTitle', 'send-message-title', '')

    // sendMessagePath
    await _.checkString(body, node, 'sendMessagePath', 'send-message-path', '')

    // sendMessageImg
    await _.checkString(body, node, 'sendMessageImg', 'send-message-img', '')

    // appParameter
    await _.checkString(body, node, 'appParameter', 'app-parameter', '')

    // showMessageCard
    await _.checkBoolean(body, node, 'showMessageCard', 'show-message-card', false)

    // businessId
    await _.checkString(body, node, 'businessId', 'business-id', '')

    // shareType
    await _.checkNumber(body, node, 'shareType', 'share-type', 27)

    // shareMode
    await _.checkArray(body, node, 'shareMode', 'share-mode', undefined, ['qq', 'qzone'])

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting', 'launchapp', 'getrealnameauthinfo'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
