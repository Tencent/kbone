/* eslint-disable no-proto */
const mock = require('./mock')
const Document = require('../src/document')
const Location = require('../src/bom/location')
const Navigator = require('../src/bom/navigator')
const LocalStorage = require('../src/bom/local-storage')
const SessionStorage = require('../src/bom/session-storage')
const History = require('../src/bom/history')
const Screen = require('../src/bom/screen')
const CustomEvent = require('../src/event/custom-event')
const Event = require('../src/event/event')
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

test('window: init', () => {
    expect(window.HTMLIFrameElement).toBeInstanceOf(Function)
})

test('window: $$getPrototype/$$extend/$$addAspect', () => {
    // window.location
    expect(window.$$getPrototype('window.location')).toBe(window.location.__proto__)
    window.$$extend('window.location', {
        testStr: 'window.location',
        testFunc() {
            return this
        },
    })
    expect(window.location.testFunc()).toBe(window.location)
    expect(window.location.testStr).toBe('window.location')

    // window.navigator
    expect(window.$$getPrototype('window.navigator')).toBe(window.navigator.__proto__)
    window.$$extend('window.navigator', {
        testStr: 'window.navigator',
        testFunc() {
            return this
        },
    })
    expect(window.navigator.testFunc()).toBe(window.navigator)
    expect(window.navigator.testStr).toBe('window.navigator')

    // window.performance
    expect(window.$$getPrototype('window.performance')).toBe(window.performance.__proto__)
    window.$$extend('window.performance', {
        testStr: 'window.performance',
        testFunc() {
            return this
        },
    })
    expect(window.performance.testFunc()).toBe(window.performance)
    expect(window.performance.testStr).toBe('window.performance')

    // window.screen
    expect(window.$$getPrototype('window.screen')).toBe(window.screen.__proto__)
    window.$$extend('window.screen', {
        testStr: 'window.screen',
        testFunc() {
            return this
        },
    })
    expect(window.screen.testFunc()).toBe(window.screen)
    expect(window.screen.testStr).toBe('window.screen')

    // window.history
    expect(window.$$getPrototype('window.history')).toBe(window.history.__proto__)
    window.$$extend('window.history', {
        testStr: 'window.history',
        testFunc() {
            return this
        },
    })
    expect(window.history.testFunc()).toBe(window.history)
    expect(window.history.testStr).toBe('window.history')

    // window.localStorage
    expect(window.$$getPrototype('window.localStorage')).toBe(window.localStorage.__proto__)
    window.$$extend('window.localStorage', {
        testStr: 'window.localStorage',
        testFunc() {
            return this
        },
    })
    expect(window.localStorage.testFunc()).toBe(window.localStorage)
    expect(window.localStorage.testStr).toBe('window.localStorage')

    // window.sessionStorage
    expect(window.$$getPrototype('window.sessionStorage')).toBe(window.sessionStorage.__proto__)
    window.$$extend('window.sessionStorage', {
        testStr: 'window.sessionStorage',
        testFunc() {
            return this
        },
    })
    expect(window.sessionStorage.testFunc()).toBe(window.sessionStorage)
    expect(window.sessionStorage.testStr).toBe('window.sessionStorage')

    // window.event
    const evt = new window.CustomEvent('test')
    expect(window.$$getPrototype('window.event')).toBe(Event.prototype)
    window.$$extend('window.event', {
        testStr: 'window.event',
        testFunc() {
            return this
        },
    })
    expect(evt.testFunc()).toBe(evt)
    expect(evt.testStr).toBe('window.event')

    // window
    expect(window.$$getPrototype('window')).toBe(window.__proto__)
    window.$$extend('window', {
        testStr: 'window',
        testFunc() {
            return this
        },
    })
    expect(window.testFunc()).toBe(window)
    expect(window.testStr).toBe('window')

    // document
    expect(window.$$getPrototype('document')).toBe(document.__proto__)
    window.$$extend('document', {
        testStr: 'document',
        testFunc() {
            return this
        },
    })
    expect(document.testFunc()).toBe(document)
    expect(document.testStr).toBe('document')

    const element = document.createElement('div')

    // element.attribute
    expect(window.$$getPrototype('element.attribute')).toBe(element.$_attrs.__proto__)
    window.$$extend('element.attribute', {
        testStr: 'element.attribute',
        testFunc() {
            return this
        },
    })
    expect(element.$_attrs.testFunc()).toBe(element.$_attrs)
    expect(element.$_attrs.testStr).toBe('element.attribute')

    // element.classList
    expect(window.$$getPrototype('element.classList')).toBe(element.classList.__proto__)
    window.$$extend('element.classList', {
        testStr: 'element.classList',
        testFunc() {
            return this
        },
    })
    expect(element.classList.testFunc()).toBe(element.classList)
    expect(element.classList.testStr).toBe('element.classList')

    // element.style
    expect(window.$$getPrototype('element.style')).toBe(element.style.__proto__)
    window.$$extend('element.style', {
        testStr: 'element.style',
        testFunc() {
            return this
        },
    })
    expect(element.style.testFunc()).toBe(element.style)
    expect(element.style.testStr).toBe('element.style')

    // element
    expect(window.$$getPrototype('element')).toBe(element.__proto__)
    window.$$extend('element', {
        testStr: 'element',
        testFunc() {
            return this
        },
    })
    expect(element.testFunc()).toBe(element)
    expect(element.testStr).toBe('element')

    // textNode
    const textNode = document.createTextNode('text')
    expect(window.$$getPrototype('textNode')).toBe(textNode.__proto__)
    window.$$extend('textNode', {
        testStr: 'textNode',
        testFunc() {
            return this
        },
    })
    expect(textNode.testFunc()).toBe(textNode)
    expect(textNode.testStr).toBe('textNode')

    // comment
    const comment = document.createComment('comment')
    expect(window.$$getPrototype('comment')).toBe(comment.__proto__)
    window.$$extend('comment', {
        testStr: 'comment',
        testFunc() {
            return this
        },
    })
    expect(comment.testFunc()).toBe(comment)
    expect(comment.testStr).toBe('comment')

    // normal aspect
    const expectArg1 = 123
    const expectArg2 = {a: 'abc'}
    const beforeAspect = function(arg1, arg2) {
        expect(arg1).toBe(expectArg1)
        expect(arg2).toBe(expectArg2)
        this.testStr = 'before-' + this.testStr
    }
    const beforeAspect2 = function(arg1, arg2) {
        expect(arg1).toBe(expectArg1)
        expect(arg2).toBe(expectArg2)
        this.testStr = 'before2-' + this.testStr
    }
    const afterAspect = function(arg1) {
        expect(arg1).toBe(this)
        this.testStr = this.testStr + '-after'
    }
    const afterAspect2 = function(arg1) {
        expect(arg1).toBe(this)
        this.testStr = this.testStr + '-after2'
    }
    const afterAspect3 = function(arg1) {
        expect(arg1).toBe(this)
        this.testStr = this.testStr + '-after3'
    }
    let originalFunc = window.location.testFunc
    window.$$addAspect('window.location.testFunc.before', beforeAspect)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before-window.location')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$addAspect('window.location.testFunc.after', afterAspect)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before-before-window.location-after')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$removeAspect('window.location.testFunc.before', beforeAspect)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before-before-window.location-after-after')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$removeAspect('window.location.testFunc.after', afterAspect)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before-before-window.location-after-after')
    expect(window.location.testFunc).toBe(originalFunc)

    // multiple aspect
    window.$$addAspect('window.location.testFunc.before', beforeAspect)
    window.$$addAspect('window.location.testFunc.before', beforeAspect2)
    window.$$addAspect('window.location.testFunc.after', afterAspect)
    window.$$addAspect('window.location.testFunc.after', afterAspect2)
    window.$$addAspect('window.location.testFunc.after', afterAspect3)
    window.location.testStr = 'window.location'
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before2-before-window.location-after-after2-after3')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$removeAspect('window.location.testFunc.before', beforeAspect)
    window.$$removeAspect('window.location.testFunc.after', afterAspect)
    window.location.testStr = 'window.location'
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before2-window.location-after2-after3')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$removeAspect('window.location.testFunc.before', beforeAspect2)
    window.$$removeAspect('window.location.testFunc.after', afterAspect3)
    window.location.testStr = 'window.location'
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('window.location-after2')
    expect(window.location.testFunc).not.toBe(originalFunc)
    window.$$removeAspect('window.location.testFunc.after', afterAspect2)
    window.location.testStr = 'window.location'
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('window.location')
    expect(window.location.testFunc).toBe(originalFunc)

    // before aspect stop
    const beforeAspect3 = function(arg1, arg2) {
        expect(arg1).toBe(expectArg1)
        expect(arg2).toBe(expectArg2)
        if (this.testStr === 'before-before-before-window.location') return true
        this.testStr = 'before-' + this.testStr
    }
    window.$$addAspect('window.location.testFunc.before', beforeAspect3)
    window.location.testStr = 'window.location'
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testStr).toBe('before-before-before-window.location')
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(undefined)
    expect(window.location.testStr).toBe('before-before-before-window.location')
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(undefined)
    expect(window.location.testStr).toBe('before-before-before-window.location')
    window.$$removeAspect('window.location.testFunc.before', beforeAspect3)
    expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location)
    expect(window.location.testFunc).toBe(originalFunc)

    // parent class method aspect
    originalFunc = element.hasChildNodes
    const beforeAspect4 = function(arg1, arg2) {
        expect(arg1).toBe(expectArg1)
        expect(arg2).toBe(expectArg2)
        if (this.testStr === 'before-before-before-element') return true
        this.testStr = 'before-' + this.testStr
    }
    const afterAspect4 = function(arg1) {
        expect(arg1).toBe(false)
        this.testStr = this.testStr + '-after4'
    }
    window.$$addAspect('element.hasChildNodes.before', beforeAspect)
    window.$$addAspect('element.hasChildNodes.after', afterAspect4)
    element.testStr = 'element'
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false)
    expect(element.testStr).toBe('before-element-after4')
    window.$$removeAspect('element.hasChildNodes.before', beforeAspect)
    window.$$removeAspect('element.hasChildNodes.after', afterAspect4)
    window.$$addAspect('element.hasChildNodes.before', beforeAspect4)
    element.testStr = 'element'
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false)
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false)
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false)
    expect(element.testStr).toBe('before-before-before-element')
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(undefined)
    expect(element.testStr).toBe('before-before-before-element')
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(undefined)
    expect(element.testStr).toBe('before-before-before-element')
    window.$$removeAspect('element.hasChildNodes.before', beforeAspect4)
    expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false)
    expect(element.hasChildNodes).toBe(originalFunc)
})

test('window: document', () => {
    expect(window.document).toBe(document)
    expect(window.document).toBeInstanceOf(Document)
})

test('window: location', () => {
    expect(window.location).toBeInstanceOf(Location)

    // TODO setter
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

test('window: Event', () => {
    expect(window.Event).toBe(Event)
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

test('window: RegExp/Math/Number/Boolean/String/Date/Symbol', () => {
    expect(window.RegExp).toBe(RegExp)
    expect(window.Math).toBe(Math)
    expect(window.Number).toBe(Number)
    expect(window.Boolean).toBe(Boolean)
    expect(window.String).toBe(String)
    expect(window.Date).toBe(Date)
    expect(window.Symbol).toBe(Symbol)
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
