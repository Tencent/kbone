const _ = require('./utils')

test('store-product', async() => {
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
    node.setAttribute('behavior', 'store-product')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // appid
    await _.checkString(body, node, 'appid', 'appid', '')

    // productId
    await _.checkString(body, node, 'productId', 'product-id', '')

    // productPromotionLink
    await _.checkString(body, node, 'productPromotionLink', 'product-promotion-link', '')

    // mediaId
    await _.checkString(body, node, 'mediaId', 'media-id', '')

    // customStyle
    expect(_.getData(body).customStyle).toEqual({})
    node.setAttribute('custom-style', {
        card: {'background-color': '#FAFAFA'},
        title: {color: 'rgba(0, 0, 0, 0.8)'},
    })
    await _.sleep(10)
    expect(_.getData(body).customStyle).toEqual({
        card: {'background-color': '#FAFAFA'},
        title: {color: 'rgba(0, 0, 0, 0.8)'},
    })
    node.setAttribute('custom-style', JSON.stringify({
        price: {color: '#FF6146'},
        'buy-button': {
            width: '100px',
            'border-radius': '30px',
            'background-color': 'rgba(0, 0, 0, 0.9)',
            color: '#FFD48D',
        },
    }))
    await _.sleep(10)
    expect(_.getData(body).customStyle).toMatchObject({
        price: {color: '#FF6146'},
        'buy-button': {
            width: '100px',
            'border-radius': '30px',
            'background-color': 'rgba(0, 0, 0, 0.9)',
            color: '#FFD48D',
        },
    })

    // customContent
    await _.checkBoolean(body, node, 'customContent', 'custom-content', false)

    // openPage
    await _.checkString(body, node, 'openPage', 'open-page', 'product-detail')

    // logoPosition
    await _.checkString(body, node, 'logoPosition', 'logo-position', 'bottom-left')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['entersuccess', 'entererror'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
