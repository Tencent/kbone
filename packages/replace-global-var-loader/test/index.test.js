const loader = require('../src/index')

test('replace-global-var-loader', () => {
    expect(loader(`
        abc = function() {
            console.log('abc')
        }
    `)).toBe(`
        window['abc'] = function() {
            console.log('abc')
        }
    `)

    expect(loader(`
        abc(wowo).ddd()
        Promise.then()
    `)).toBe(`
        window['abc'](window['wowo']).ddd()
        Promise.then()
    `)
})
