const _ = require('./utils')

test('video', async() => {
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
    const node = page.document.createElement('video')
    page.document.body.appendChild(node)
    await _.sleep(10)

    // src
    await _.checkUrl(body, node, 'src', 'src', '')

    // duration
    await _.checkNumber(body, node, 'duration', 'duration', 0)

    // controls
    await _.checkBoolean(body, node, 'controls', 'controls', true)

    // danmuList
    await _.checkArray(body, node, 'danmuList', 'danmu-list', [], [{
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
    }, {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
    }])

    // danmuBtn
    await _.checkBoolean(body, node, 'danmuBtn', 'danmu-btn', false)

    // enableDanmu
    await _.checkBoolean(body, node, 'enableDanmu', 'enable-danmu', false)

    // autoplay
    await _.checkBoolean(body, node, 'autoplay', 'autoplay', false)

    // loop
    await _.checkBoolean(body, node, 'loop', 'loop', false)

    // muted
    await _.checkBoolean(body, node, 'muted', 'muted', false)

    // initialTime
    await _.checkNumber(body, node, 'initialTime', 'initial-time', 0)

    // direction
    await _.checkNumber(body, node, 'direction', 'direction', -1)

    // showProgress
    await _.checkBoolean(body, node, 'showProgress', 'show-progress', true)

    // showFullscreenBtn
    await _.checkBoolean(body, node, 'showFullscreenBtn', 'show-fullscreen-btn', true)

    // showPlayBtn
    await _.checkBoolean(body, node, 'showPlayBtn', 'show-play-btn', true)

    // showCenterPlayBtn
    await _.checkBoolean(body, node, 'showCenterPlayBtn', 'show-center-play-btn', true)

    // enableProgressGesture
    await _.checkBoolean(body, node, 'enableProgressGesture', 'enable-progress-gesture', true)

    // objectFit
    await _.checkString(body, node, 'objectFit', 'object-fit', 'contain')

    // poster
    await _.checkUrl(body, node, 'poster', 'poster', '')

    // showMuteBtn
    await _.checkBoolean(body, node, 'showMuteBtn', 'show-mute-btn', false)

    // title
    await _.checkString(body, node, 'title', 'title', '')

    // playBtnPosition
    await _.checkString(body, node, 'playBtnPosition', 'play-btn-position', 'bottom')

    // enablePlayGesture
    await _.checkBoolean(body, node, 'enablePlayGesture', 'enable-play-gesture', false)

    // autoPauseIfNavigate
    await _.checkBoolean(body, node, 'autoPauseIfNavigate', 'auto-pause-if-navigate', true)

    // autoPauseIfOpenNative
    await _.checkBoolean(body, node, 'autoPauseIfOpenNative', 'auto-pause-if-open-native', true)

    // vslideGesture
    await _.checkBoolean(body, node, 'vslideGesture', 'vslide-gesture', false)

    // vslideGestureInFullscreen
    await _.checkBoolean(body, node, 'vslideGestureInFullscreen', 'vslide-gesture-in-fullscreen', true)

    // adUnitId
    await _.checkString(body, node, 'adUnitId', 'ad-unit-id', '')

    // posterForCrawler
    await _.checkString(body, node, 'posterForCrawler', 'poster-for-crawler', '')

    // showCastingButton
    await _.checkBoolean(body, node, 'showCastingButton', 'show-casting-button', false)

    // pictureInPictureMode
    expect(_.getData(body).pictureInPictureMode).toBe(undefined)
    node.setAttribute('picture-in-picture-mode', '')
    await _.sleep(10)
    await _.checkString(body, node, 'pictureInPictureMode', 'picture-in-picture-mode', '')
    node.setAttribute('picture-in-picture-mode', ['push', 'pop'])
    await _.sleep(10)
    expect(_.getData(body).pictureInPictureMode).toEqual(['push', 'pop'])
    node.setAttribute('picture-in-picture-mode', JSON.stringify(['pop', 'push']))
    await _.sleep(10)
    expect(_.getData(body).pictureInPictureMode).toEqual(['pop', 'push'])
    node.setAttribute('picture-in-picture-mode', ['push', 'pop'].toString())
    await _.sleep(10)
    expect(_.getData(body).pictureInPictureMode).toEqual(['push', 'pop'])

    // pictureInPictureShowProgress
    await _.checkBoolean(body, node, 'pictureInPictureShowProgress', 'picture-in-picture-show-progress', false)

    // enableAutoRotation
    await _.checkBoolean(body, node, 'enableAutoRotation', 'enable-auto-rotation', false)

    // showScreenLockButton
    await _.checkBoolean(body, node, 'showScreenLockButton', 'show-screen-lock-button', false)

    // event
    await _.checkEvent(body.querySelector('.h5-video'), node, ['play', 'pause', 'ended', 'timeupdate', 'fullscreenchange', 'waiting', 'error', 'progress', 'loadedmetadata', 'controlstoggle', 'enterpictureinpicture', 'leavepictureinpicture'])

    page.document.body.removeChild(node)
    document.body.removeChild(wrapper)
})
