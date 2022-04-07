const mock = require('../mock')

let document

beforeAll(() => {
    const res = mock.createPage('home')
    document = res.document
})

test('style', () => {
    let updateCount = 0
    const element = document.createElement('div')
    element.addEventListener('$$domNodeUpdate', () => {
        updateCount++
    })
    const style = element.style
    style.cssText = 'position: absolute; top: 0; left: 0;'

    expect(style.position).toBe('absolute')
    expect(style.top).toBe('0')
    expect(style.top).toBe('0')
    expect(style.width).toBe('')

    style.width = '100%'
    expect(style.width).toBe('100%')
    style.height = '13px'
    expect(style.height).toBe('13px')
    expect(updateCount).toBe(3)

    expect(style.cssText).toBe('position:absolute;top:0;left:0;width:100%;height:13px;')

    style.cssText = 'position: relative; display: block;'
    expect(style.position).toBe('relative')
    expect(style.top).toBe('')
    expect(style.left).toBe('')
    expect(style.display).toBe('block')
    expect(updateCount).toBe(4)

    expect(style.cssText).toBe('position:relative;display:block;')

    // base64
    style.cssText = 'width: 100px; height: 100px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=")'
    expect(style.cssText).toBe('width:100px;height:100px;background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=\');')

    // optimization.styleValueReduce
    style.cssText = 'width: 100px; height: 100px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=iVBORw0KGgoAAAANSUhEUgAAAC0AAAAyCAMAAAD/RKLmAAAATlBMVEUAAAD////ExMT////////////////////////////Dw8PDw8PExMTExMTDw8P////Hx8fT09Px8fH39/f4+Pj09PTi4uLb29vNzc3V1dUaiLcsAAAADnRSTlMAG7Vs8ptO2bbz4/OFSegrJ6sAAAD5SURBVEjH1dXZjoMgGEDhIq61/Q/g2vd/0TEzZjBVIdw09bvS5MSILN4u7HmXU/fne73Egfy9FrmdEvl4/WgfCXUrbdqzv2SUaXUmG1lafdFRLrK0+rqjVLquoKq1iteq4F+hIm9S5mzkZbDWAG6ajZknB6ADdQl0Vla2A8rTWuXgjJhxgGFcLhzk6qwuoDNie371VkwHxUmtACsWVuuNOq41ODG9r3sjDvRxXcMkIxujTFAf1xXMMrAxyAzVcd2AEXjJ6gVioEmv96d9F3iT/Z/EhUbpxb+gF5+dnejMe/FV5cVXrBffDV58p4XtdnHQ3wnRNP6ESPUDsqoqrpVL95sAAAAASUVORK5CYII=")'
    expect(style.cssText).toBe('width:100px;height:100px;')

    // 值同时包括单双引号
    style.webkitMask = 'url("data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3Eon_dark%3C/title%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle stroke-opacity=\'.254\' stroke=\'%23FFF\' stroke-width=\'.5\' cx=\'16\' cy=\'16\' r=\'15.75\'/%3E%3Cpath fill=\'none\' d=\'M4 4h24v24H4z\' fill-opacity=\'0\'/%3E%3Cpath fill=\'%23FFF\' d=\'M15 20.5h2v3h-2z\'/%3E%3Cpath d=\'M20.498 23.09V16.81h3.115c.031 0 .065-.035.065-.088a.1.1 0 0 0-.027-.07l-7.613-7.81c-.023-.025-.053-.025-.076 0l-7.613 7.81a.105.105 0 0 0 0 .14.054.054 0 0 0 .038.018h3.115v6.281c0 .053.034.088.064.088h8.868c.03 0 .064-.035.064-.088z\' stroke=\'%23FFF\' stroke-width=\'1.644\'/%3E%3C/g%3E%3C/svg%3E") no-repeat 50% 50%'
    expect(style.cssText).toBe('width:100px;height:100px;-webkit-mask:url("data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3Eon_dark%3C/title%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle stroke-opacity=\'.254\' stroke=\'%23FFF\' stroke-width=\'.5\' cx=\'16\' cy=\'16\' r=\'15.75\'/%3E%3Cpath fill=\'none\' d=\'M4 4h24v24H4z\' fill-opacity=\'0\'/%3E%3Cpath fill=\'%23FFF\' d=\'M15 20.5h2v3h-2z\'/%3E%3Cpath d=\'M20.498 23.09V16.81h3.115c.031 0 .065-.035.065-.088a.1.1 0 0 0-.027-.07l-7.613-7.81c-.023-.025-.053-.025-.076 0l-7.613 7.81a.105.105 0 0 0 0 .14.054.054 0 0 0 .038.018h3.115v6.281c0 .053.034.088.064.088h8.868c.03 0 .064-.035.064-.088z\' stroke=\'%23FFF\' stroke-width=\'1.644\'/%3E%3C/g%3E%3C/svg%3E") no-repeat 50% 50%;')
})
