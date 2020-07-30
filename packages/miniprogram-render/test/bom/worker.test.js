/* eslint-disable no-new */
const mock = require('../mock')

let window
let window2

beforeAll(() => {
    window = mock.createPage('home').window
    window2 = mock.createPage('list').window
})

test('worker', () => {
    let errCount = 0
    let evt1 = null
    let evt2 = null
    let msgCount1 = 0
    let msgCount2 = 0
    const handler = evt => {
        msgCount2++
        evt2 = evt
    }

    // worker
    global.workerScript = `
        let count = 0

        onmessage = evt => {
            count++
            postMessage({from: 'worker', to: evt.data.from, count, receive: evt})
        }
    `
    const worker1 = new window.Worker('')
    worker1.onmessage = evt => {
        msgCount1++
        evt1 = evt
    }
    worker1.onerror = () => errCount++
    worker1.addEventListener('message', handler)
    expect(evt1).toBe(null)
    expect(evt2).toBe(null)
    worker1.postMessage({from: 'test', to: 'worker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'worker', to: 'test', count: 1, receive: {type: 'message', data: {from: 'test', to: 'worker'}}
    })
    expect(evt2.data).toEqual(evt1.data)
    worker1.postMessage({from: 'test2', to: 'worker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'worker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'worker'}}
    })
    expect(evt2.data).toEqual(evt1.data)
    worker1.removeEventListener('message', handler)
    worker1.postMessage({from: 'test3', to: 'worker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'worker', to: 'test3', count: 3, receive: {type: 'message', data: {from: 'test3', to: 'worker'}}
    })
    expect(evt2.data).toEqual({
        from: 'worker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'worker'}}
    })
    worker1.terminate()
    worker1.postMessage({from: 'test4', to: 'worker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'worker', to: 'test3', count: 3, receive: {type: 'message', data: {from: 'test3', to: 'worker'}}
    })
    expect(evt2.data).toEqual({
        from: 'worker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'worker'}}
    })
    expect(msgCount1).toBe(3)
    expect(msgCount2).toBe(2)
    expect(errCount).toBe(0)

    errCount = 0
    evt1 = null
    evt2 = null
    msgCount1 = 0
    msgCount2 = 0
    let evt3 = null
    let evt4 = null
    let msgCount3 = 0
    let msgCount4 = 0
    const handler2 = evt => {
        msgCount4++
        evt4 = evt
    }

    // sharedWorker
    global.workerScript = `
        let count = 0

        onconnect = evt => {
            const port = evt.ports[0]

            port.addEventListener('message', evt => {
                count++
                port.postMessage({from: 'sharedWorker', to: evt.data.from, count, receive: evt})
            })

            port.start()
        }
    `
    const worker2 = new window.SharedWorker('a')
    worker2.port.onmessage = evt => {
        msgCount1++
        evt1 = evt
    }
    worker2.port.onerror = () => errCount++
    worker2.port.addEventListener('message', handler)
    const worker3 = new window.SharedWorker('a')
    worker3.port.onmessage = evt => {
        msgCount3++
        evt3 = evt
    }
    worker3.port.onerror = () => errCount++
    worker3.port.addEventListener('message', handler2)
    expect(evt1).toBe(null)
    expect(evt2).toBe(null)
    expect(evt3).toBe(null)
    expect(evt4).toBe(null)
    worker2.port.postMessage({from: 'test', to: 'sharedWorker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'sharedWorker', to: 'test', count: 1, receive: {type: 'message', data: {from: 'test', to: 'sharedWorker'}}
    })
    expect(evt2.data).toEqual(evt1.data)
    worker2.port.postMessage({from: 'test2', to: 'sharedWorker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    expect(evt2.data).toEqual(evt1.data)
    worker2.port.removeEventListener('message', handler)
    worker2.port.postMessage({from: 'test3', to: 'sharedWorker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'sharedWorker', to: 'test3', count: 3, receive: {type: 'message', data: {from: 'test3', to: 'sharedWorker'}}
    })
    expect(evt2.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    worker2.port.close()
    worker2.port.postMessage({from: 'test4', to: 'sharedWorker'})
    expect(evt1.type).toBe('message')
    expect(evt2.type).toBe(evt1.type)
    expect(evt1.data).toEqual({
        from: 'sharedWorker', to: 'test3', count: 3, receive: {type: 'message', data: {from: 'test3', to: 'sharedWorker'}}
    })
    expect(evt2.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 2, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    expect(msgCount1).toBe(3)
    expect(msgCount2).toBe(2)
    expect(errCount).toBe(0)
    expect(evt3.type).toBe('message')
    expect(evt4.type).toBe(evt3.type)
    expect(evt3.data).toEqual({
        from: 'sharedWorker', to: 'test4', count: 4, receive: {type: 'message', data: {from: 'test4', to: 'sharedWorker'}}
    })
    expect(evt4.data).toEqual(evt3.data)
    worker3.port.postMessage({from: 'test', to: 'sharedWorker'})
    expect(evt3.type).toBe('message')
    expect(evt4.type).toBe(evt3.type)
    expect(evt3.data).toEqual({
        from: 'sharedWorker', to: 'test', count: 5, receive: {type: 'message', data: {from: 'test', to: 'sharedWorker'}}
    })
    expect(evt4.data).toEqual(evt3.data)
    worker3.port.postMessage({from: 'test2', to: 'sharedWorker'})
    expect(evt3.type).toBe('message')
    expect(evt4.type).toBe(evt3.type)
    expect(evt3.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 6, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    expect(evt4.data).toEqual(evt3.data)
    worker3.port.removeEventListener('message', handler2)
    worker3.port.postMessage({from: 'test3', to: 'sharedWorker'})
    expect(evt3.type).toBe('message')
    expect(evt4.type).toBe(evt3.type)
    expect(evt3.data).toEqual({
        from: 'sharedWorker', to: 'test3', count: 7, receive: {type: 'message', data: {from: 'test3', to: 'sharedWorker'}}
    })
    expect(evt4.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 6, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    worker3.port.close()
    worker3.port.postMessage({from: 'test4', to: 'sharedWorker'})
    expect(evt3.type).toBe('message')
    expect(evt4.type).toBe(evt3.type)
    expect(evt3.data).toEqual({
        from: 'sharedWorker', to: 'test3', count: 7, receive: {type: 'message', data: {from: 'test3', to: 'sharedWorker'}}
    })
    expect(evt4.data).toEqual({
        from: 'sharedWorker', to: 'test2', count: 6, receive: {type: 'message', data: {from: 'test2', to: 'sharedWorker'}}
    })
    expect(msgCount3).toBe(7)
    expect(msgCount4).toBe(6)
    expect(errCount).toBe(0)

    // bom api
    global.workerScript = 'onmessage = evt => postMessage({navigator, location})'
    const worker4 = new window.Worker('')
    worker4.onmessage = evt => evt1 = evt
    worker4.postMessage('')
    expect(evt1.data).toEqual({
        navigator: {
            appCodeName: 'Mozilla',
            appName: 'Netscape',
            language: 'zh',
            languages: ['zh'],
            platform: 'devtools',
            product: 'Gecko',
            userAgent: 'Mozilla/5.0 (Windows NT 6.1; win64; x64) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile MicroMessenger/7.0.0 Language/zh',
        },
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: 'https:///',
            origin: 'https://',
            pathname: '/',
            port: '',
            protocol: 'https:',
            search: '',
        },
    })
    worker4.terminate()
    global.workerScript = `
        onconnect = evt => {
            const port = evt.ports[0]
            port.addEventListener('message', evt => port.postMessage({navigator, location}))
            port.start()
        }
    `
    const worker5 = new window.SharedWorker('')
    worker5.port.onmessage = evt => evt1 = evt
    worker5.port.postMessage('')
    expect(evt1.data).toEqual({
        navigator: undefined,
        location: undefined,
    })
    worker5.port.close()

    // 并发限制
    let testWorker = new window.Worker('')
    try {
        new window.Worker('')
    } catch (err) {
        errCount++
    }
    try {
        new window2.Worker('')
    } catch (err) {
        errCount++
    }
    try {
        new window.SharedWorker('a')
    } catch (err) {
        errCount++
    }
    try {
        new window2.SharedWorker('a')
    } catch (err) {
        errCount++
    }
    testWorker.terminate()
    expect(errCount).toBe(4)
    testWorker = new window.SharedWorker('a')
    try {
        new window.Wroker('')
    } catch (err) {
        errCount++
    }
    try {
        new window2.Wroker('')
    } catch (err) {
        errCount++
    }
    try {
        new window.SharedWorker('b')
    } catch (err) {
        errCount++
    }
    try {
        new window2.SharedWorker('b')
    } catch (err) {
        errCount++
    }
    expect(errCount).toBe(8)
    try {
        const testWorker2 = new window.SharedWorker('a')
        testWorker2.port.close()
    } catch (err) {
        errCount++
    }
    try {
        const testWorker2 = new window2.SharedWorker('a')
        testWorker2.port.close()
    } catch (err) {
        errCount++
    }
    expect(errCount).toBe(8)
    testWorker.port.close()

    // destroy
    new window2.Worker('')
    window2.$$destroy()
    testWorker = new window.Worker('') // 不会报错
    testWorker.terminate()
    window2 = mock.createPage('list').window
    new window2.SharedWorker('a')
    window2.$$destroy()
    testWorker = new window.Worker('') // 不会报错
    testWorker.terminate()
})
