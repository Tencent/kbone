const _ = require('../src/util/tool')

test('tool.getDiffChildNodes', () => {
    // 相等
    let newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}],
    }]
    let oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}],
    }]
    let destData = {count: 0}
    let isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(0)

    // 节点新增
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}, {text: 'haha', type: 'text'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[1].childNodes[1]'])
    expect(destData['childNodes[1].childNodes[1]']).toEqual({text: 'haha', type: 'text'})

    // 节点删除
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}, {content: 'haha', type: 'text'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[1].childNodes'])
    expect(destData['childNodes[1].childNodes']).toEqual([{id: 4, className: 'aa', type: 'element'}])

    // 节点修改
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'bb', type: 'element'}],
    }, {
        id: 3,
        type: 'element',
        childNodes: [{id: 4, className: 'aa', type: 'element'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, className: 'aa', type: 'element'}],
    }, {
        id: 5,
        type: 'element',
        childNodes: [{id: 6, className: 'aa', type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(3)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].className', 'childNodes[1].childNodes[0].id', 'childNodes[1].id'])
    expect(destData['childNodes[0].childNodes[0].className']).toBe('bb')
    expect(destData['childNodes[1].childNodes[0].id']).toBe(4)
    expect(destData['childNodes[1].id']).toBe(3)
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, type: 'element'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, content: 'test', type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].content'])
    expect(destData['childNodes[0].childNodes[0].content']).toBe(null)
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, extra: null, type: 'element'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, extra: {}, type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].extra'])
    expect(destData['childNodes[0].childNodes[0].extra']).toBe(null)

    // 强制更新
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text'}
        }],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text'}
        }],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(0)
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'number'}
        }],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text'}
        }],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].extra.type'])
    expect(destData['childNodes[0].childNodes[0].extra.type']).toBe('number')
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text', forceUpdate: true}
        }],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text', forceUpdate: false}
        }],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].extra'])
    expect(destData['childNodes[0].childNodes[0].extra']).toEqual({type: 'text', forceUpdate: false})
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text', forceUpdate: false}
        }],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, className: 'aa', type: 'element', extra: {type: 'text', forceUpdate: false}
        }],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(0)

    // 非标准节点属性更新
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{
            id: 2, class: 'bb', dd: 'haha', type: 'element'
        }],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, class: 'aa', type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(0)

    // 文本节点
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{content: 'hehe', type: 'text'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{content: 'haha', type: 'text'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0].content'])
    expect(destData['childNodes[0].childNodes[0].content']).toBe('hehe')

    // 节点类型变化
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, type: 'element'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{content: 'haha', type: 'text'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0]'])
    expect(destData['childNodes[0].childNodes[0]']).toEqual({id: 2, type: 'element'})
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{content: 'haha', type: 'text'}],
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(1)
    expect(Object.keys(destData)).toEqual(['count', 'childNodes[0].childNodes[0]'])
    expect(destData['childNodes[0].childNodes[0]']).toEqual({content: 'haha', type: 'text'})

    // 节点修改组合
    newChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [
            {content: 'haha', type: 'text'},
            {id: 3, type: 'element'},
            {id: 4, type: 'element'},
            {id: 5, type: 'element'},
            {id: 7, type: 'element'},
            {id: 8, type: 'element', extra: {x: 1, y: 2, scale: true}},
        ],
        extra: {
            aa: '123',
            bb: 321,
            dd: [{haha: 123}],
        },
    }, {
        id: 2,
        type: 'element',
    }]
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [
            {id: 2, type: 'element'},
            {id: 3, type: 'element'},
            {id: 5, type: 'element'},
            {id: 4, type: 'element'},
            {id: 6, type: 'element'},
            {id: 8, type: 'element', extra: {x: 1, y: 3, scale: false}},
        ],
        extra: {
            aa: '321',
            cc: true,
            dd: {haha: 123},
        },
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(undefined)
    expect(destData.count).toBe(11)
    expect(Object.keys(destData)).toEqual([
        'count',
        'childNodes[0].childNodes[0]',
        'childNodes[0].childNodes[2].id',
        'childNodes[0].childNodes[3].id',
        'childNodes[0].childNodes[4].id',
        'childNodes[0].childNodes[5].extra.y',
        'childNodes[0].childNodes[5].extra.scale',
        'childNodes[0].extra.aa',
        'childNodes[0].extra.bb',
        'childNodes[0].extra.dd',
        'childNodes[0].extra.cc',
        'childNodes[1]'
    ])
    expect(destData['childNodes[0].childNodes[0]']).toEqual({content: 'haha', type: 'text'})
    expect(destData['childNodes[0].childNodes[2].id']).toBe(4)
    expect(destData['childNodes[0].childNodes[3].id']).toBe(5)
    expect(destData['childNodes[0].childNodes[4].id']).toBe(7)
    expect(destData['childNodes[0].childNodes[5].extra.y']).toBe(2)
    expect(destData['childNodes[0].childNodes[5].extra.scale']).toBe(true)
    expect(destData['childNodes[0].extra.aa']).toBe('123')
    expect(destData['childNodes[0].extra.bb']).toBe(321)
    expect(destData['childNodes[0].extra.dd']).toEqual([{haha: 123}])
    expect(destData['childNodes[0].extra.cc']).toBe(null)
    expect(destData['childNodes[1]']).toEqual({id: 2, type: 'element'})

    // key 数量超过阈值，中断
    let id = 1
    newChildNodes = (new Array(105)).join(',').split(',').map(() => ({
        id: id++,
        type: 'element',
        childNodes: [{content: 'haha', type: 'text'}],
    }))
    oldChildNodes = [{
        id: 1,
        type: 'element',
        childNodes: [{id: 2, type: 'element'}],
    }]
    destData = {count: 0}
    isInterrupt = _.getDiffChildNodes(newChildNodes, oldChildNodes, destData, 'childNodes')
    expect(isInterrupt).toBe(true)
    expect(destData.count).toBe(102)
})
