const _ = require('./utils')

test('input', async() => {
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
    const node = page.document.createElement('input')
    page.document.body.appendChild(node)
    await _.sleep(10)
    const input = {data: body.data.childNodes[0].extra}

    // value
    await _.checkString(body, node, 'value', 'value', '', true)
    node.setAttribute('type', 'radio')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    expect(node.value).toBe('on')
    console.log('@@@@@@@', body.data.childNodes[0])
    expect(body.data.childNodes[0].extra.value).toBe('on')
    node.setAttribute('type', 'checkbox')
    node.setAttribute('value', undefined)
    await _.sleep(10)
    expect(node.value).toBe('on')
    expect(body.data.childNodes[0].extra.value).toBe('on')
    node.setAttribute('type', undefined)
    await _.sleep(10)

    // type
    expect(body.data.childNodes[0].extra.type).toBe('text')
    node.setAttribute('type', '')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('text')
    node.setAttribute('type', 'number')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('number')
    node.setAttribute('type', 'text')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('text')
    node.setAttribute('type', 'digit')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('digit')

    // password
    expect(body.data.childNodes[0].extra.password).toBe(false)
    node.setAttribute('type', 'password')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('text')
    expect(body.data.childNodes[0].extra.password).toBe(true)
    node.setAttribute('type', '')
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('text')
    expect(body.data.childNodes[0].extra.password).toBe(false)
    node.setAttribute('password', true)
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.type).toBe('text')
    expect(body.data.childNodes[0].extra.password).toBe(true)

    // placeholder
    await _.checkString(input, node, 'placeholder', 'placeholder', '')

    // placeholderStyle
    await _.checkString(input, node, 'placeholderStyle', 'placeholder-style', '')

    // placeholderClass
    await _.checkString(input, node, 'placeholderClass', 'placeholder-class', 'input-placeholder')

    // disabled
    await _.checkBoolean(input, node, 'disabled', 'disabled', false)

    // maxlength
    await _.checkNumber(input, node, 'maxlength', 'maxlength', 140)

    // cursorSpacing
    await _.checkNumber(input, node, 'cursorSpacing', 'cursor-spacing', 0)

    // autoFocus
    await _.checkBoolean(input, node, 'autoFocus', 'autofocus', false)

    // focus
    await _.checkBoolean(input, node, 'focus', 'focus', false)
    node.focus()
    await _.sleep(10)
    expect(input.data.focus).toBe(true)
    node.blur()
    await _.sleep(10)
    expect(input.data.focus).toBe(false)

    // confirmType
    await _.checkString(input, node, 'confirmType', 'confirm-type', 'done')

    // confirmHold
    await _.checkBoolean(input, node, 'confirmHold', 'confirm-hold', false)

    // cursor
    await _.checkNumber(input, node, 'cursor', 'cursor', -1)

    // selectionStart
    await _.checkNumber(input, node, 'selectionStart', 'selection-start', -1)

    // selectionEnd
    await _.checkNumber(input, node, 'selectionEnd', 'selection-end', -1)

    // adjustPosition
    await _.checkBoolean(input, node, 'adjustPosition', 'adjust-position', true)

    // checked
    await _.checkBoolean(input, node, 'checked', 'checked', false)

    // event
    const wxInput = input.querySelector('.wx-comp-input')
    await _.checkEvent(wxInput, node, ['input', 'focus', 'blur', 'confirm', 'keyboardheightchange'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
