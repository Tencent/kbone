const _ = require('./utils')

test('live-pusher', async() => {
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
    node.setAttribute('behavior', 'live-pusher')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // url
    await _.checkUrl(body, node, 'url', 'url', '')

    // mode
    await _.checkString(body, node, 'mode', 'mode', 'RTC')

    // autopush
    await _.checkBoolean(body, node, 'autopush', 'autopush', false)

    // muted
    await _.checkBoolean(body, node, 'muted', 'muted', false)

    // enableCamera
    await _.checkBoolean(body, node, 'enableCamera', 'enable-camera', true)

    // autoFocus
    await _.checkBoolean(body, node, 'autoFocus', 'auto-focus', true)

    // orientation
    await _.checkString(body, node, 'orientation', 'orientation', 'vertical')

    // beauty
    await _.checkNumber(body, node, 'beauty', 'beauty', 0)

    // whiteness
    await _.checkNumber(body, node, 'whiteness', 'whiteness', 0)

    // aspect
    await _.checkString(body, node, 'aspect', 'aspect', '9:16')

    // minBitrate
    await _.checkNumber(body, node, 'minBitrate', 'min-bitrate', 200)

    // maxBitrate
    await _.checkNumber(body, node, 'maxBitrate', 'max-bitrate', 1000)

    // waitingImage
    await _.checkString(body, node, 'waitingImage', 'waiting-image', '')

    // waitingImageHash
    await _.checkString(body, node, 'waitingImageHash', 'waiting-image-hash', '')

    // zoom
    await _.checkBoolean(body, node, 'zoom', 'zoom', false)

    // devicePosition
    await _.checkString(body, node, 'devicePosition', 'device-position', 'front')

    // backgroundMute
    await _.checkBoolean(body, node, 'backgroundMute', 'background-mute', false)

    // mirror
    await _.checkBoolean(body, node, 'mirror', 'mirror', false)

    // remoteMirror
    await _.checkBoolean(body, node, 'remoteMirror', 'remote-mirror', false)

    // localMirror
    await _.checkString(body, node, 'localMirror', 'local-mirror', 'auto')

    // audioReverbType
    await _.checkNumber(body, node, 'audioReverbType', 'audio-reverb-type', 0)

    // enableMic
    await _.checkBoolean(body, node, 'enableMic', 'enable-mic', true)

    // enableAgc
    await _.checkBoolean(body, node, 'enableAgc', 'enable-agc', false)

    // enableAns
    await _.checkBoolean(body, node, 'enableAns', 'enable-ans', false)

    // audioVolumeType
    await _.checkString(body, node, 'audioVolumeType', 'audio-volume-type', 'voicecall')

    // videoWidth
    await _.checkNumber(body, node, 'videoWidth', 'video-width', 360)

    // videoHeight
    await _.checkNumber(body, node, 'videoHeight', 'video-height', 640)

    // event
    await _.checkEvent(body.querySelector('.h5-wx-component'), node, ['statechange', 'netstatus', 'error', 'bgmstart', 'bgmprogress', 'bgmcomplete'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
