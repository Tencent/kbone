const _ = require('./utils')

test('map', async() => {
    const page = global.$$page
    const componentId = _.load({
        template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
        usingComponents: {
            element: _.elementId,
        },
    }, 'page')
    const component = _.render(componentId)

    const wrapper = document.createElement('wrapper')
    document.body.appendChild(wrapper)
    component.attach(wrapper)
    expect(_.match(component.dom, `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`)).toBe(true)

    const body = component.querySelector('.h5-body')
    const node = page.document.createElement('wx-component')
    node.setAttribute('behavior', 'map')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // longitude
    await _.checkNumber(body, node, 'longitude', 'longitude', 39.92)

    // latitude
    await _.checkNumber(body, node, 'latitude', 'latitude', 116.46)

    // scale
    await _.checkNumber(body, node, 'scale', 'scale', 16)

    // markers
    await _.checkArray(body, node, 'markers', 'markers', [], [{
        iconPath: '/resources/others.png',
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50,
    }])

    // polyline
    await _.checkArray(body, node, 'polyline', 'polyline', [], [{
        points: [{
            longitude: 113.3245211,
            latitude: 23.10229,
        }, {
            longitude: 113.324520,
            latitude: 23.21229,
        }],
        color: '#FF0000DD',
        width: 2,
        dottedLine: true,
    }])

    // circles
    await _.checkArray(body, node, 'circles', 'circles', [], [{
        latitude: 23.10229,
        longitude: 113.3245211,
        color: '#FF0000DD',
        radius: 15,
    }])

    // controls
    await _.checkArray(body, node, 'controls', 'controls', [], [{
        id: 1,
        iconPath: '/resources/location.png',
        position: {
            left: 0,
            top: 300 - 50,
            width: 50,
            height: 50,
        },
        clickable: true,
    }])

    // includePoints
    await _.checkArray(body, node, 'includePoints', 'include-points', [], [{
        longitude: 113.3245211,
        latitude: 23.10229,
    }])

    // showLocation
    await _.checkBoolean(body, node, 'showLocation', 'show-location', false)

    // polygons
    await _.checkArray(body, node, 'polygons', 'polygons', [], [{
        points: [{
            longitude: 113.3245211,
            latitude: 23.10229,
        }, {
            longitude: 113.324520,
            latitude: 23.21229,
        }],
    }])

    // subkey
    await _.checkString(body, node, 'subkey', 'subkey', '')

    // layerStyle
    await _.checkNumber(body, node, 'layerStyle', 'layer-style', 1)

    // rotate
    await _.checkNumber(body, node, 'rotate', 'rotate', 0)

    // skew
    await _.checkNumber(body, node, 'skew', 'skew', 0)

    // enable3D
    await _.checkBoolean(body, node, 'enable3D', 'enable-3D', false)

    // showCompass
    await _.checkBoolean(body, node, 'showCompass', 'show-compass', false)

    // showScale
    await _.checkBoolean(body, node, 'showScale', 'show-scale', false)

    // enableOverlooking
    await _.checkBoolean(body, node, 'enableOverlooking', 'enable-overlooking', false)

    // enableZoom
    await _.checkBoolean(body, node, 'enableZoom', 'enable-zoom', true)

    // enableScroll
    await _.checkBoolean(body, node, 'enableScroll', 'enable-scroll', true)

    // enableRotate
    await _.checkBoolean(body, node, 'enableRotate', 'enable-rotate', false)

    // enableSatellite
    await _.checkBoolean(body, node, 'enableSatellite', 'enable-satellite', false)

    // enableTraffic
    await _.checkBoolean(body, node, 'enableTraffic', 'enable-traffic', false)

    // setting
    expect(_.getData(body).setting).toEqual({})
    node.setAttribute('setting', {skew: 0, rotate: 0, showLocation: false})
    await _.sleep(10)
    expect(_.getData(body).setting).toEqual({skew: 0, rotate: 0, showLocation: false})
    node.setAttribute('setting', JSON.stringify({
        showScale: false, subKey: '', layerStyle: -1, enableZoom: true
    }))
    await _.sleep(10)
    expect(_.getData(body).setting).toMatchObject({
        showScale: false, subKey: '', layerStyle: -1, enableZoom: true
    })

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['tap', 'markertap', 'labeltap', 'controltap', 'callouttap', 'updated', 'regionchange', 'poitap'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
