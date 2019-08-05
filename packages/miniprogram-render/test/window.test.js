const mock = require('./mock')
const Document = require('../src/document')
const Location = require('../src/bom/location')
const Navigator = require('../src/bom/navigator')
const LocalStorage = require('../src/bom/local-storage')
const SessionStorage = require('../src/bom/session-storage')
const History = require('../src/bom/history')
const Screen = require('../src/bom/screen')
const CustomEvent = require('../src/event/custom-event')
const Element = require('../src/node/element')
const Node = require('../src/node/node')
const Image = require('../src/node/element/image')

let window
let document

beforeAll(() => {
    const res = mock.createPage('home')
    window = res.window
    document = res.document
})

test('window: document', () => {
    expect(window.document).toBe(document)
    expect(window.document).toBeInstanceOf(Document)
})

test('window: location', () => {
    expect(window.location).toBeInstanceOf(Location)

    // TODO seter
})

test('window: navigator', () => {
    expect(window.navigator).toBeInstanceOf(Navigator)
})

test('window: CustomEvent', () => {
    const evt = new window.CustomEvent('click')
    expect(evt.timeStamp < 3600000).toBe(true)
    expect(evt).toBeInstanceOf(window.CustomEvent)
    expect(evt).toBeInstanceOf(CustomEvent)
})

test('window: self', () => {
    expect(window.self).toBe(window)
})

test('window: localStorage', () => {
    expect(window.localStorage).toBeInstanceOf(LocalStorage)
})

test('window: sessionStorage', () => {
    expect(window.sessionStorage).toBeInstanceOf(SessionStorage)
})

test('window: screen', () => {
    expect(window.screen).toBeInstanceOf(Screen)
})

test('window: history', () => {
    expect(window.history).toBeInstanceOf(History)
})

test('window: outerHeight/outerWidth/innerHeight/innerWidth', () => {
    expect(window.outerHeight).toBe(300)
    expect(window.outerWidth).toBe(200)
    expect(window.innerHeight).toBe(280)
    expect(window.innerWidth).toBe(190)
})

test('window: Image', () => {
    const image = new window.Image()
    expect(image).toBeInstanceOf(Image)
})

test('window: setTimeout/clearTimeout/setInterval/clearInterval', async() => {
    const res = []
    let timer

    timer = window.setTimeout(() => res.push(1), 50)
    window.setTimeout(() => res.push(2), 50)
    window.clearTimeout(timer)

    await mock.sleep(100)
    expect(res).toEqual([2])

    timer = window.setInterval(() => res.push(3), 50)
    const timer2 = window.setInterval(() => res.push(4), 50)
    window.clearInterval(timer)

    await mock.sleep(200)
    window.clearInterval(timer2)
    expect(res.splice(0, 3)).toEqual([2, 4, 4])
})

test('window: HTMLElement', () => {
    // TODO
})

test('window: Element', () => {
    expect(window.Element).toBe(Element)
})

test('window: Node', () => {
    expect(window.Node).toBe(Node)
})

test('window: RegExp/Math/Number/Boolean/String/Date', () => {
    expect(window.RegExp).toBe(RegExp)
    expect(window.Math).toBe(Math)
    expect(window.Number).toBe(Number)
    expect(window.Boolean).toBe(Boolean)
    expect(window.String).toBe(String)
    expect(window.Date).toBe(Date)
})

test('window: open', () => {
    const location = window.location

    let hashChangeCount = 0
    let pageAccessDeniedCount = 0
    let pageNotFoundCount = 0
    let tempURL = ''
    let tempType = ''
    const onHashChange = () => {
        hashChangeCount++
    }
    const onPageAccessDenied = evt => {
        tempURL = evt.url
        tempType = evt.type
        pageAccessDeniedCount++
    }
    const onPageNotFound = evt => {
        tempURL = evt.url
        tempType = evt.type
        pageNotFoundCount++
    }
    location.addEventListener('hashchange', onHashChange)
    window.addEventListener('pageaccessdenied', onPageAccessDenied)
    window.addEventListener('pagenotfound', onPageNotFound)

    window.$$miniprogram.init('https://test.miniprogram.com/p/a/t/h?query=string#hash')
    global.expectPagePath = `/pages/detail/index?type=open&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`
    global.expectWxCallMethod = 'navigateTo'
    window.open('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash')
    expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash')
    window.open('https://test.miniprogram.com/index/hahaha?query=string#321')
    expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash')
    expect(pageNotFoundCount).toBe(1)
    expect(tempURL).toBe('https://test.miniprogram.com/index/hahaha?query=string#321')
    expect(tempType).toBe('open')
    window.open('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash')
    expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash')
    expect(pageAccessDeniedCount).toBe(1)
    expect(tempURL).toBe('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash')
    expect(tempType).toBe('open')

    expect(hashChangeCount).toBe(0)
    expect(pageAccessDeniedCount).toBe(1)
    expect(pageNotFoundCount).toBe(1)

    location.removeEventListener('hashchange', onHashChange)
    window.removeEventListener('pageaccessdenied', onPageAccessDenied)
    window.removeEventListener('pagenotfound', onPageNotFound)
})

test('window: getComputedStyle', () => {
    // TODO
})

test('window: requestAnimationFrame/cancelAnimationFrame', async() => {
    const res = []
    const timer = window.requestAnimationFrame(() => res.push(1))
    window.requestAnimationFrame(() => res.push(2))
    window.cancelAnimationFrame(timer)

    await mock.sleep(100)
    expect(res).toEqual([2])
})
