const _ = require('./utils')

test('swiper', async() => {
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
    node.setAttribute('behavior', 'swiper')
    node.innerHTML = `
        <wx-swiper-item item-id="1"><span>1</span></wx-swiper-item>
        <wx-swiper-item item-id="2"><span>2</span></wx-swiper-item>
        <wx-swiper-item><span>3</span></wx-swiper-item>
        <div>123</div>
    `
    page.document.body.appendChild(node)
    await _.sleep(10)
    const swiper = body.querySelector('.h5-wx-component')

    // 检查 swiper-item
    expect(swiper.dom.childNodes.length).toBe(3)
    expect(swiper.dom.childNodes[0].childNodes[0].classList.contains('element-vhost--h5-span')).toBe(true)
    expect(swiper.dom.childNodes[0].childNodes[0].innerHTML).toBe('1')
    expect(swiper.dom.childNodes[1].childNodes[0].classList.contains('element-vhost--h5-span')).toBe(true)
    expect(swiper.dom.childNodes[1].childNodes[0].innerHTML).toBe('2')
    expect(swiper.dom.childNodes[2].childNodes[0].classList.contains('element-vhost--h5-span')).toBe(true)
    expect(swiper.dom.childNodes[2].childNodes[0].innerHTML).toBe('3')
    expect(body.data.childNodes[0].extra.childNodes[0].extra).toEqual({hidden: false, itemId: '1'})
    expect(body.data.childNodes[0].extra.childNodes[1].extra).toEqual({hidden: false, itemId: '2'})
    expect(body.data.childNodes[0].extra.childNodes[2].extra).toEqual({hidden: false, itemId: ''})

    // indicator-dots
    await _.checkBoolean(body, node, 'indicatorDots', 'indicator-dots', false)

    // indicator-color
    await _.checkString(body, node, 'indicatorColor', 'indicator-color', 'rgba(0, 0, 0, .3)')

    // indicator-active-color
    await _.checkString(body, node, 'indicatorActiveColor', 'indicator-active-color', '#000000')

    // autoplay
    await _.checkBoolean(body, node, 'autoplay', 'autoplay', false)

    // current
    await _.checkNumber(body, node, 'current', 'current', 0)

    // interval
    await _.checkNumber(body, node, 'interval', 'interval', 5000)

    // duration
    await _.checkNumber(body, node, 'duration', 'duration', 500)

    // circular
    await _.checkBoolean(body, node, 'circular', 'circular', false)

    // vertical
    await _.checkBoolean(body, node, 'vertical', 'vertical', false)

    // previous-margin
    await _.checkString(body, node, 'previousMargin', 'previous-margin', '0px')

    // next-margin
    await _.checkString(body, node, 'nextMargin', 'next-margin', '0px')

    // snap-to-edge
    await _.checkBoolean(body, node, 'snapToEdge', 'snap-to-edge', false)

    // display-multiple-items
    await _.checkNumber(body, node, 'displayMultipleItems', 'display-multiple-items', 1)

    // skip-hidden-item-layout
    await _.checkBoolean(body, node, 'skipHiddenItemLayout', 'skip-hidden-item-layout', false)

    // easing-function
    await _.checkString(body, node, 'easingFunction', 'easing-function', 'default')

    // event
    await _.checkEvent(swiper, node, ['change', 'transition', 'animationfinish'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
