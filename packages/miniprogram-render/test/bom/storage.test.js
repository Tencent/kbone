const mock = require('../mock')
const Event = require('../../src/event/event')

let window
let window2

beforeAll(() => {
    window = mock.createPage('home').window
    window2 = mock.createPage('list').window
})

test('storage', () => {
    const localStorage = window.localStorage
    const sessionStorage = window.sessionStorage
    const localStorage2 = window2.localStorage
    const sessionStorage2 = window2.sessionStorage
    let event = null
    let event2 = null

    window.addEventListener('storage', evt => {
        expect(evt).toBeInstanceOf(Event)
        event = evt
    })

    window2.addEventListener('storage', evt => {
        expect(evt).toBeInstanceOf(Event)
        event2 = evt
    })

    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)

    localStorage.setItem('a', '123')
    expect(event).toBe(null)
    expect(event2).toMatchObject({
        key: 'a', newValue: '123', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    expect(localStorage2.getItem('a')).toBe('123')
    localStorage2.setItem('c', '321')
    expect(event).toMatchObject({
        key: 'c', newValue: '321', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'a', newValue: '123', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    expect(localStorage.getItem('c')).toBe('321')


    // setItem/storage event
    localStorage.setItem('a', '1')
    expect(event).toMatchObject({
        key: 'c', newValue: '321', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'a', newValue: '1', oldValue: '123', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.setItem('aa', '1')
    expect(event).toMatchObject({
        key: 'aa', newValue: '1', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'a', newValue: '1', oldValue: '123', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage.setItem('b', '2')
    expect(event).toMatchObject({
        key: 'aa', newValue: '1', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'b', newValue: '2', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage2.setItem('bb', '2')
    expect(event).toMatchObject({
        key: 'bb', newValue: '2', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'b', newValue: '2', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage.setItem('c', '3')
    expect(event).toMatchObject({
        key: 'bb', newValue: '2', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'c', newValue: '3', oldValue: '321', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.setItem('cc', '3')
    expect(event).toMatchObject({
        key: 'cc', newValue: '3', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'c', newValue: '3', oldValue: '321', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage.setItem('d', '4')
    expect(event).toMatchObject({
        key: 'cc', newValue: '3', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'd', newValue: '4', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage2.setItem('dd', '4')
    expect(event).toMatchObject({
        key: 'dd', newValue: '4', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'd', newValue: '4', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage.setItem('e', '5')
    expect(event).toMatchObject({
        key: 'dd', newValue: '4', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'e', newValue: '5', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.setItem('ee', '5')
    expect(event).toMatchObject({
        key: 'ee', newValue: '5', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'e', newValue: '5', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage.setItem('f', '6')
    expect(event).toMatchObject({
        key: 'ee', newValue: '5', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'f', newValue: '6', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage2.setItem('ff', '6')
    expect(event).toMatchObject({
        key: 'ff', newValue: '6', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'f', newValue: '6', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage.setItem('g', '7')
    expect(event).toMatchObject({
        key: 'ff', newValue: '6', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'g', newValue: '7', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.setItem('gg', '7')
    expect(event).toMatchObject({
        key: 'gg', newValue: '7', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'g', newValue: '7', oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)

    // length
    expect(localStorage.length).toBe(8)
    expect(localStorage2.length).toBe(8)
    expect(sessionStorage.length).toBe(3)
    expect(sessionStorage2.length).toBe(3)

    // key
    expect(localStorage.key(0)).toBe('a')
    expect(localStorage.key(1)).toBe('c')
    expect(localStorage.key(2)).toBe('aa')
    expect(localStorage.key(3)).toBe('cc')
    expect(localStorage.key(4)).toBe('e')
    expect(localStorage.key(5)).toBe('ee')
    expect(localStorage.key(6)).toBe('g')
    expect(localStorage.key(7)).toBe('gg')
    expect(localStorage.key(8)).toBe(null)
    expect(localStorage2.key(0)).toBe('a')
    expect(localStorage2.key(1)).toBe('c')
    expect(localStorage2.key(2)).toBe('aa')
    expect(localStorage2.key(3)).toBe('cc')
    expect(localStorage2.key(4)).toBe('e')
    expect(localStorage2.key(5)).toBe('ee')
    expect(localStorage2.key(6)).toBe('g')
    expect(localStorage2.key(7)).toBe('gg')
    expect(localStorage2.key(8)).toBe(null)
    expect(sessionStorage.key(0)).toBe('b')
    expect(sessionStorage.key(1)).toBe('d')
    expect(sessionStorage.key(2)).toBe('f')
    expect(sessionStorage.key(3)).toBe(null)
    expect(sessionStorage2.key(0)).toBe('bb')
    expect(sessionStorage2.key(1)).toBe('dd')
    expect(sessionStorage2.key(2)).toBe('ff')
    expect(sessionStorage2.key(3)).toBe(null)

    // getItem
    expect(localStorage.getItem('a')).toBe('1')
    expect(localStorage.getItem('aa')).toBe('1')
    expect(localStorage.getItem('c')).toBe('3')
    expect(localStorage.getItem('cc')).toBe('3')
    expect(localStorage.getItem('e')).toBe('5')
    expect(localStorage.getItem('ee')).toBe('5')
    expect(localStorage.getItem('g')).toBe('7')
    expect(localStorage.getItem('gg')).toBe('7')
    expect(localStorage.getItem('i')).toBe(null)
    expect(localStorage2.getItem('a')).toBe('1')
    expect(localStorage2.getItem('aa')).toBe('1')
    expect(localStorage2.getItem('c')).toBe('3')
    expect(localStorage2.getItem('cc')).toBe('3')
    expect(localStorage2.getItem('e')).toBe('5')
    expect(localStorage2.getItem('ee')).toBe('5')
    expect(localStorage2.getItem('g')).toBe('7')
    expect(localStorage2.getItem('gg')).toBe('7')
    expect(localStorage2.getItem('i')).toBe(null)
    expect(sessionStorage.getItem('b')).toBe('2')
    expect(sessionStorage.getItem('d')).toBe('4')
    expect(sessionStorage.getItem('f')).toBe('6')
    expect(sessionStorage.getItem('bb')).toBe(null)
    expect(sessionStorage2.getItem('bb')).toBe('2')
    expect(sessionStorage2.getItem('dd')).toBe('4')
    expect(sessionStorage2.getItem('ff')).toBe('6')
    expect(sessionStorage2.getItem('b')).toBe(null)

    // removeItem
    localStorage.removeItem('c')
    expect(event).toMatchObject({
        key: 'gg', newValue: '7', oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'c', newValue: null, oldValue: '3', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.removeItem('cc')
    expect(event).toMatchObject({
        key: 'cc', newValue: null, oldValue: '3', url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'c', newValue: null, oldValue: '3', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage.removeItem('d')
    expect(event).toMatchObject({
        key: 'cc', newValue: null, oldValue: '3', url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'd', newValue: null, oldValue: '4', url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage2.removeItem('dd')
    expect(event).toMatchObject({
        key: 'dd', newValue: null, oldValue: '4', url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: 'd', newValue: null, oldValue: '4', url: window.location.href
    })
    expect(event2.target).toBe(window2)

    expect(localStorage.length).toBe(6)
    expect(sessionStorage.length).toBe(2)

    expect(localStorage.key(0)).toBe('a')
    expect(localStorage.key(1)).toBe('aa')
    expect(localStorage.key(2)).toBe('e')
    expect(localStorage.key(3)).toBe('ee')
    expect(localStorage.key(4)).toBe('g')
    expect(localStorage.key(5)).toBe('gg')
    expect(localStorage.key(6)).toBe(null)
    expect(localStorage2.key(0)).toBe('a')
    expect(localStorage2.key(1)).toBe('aa')
    expect(localStorage2.key(2)).toBe('e')
    expect(localStorage2.key(3)).toBe('ee')
    expect(localStorage2.key(4)).toBe('g')
    expect(localStorage2.key(5)).toBe('gg')
    expect(localStorage2.key(6)).toBe(null)
    expect(sessionStorage.key(0)).toBe('b')
    expect(sessionStorage.key(1)).toBe('f')
    expect(sessionStorage.key(2)).toBe(null)
    expect(sessionStorage2.key(0)).toBe('bb')
    expect(sessionStorage2.key(1)).toBe('ff')
    expect(sessionStorage2.key(2)).toBe(null)

    expect(localStorage.getItem('a')).toBe('1')
    expect(localStorage.getItem('aa')).toBe('1')
    expect(localStorage.getItem('c')).toBe(null)
    expect(localStorage.getItem('cc')).toBe(null)
    expect(localStorage.getItem('e')).toBe('5')
    expect(localStorage.getItem('ee')).toBe('5')
    expect(localStorage.getItem('g')).toBe('7')
    expect(localStorage.getItem('gg')).toBe('7')
    expect(localStorage.getItem('i')).toBe(null)
    expect(localStorage2.getItem('a')).toBe('1')
    expect(localStorage2.getItem('aa')).toBe('1')
    expect(localStorage2.getItem('c')).toBe(null)
    expect(localStorage2.getItem('cc')).toBe(null)
    expect(localStorage2.getItem('e')).toBe('5')
    expect(localStorage2.getItem('ee')).toBe('5')
    expect(localStorage2.getItem('g')).toBe('7')
    expect(localStorage2.getItem('gg')).toBe('7')
    expect(localStorage2.getItem('i')).toBe(null)
    expect(sessionStorage.getItem('b')).toBe('2')
    expect(sessionStorage.getItem('d')).toBe(null)
    expect(sessionStorage.getItem('f')).toBe('6')
    expect(sessionStorage.getItem('bb')).toBe(null)
    expect(sessionStorage2.getItem('bb')).toBe('2')
    expect(sessionStorage2.getItem('dd')).toBe(null)
    expect(sessionStorage2.getItem('ff')).toBe('6')
    expect(sessionStorage2.getItem('b')).toBe(null)

    // clear
    localStorage.clear()
    expect(event).toMatchObject({
        key: 'dd', newValue: null, oldValue: '4', url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    localStorage2.clear()
    expect(event).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage.clear()
    expect(event).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)
    sessionStorage2.clear()
    expect(event).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window2.location.href
    })
    expect(event.target).toBe(window)
    expect(event2).toMatchObject({
        key: null, newValue: null, oldValue: null, url: window.location.href
    })
    expect(event2.target).toBe(window2)

    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)

    expect(localStorage.key(0)).toBe(null)
    expect(localStorage.key(1)).toBe(null)
    expect(localStorage.key(2)).toBe(null)
    expect(localStorage.key(3)).toBe(null)
    expect(localStorage.key(4)).toBe(null)
    expect(localStorage.key(5)).toBe(null)
    expect(localStorage.key(6)).toBe(null)
    expect(localStorage.key(7)).toBe(null)
    expect(localStorage.key(8)).toBe(null)
    expect(localStorage2.key(0)).toBe(null)
    expect(localStorage2.key(1)).toBe(null)
    expect(localStorage2.key(2)).toBe(null)
    expect(localStorage2.key(3)).toBe(null)
    expect(localStorage2.key(4)).toBe(null)
    expect(localStorage2.key(5)).toBe(null)
    expect(localStorage2.key(6)).toBe(null)
    expect(localStorage2.key(7)).toBe(null)
    expect(localStorage2.key(8)).toBe(null)
    expect(sessionStorage.key(0)).toBe(null)
    expect(sessionStorage.key(1)).toBe(null)
    expect(sessionStorage.key(2)).toBe(null)
    expect(sessionStorage.key(3)).toBe(null)
    expect(sessionStorage2.key(0)).toBe(null)
    expect(sessionStorage2.key(1)).toBe(null)
    expect(sessionStorage2.key(2)).toBe(null)
    expect(sessionStorage2.key(3)).toBe(null)

    expect(localStorage.getItem('a')).toBe(null)
    expect(localStorage.getItem('aa')).toBe(null)
    expect(localStorage.getItem('c')).toBe(null)
    expect(localStorage.getItem('cc')).toBe(null)
    expect(localStorage.getItem('e')).toBe(null)
    expect(localStorage.getItem('ee')).toBe(null)
    expect(localStorage.getItem('g')).toBe(null)
    expect(localStorage.getItem('gg')).toBe(null)
    expect(localStorage.getItem('i')).toBe(null)
    expect(localStorage2.getItem('a')).toBe(null)
    expect(localStorage2.getItem('aa')).toBe(null)
    expect(localStorage2.getItem('c')).toBe(null)
    expect(localStorage2.getItem('cc')).toBe(null)
    expect(localStorage2.getItem('e')).toBe(null)
    expect(localStorage2.getItem('ee')).toBe(null)
    expect(localStorage2.getItem('g')).toBe(null)
    expect(localStorage2.getItem('gg')).toBe(null)
    expect(localStorage2.getItem('i')).toBe(null)
    expect(sessionStorage.getItem('b')).toBe(null)
    expect(sessionStorage.getItem('d')).toBe(null)
    expect(sessionStorage.getItem('f')).toBe(null)
    expect(sessionStorage.getItem('bb')).toBe(null)
    expect(sessionStorage2.getItem('bb')).toBe(null)
    expect(sessionStorage2.getItem('dd')).toBe(null)
    expect(sessionStorage2.getItem('ff')).toBe(null)
    expect(sessionStorage2.getItem('b')).toBe(null)
})
