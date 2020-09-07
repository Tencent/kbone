const _ = require('./utils')

test('textarea', async() => {
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
    const node = page.document.createElement('textarea')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // value
    await _.checkString(body, node, 'value', 'value', '')

    // placeholder
    await _.checkString(body, node, 'placeholder', 'placeholder', '')

    // placeholderStyle
    await _.checkString(body, node, 'placeholderStyle', 'placeholder-style', '')

    // placeholderClass
    await _.checkString(body, node, 'placeholderClass', 'placeholder-class', 'textarea-placeholder')

    // disabled
    await _.checkBoolean(body, node, 'disabled', 'disabled', false)

    // maxlength
    await _.checkNumber(body, node, 'maxlength', 'maxlength', 140)

    // autoFocus
    await _.checkBoolean(body, node, 'autoFocus', 'autofocus', false)

    // focus
    await _.checkBoolean(body, node, 'focus', 'focus', false)
    node.focus()
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.focus).toBe(true)
    node.blur()
    await _.sleep(10)
    expect(body.data.childNodes[0].extra.focus).toBe(false)

    // autoHeight
    await _.checkBoolean(body, node, 'autoHeight', 'auto-height', false)

    // fixed
    await _.checkBoolean(body, node, 'fixed', 'fixed', false)

    // cursorSpacing
    await _.checkNumber(body, node, 'cursorSpacing', 'cursor-spacing', 0)

    // cursor
    await _.checkNumber(body, node, 'cursor', 'cursor', -1)

    // showConfirmBar
    await _.checkBoolean(body, node, 'showConfirmBar', 'show-confirm-bar', true)

    // selectionStart
    await _.checkNumber(body, node, 'selectionStart', 'selection-start', -1)

    // selectionEnd
    await _.checkNumber(body, node, 'selectionEnd', 'selection-end', -1)

    // adjustPosition
    await _.checkBoolean(body, node, 'adjustPosition', 'adjust-position', true)

    // hold-keyboard
    await _.checkBoolean(body, node, 'holdKeyboard', 'hold-keyboard', false)

    // disable-default-padding
    await _.checkBoolean(body, node, 'disableDefaultPadding', 'disable-default-padding', false)

    // event
    await _.checkEvent(body.querySelector('.h5-textarea'), node, ['focus', 'blur', 'linechange', 'input', 'confirm', 'keyboardheightchange'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
