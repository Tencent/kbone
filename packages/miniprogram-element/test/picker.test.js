const _ = require('./utils')

test('picker', async() => {
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
    node.setAttribute('behavior', 'picker')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // header-text
    await _.checkString(body, node, 'headerText', 'header-text', '')

    // mode
    await _.checkString(body, node, 'mode', 'mode', 'selector')

    // disabled
    await _.checkBoolean(body, node, 'disabled', 'disabled', false)

    // range
    await _.checkArray(body, node, 'range', 'range', [], ['美国', '中国', '巴西', '日本'])

    // rangeKey
    await _.checkString(body, node, 'rangeKey', 'range-key', '')

    // value
    node.setAttribute('mode', '')
    await _.sleep(10)
    await _.checkNumber(body, node, 'value', 'value', 0)
    node.setAttribute('mode', 'selector')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    await _.checkNumber(body, node, 'value', 'value', 0)
    node.setAttribute('mode', 'multiSelector')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    await _.checkArray(body, node, 'value', 'value', [], [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']])
    node.setAttribute('mode', 'time')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    await _.checkString(body, node, 'value', 'value', '')
    node.setAttribute('mode', 'date')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    await _.checkString(body, node, 'value', 'value', '0')
    node.setAttribute('mode', 'region')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.value).toEqual([])
    const value = ['广东省', '广州市', '海珠区']
    node.setAttribute('value', value)
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.value).toEqual(value)
    node.setAttribute('value', [])
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.value).toEqual([])
    node.setAttribute('value', undefined)
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.value).toEqual([])

    // start
    await _.checkString(body, node, 'start', 'start', '')

    // end
    await _.checkString(body, node, 'end', 'end', '')

    // fields
    await _.checkString(body, node, 'fields', 'fields', 'day')

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['change', 'columnchange', 'cancel'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
