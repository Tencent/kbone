const mock = require('../mock')

let window
let document
let XMLHttpRequest

beforeAll(() => {
    const res = mock.createPage('home')
    window = res.window
    document = res.document
    XMLHttpRequest = window.XMLHttpRequest
})

test('XMLHttpRequest', async() => {
    const expires = (new Date(Date.now() + 1000 * 1000)).toUTCString()
    global.testXHRData = {
        dataType: 'text',
        responseType: 'text',
    }

    document.cookie = `aaa=bbb; expires=${expires}`
    document.cookie = 'ccc=ddd'

    let readyStateChangeCount = 0
    let errorCount = 0
    let loadStartCount = 0
    let loadEndCount = 0
    let loadCount = 0
    let timeoutCount = 0

    const onreadystatechange = function() {
        readyStateChangeCount++
    }

    const onerror = function() {
        errorCount++
    }

    const onloadstart = function() {
        loadStartCount++
    }

    const onloadend = function() {
        expect(loadStartCount).toBe(loadEndCount + 1)
        loadEndCount++
    }

    const onload = function() {
        expect(loadEndCount).toBe(loadCount + 1)
        loadCount++
    }

    const ontimeout = function() {
        timeoutCount++
    }

    // get
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = onreadystatechange
    xhr.onerror = onerror
    xhr.onloadstart = onloadstart
    xhr.onloadend = onloadend
    xhr.onload = onload
    xhr.ontimeout = ontimeout

    global.testXHRData.url = 'https://test.miniprogram.com?a=12#haha'
    global.testXHRData.header = {
        Accept: '*/*',
        cookie: 'aaa=bbb; ccc=ddd',
    }
    global.testXHRData.method = 'GET'

    expect(xhr.withCredentials).toBe(true)
    expect(xhr.readyState).toBe(XMLHttpRequest.UNSENT)
    expect(readyStateChangeCount).toBe(0)

    xhr.open('GET', 'https://test.miniprogram.com?a=12#haha')
    expect(xhr.readyState).toBe(XMLHttpRequest.OPENED)
    expect(readyStateChangeCount).toBe(1)

    xhr.responseType = 'text'
    xhr.timeout = 200

    // fail
    global.testXHRData.res = 'fail'
    expect(errorCount).toBe(0)
    xhr.send()
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(2)
    expect(errorCount).toBe(1)

    // timeout
    global.testXHRData.res = 'timeout'
    expect(timeoutCount).toBe(0)
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send()
    await mock.sleep(300)
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(3)
    expect(timeoutCount).toBe(1)

    // success
    global.testXHRData.res = 'success'
    global.testXHRData.data = 'success'
    expect(loadStartCount).toBe(0)
    expect(loadEndCount).toBe(0)
    expect(loadCount).toBe(0)
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send()
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(6)
    expect(loadStartCount).toBe(1)
    expect(loadEndCount).toBe(1)
    expect(loadCount).toBe(1)
    expect(xhr.responseText).toBe('success')
    expect(xhr.response).toBe('success')

    // post
    readyStateChangeCount = 0
    errorCount = 0
    loadStartCount = 0
    loadEndCount = 0
    loadCount = 0
    timeoutCount = 0

    xhr = new XMLHttpRequest()
    xhr.onreadystatechange = onreadystatechange
    xhr.onerror = onerror
    xhr.onloadstart = onloadstart
    xhr.onloadend = onloadend
    xhr.onload = onload
    xhr.ontimeout = ontimeout

    global.testXHRData.url = 'https://a.b.c?a=12#haha'
    global.testXHRData.header = {
        Accept: '*/*',
        'Content-type': 'application/x-www-form-urlencoded',
        cookie: 'aaa=bbb; ccc=ddd',
    }
    global.testXHRData.method = 'POST'

    expect(xhr.readyState).toBe(XMLHttpRequest.UNSENT)
    expect(readyStateChangeCount).toBe(0)

    xhr.open('POST', 'https://a.b.c?a=12#haha')
    expect(xhr.readyState).toBe(XMLHttpRequest.OPENED)
    expect(readyStateChangeCount).toBe(1)

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'text'
    xhr.timeout = 200

    // fail
    global.testXHRData.res = 'fail'
    expect(errorCount).toBe(0)
    xhr.send('fail')
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(2)
    expect(errorCount).toBe(1)

    // timeout
    global.testXHRData.res = 'timeout'
    expect(timeoutCount).toBe(0)
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send('timeout')
    await mock.sleep(300)
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(3)
    expect(timeoutCount).toBe(1)

    // success
    global.testXHRData.res = 'success'
    global.testXHRData.data = 'success'
    expect(loadStartCount).toBe(0)
    expect(loadEndCount).toBe(0)
    expect(loadCount).toBe(0)
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send('success')
    expect(xhr.readyState).toBe(XMLHttpRequest.DONE)
    expect(readyStateChangeCount).toBe(6)
    expect(loadStartCount).toBe(1)
    expect(loadEndCount).toBe(1)
    expect(loadCount).toBe(1)
    expect(xhr.responseText).toBe('success')
    expect(xhr.response).toBe('success')

    // cors
    xhr = new XMLHttpRequest()
    global.testXHRData.url = 'https://a.com?a=12#haha'
    global.testXHRData.header = {
        Accept: '*/*',
        cookie: 'aaa=bbb; ccc=ddd',
    }
    global.testXHRData.method = 'GET'
    global.testXHRData.res = 'success'
    xhr.open('GET', 'https://a.com?a=12#haha')
    xhr.send()
    xhr.withCredentials = false
    global.testXHRData.header = {
        Accept: '*/*',
    }
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send()
    xhr.withCredentials = true
    global.testXHRData.header = {
        Accept: '*/*',
        cookie: 'aaa=bbb; ccc=ddd',
    }
    xhr.$_readyState = XMLHttpRequest.OPENED // 利用私有字段调整 readyState，为了再次发送请求
    xhr.send()
})
