const loader = require('../src/index')

function getSimpleHTML(html) {
    return html.trim().replace(/(?:(<|>)[\n\r\s\t]+)|(?:[\n\r\s\t]+(<|>))/g, '$1$2').replace(/[\n\r\t]+/g, '')
}

test('check-reduce', () => {
    expect(getSimpleHTML(loader(`
        <template>
            <div>
                <template #header>
                    <h1>Here might be a page title</h1>
                </template>
                <div>
                    <a><span></span><p>1</p></a>
                    <a><span></span><p>2</p></a>
                    <a><span></span><p>3</p></a>
                </div>
                <div check-reduce>
                    <span>123</span>
                </div>
            </div>
        </template>
    `))).toBe('<template><div><template #header><h1>Here might be a page title</h1></template><div><a><span></span><p>1</p></a><a><span></span><p>2</p></a><a><span></span><p>3</p></a></div></div></template>')

    // TODO
})

test('check-replace-tagname', () => {
    // TODO
})
