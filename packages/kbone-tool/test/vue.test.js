window.$$global = {}

const kboneTool = require('../dist/index.min')

test('useGlobal', () => {
    kboneTool.vue.useGlobal()
    let count = 0
    const state = {
        count: 0,
        info: {},
        list: [],
    }

    // __ob__ 处理
    const setOb = pageId => {
        document.$$pageId = pageId
        const ob = {
            dep: {
                notify() {
                    state.list.push(`ob-${pageId}-${count++}`)
                },
            },
        }
        Object.defineProperty(state.list, '__ob__', {
            value: ob,
            enumerable: false,
            writable: true,
            configurable: true
        })
    }
    const rmOb = pageId => {
        document.$$pageId = pageId
        window.dispatchEvent(new window.CustomEvent('wxunload'))
    }
    state.list._callNotify = function() {
        if (this.__ob__) this.__ob__.dep.notify()
    }

    setOb('a')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0'])

    setOb('b')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0', 'ob-a-1', 'ob-b-2'])

    setOb('c')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0', 'ob-a-1', 'ob-b-2', 'ob-a-3', 'ob-b-4', 'ob-c-5'])

    rmOb('b')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0', 'ob-a-1', 'ob-b-2', 'ob-a-3', 'ob-b-4', 'ob-c-5', 'ob-a-6', 'ob-c-7'])

    rmOb('a')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0', 'ob-a-1', 'ob-b-2', 'ob-a-3', 'ob-b-4', 'ob-c-5', 'ob-a-6', 'ob-c-7', 'ob-c-8'])

    rmOb('c')
    state.list._callNotify()
    expect([...state.list]).toEqual(['ob-a-0', 'ob-a-1', 'ob-b-2', 'ob-a-3', 'ob-b-4', 'ob-c-5', 'ob-a-6', 'ob-c-7', 'ob-c-8'])
})
