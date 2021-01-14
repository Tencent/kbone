const mock = require('../mock')

const parser = require('../../src/tree/parser')

function getTokenizeResult(content) {
    const startStack = []
    const endStack = []
    const textStack = []

    parser.tokenize(content, {
        start(tagName, attrs, unary) {
            startStack.push({tagName, attrs, unary})
        },
        end(tagName) {
            endStack.push(tagName)
        },
        text(content) {
            content = content.trim()
            if (content) textStack.push(content)
        },
    })

    return {startStack, endStack, textStack}
}

test('tokenize html', () => {
    const res1 = getTokenizeResult('<div><br/></div>')
    expect(res1.startStack.length).toBe(2)
    expect(res1.endStack.length).toBe(1)
    expect(res1.textStack.length).toBe(0)
    expect(res1.startStack).toEqual([{tagName: 'div', attrs: [], unary: false}, {tagName: 'br', attrs: [], unary: true}])
    expect(res1.endStack).toEqual(['div'])

    const res2 = getTokenizeResult(`
    <div><br/></div>
    <div id="a" class="xx">123123</div>
    <input id="b" type="checkbox" checked/>
    <div>
      <ul>
        <li><span>123</span></li>
        <li><span>321</span></li>
        <li><span>567</span></li>
      </ul>
    </div>
  `)
    expect(res2.startStack.length).toBe(12)
    expect(res2.endStack.length).toBe(10)
    expect(res2.textStack.length).toBe(4)
    expect(res2.startStack).toEqual([
        {tagName: 'div', attrs: [], unary: false},
        {tagName: 'br', attrs: [], unary: true},
        {tagName: 'div', attrs: [{name: 'id', value: 'a'}, {name: 'class', value: 'xx'}], unary: false},
        {tagName: 'input', attrs: [{name: 'id', value: 'b'}, {name: 'type', value: 'checkbox'}, {name: 'checked', value: undefined}], unary: true},
        {tagName: 'div', attrs: [], unary: false},
        {tagName: 'ul', attrs: [], unary: false},
        {tagName: 'li', attrs: [], unary: false},
        {tagName: 'span', attrs: [], unary: false},
        {tagName: 'li', attrs: [], unary: false},
        {tagName: 'span', attrs: [], unary: false},
        {tagName: 'li', attrs: [], unary: false},
        {tagName: 'span', attrs: [], unary: false}
    ])
    expect(res2.endStack).toEqual(['div', 'div', 'span', 'li', 'span', 'li', 'span', 'li', 'ul', 'div'])
    expect(res2.textStack).toEqual(['123123', '123', '321', '567'])

    const res3 = getTokenizeResult(`
    <div>123</div>
    <script type="text/javascript">
      var msg = "hello world";
      console.log(msg);
    </script>
    <span>haha</span>
    <div>321</div>
  `)
    expect(res3.startStack.length).toBe(4)
    expect(res3.endStack.length).toBe(4)
    expect(res3.textStack.length).toBe(4)
    expect(res3.startStack).toEqual([
        {tagName: 'div', attrs: [], unary: false},
        {tagName: 'script', attrs: [{name: 'type', value: 'text/javascript'}], unary: false},
        {tagName: 'span', attrs: [], unary: false},
        {tagName: 'div', attrs: [], unary: false}
    ])
    expect(res3.endStack).toEqual(['div', 'script', 'span', 'div'])
    expect(res3.textStack).toEqual(['123', 'var msg = "hello world";\n      console.log(msg);', 'haha', '321'])

    const res4 = getTokenizeResult('<180abc')
    expect(res4.startStack.length).toBe(0)
    expect(res4.endStack.length).toBe(0)
    expect(res4.textStack.length).toBe(1)
    expect(res4.textStack).toEqual(['&lt;180abc'])

    const res5 = getTokenizeResult('1>80abc')
    expect(res5.startStack.length).toBe(0)
    expect(res5.endStack.length).toBe(0)
    expect(res5.textStack.length).toBe(1)
    expect(res5.textStack).toEqual(['1&gt;80abc'])

    const res6 = getTokenizeResult('1>80ab<cd<')
    expect(res6.startStack.length).toBe(0)
    expect(res6.endStack.length).toBe(0)
    expect(res6.textStack.length).toBe(1)
    expect(res6.textStack).toEqual(['1&gt;80ab&lt;cd&lt;'])

    const res7 = getTokenizeResult('<>180abcd<>')
    expect(res7.startStack.length).toBe(0)
    expect(res7.endStack.length).toBe(0)
    expect(res7.textStack.length).toBe(1)
    expect(res7.textStack).toEqual(['&lt;&gt;180abcd&lt;&gt;'])
})

test('parse html', () => {
    const res = parser.parse(mock.html)

    expect(res).toEqual([{
        type: 'element',
        tagName: 'div',
        attrs: [{name: 'class', value: 'aa'}],
        unary: false,
        children: [{
            type: 'element',
            tagName: 'div',
            attrs: [{name: 'id', value: 'bb'}, {name: 'class', value: 'bb'}],
            unary: false,
            children: [{
                type: 'element',
                tagName: 'header',
                attrs: [],
                unary: false,
                children: [{
                    type: 'element',
                    tagName: 'div',
                    attrs: [{name: 'class', value: 'bb1'}, {name: 'name', value: 'n1'}],
                    unary: false,
                    children: [{type: 'text', content: '123'}]
                }, {
                    type: 'element',
                    tagName: 'div',
                    attrs: [{name: 'class', value: 'bb2'}, {name: 'data-a', value: '123'}],
                    unary: false,
                    children: [{type: 'text', content: '321'}]
                }],
            }, {
                type: 'element',
                tagName: 'div',
                attrs: [{name: 'class', value: 'bb3'}],
                unary: false,
                children: [{type: 'text', content: 'middle'}],
            }, {
                type: 'element',
                tagName: 'footer',
                attrs: [],
                unary: false,
                children: [{
                    type: 'element',
                    tagName: 'span',
                    attrs: [{name: 'id', value: 'bb4'}, {name: 'class', value: 'bb4'}, {name: 'name', value: 'n1'}, {name: 'data-index', value: '1'}],
                    unary: false,
                    children: [{type: 'text', content: '1'}],
                }, {
                    type: 'element',
                    tagName: 'span',
                    attrs: [{name: 'class', value: 'bb4'}, {name: 'name', value: 'n2'}, {name: 'data-index', value: '2'}],
                    unary: false,
                    children: [{type: 'text', content: '2'}],
                }, {
                    type: 'element',
                    tagName: 'span',
                    attrs: [{name: 'class', value: 'bb4'}, {name: 'data-index', value: '3'}],
                    unary: false,
                    children: [{type: 'text', content: '3'}],
                }],
            }, {
                type: 'element',
                tagName: 'div',
                attrs: [],
                unary: false,
                children: [{type: 'text', content: 'tail'}],
            }, {
                type: 'element',
                tagName: 'wx-component',
                attrs: [{name: 'behavior', value: 'view'}],
                unary: false,
                children: [{type: 'text', content: 'test wx-view'}],
            }, {
                type: 'element',
                tagName: 'wx-component',
                attrs: [{name: 'behavior', value: 'text'}],
                unary: false,
                children: [{type: 'text', content: 'test wx-text'}],
            }, {
                type: 'element',
                tagName: 'div',
                attrs: [{name: 'data-key', value: 'value'}],
                unary: false,
                children: [],
            }],
        }],
    }])
})
