const _ = require('./utils')

test('render', async() => {
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

    const node1 = page.document.createElement('article')
    const node2 = page.document.createElement('span')
    const node3 = page.document.createElement('div')
    const node4 = page.document.createTextNode('123')
    const node5 = page.document.createElement('span')
    const node6 = page.document.createTextNode('321')
    const node7 = page.document.createTextNode('555')
    const node8 = page.document.createElement('br')
    node5.appendChild(node7)
    node3.appendChild(node4)
    node3.appendChild(node5)
    node3.appendChild(node6)
    node1.appendChild(node2)
    node1.appendChild(node3)
    node1.appendChild(node8)
    page.document.body.appendChild(node1)
    await _.sleep(10)
    expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId}" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            <wx-view class="element--h5-div element--node-${node3.$$nodeId}" data-private-node-id="${node3.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                123
                <wx-view class="element--h5-span element--node-${node5.$$nodeId}" data-private-node-id="${node5.$$nodeId}" data-private-page-id="${page.pageId}" style="">555</wx-view>
                321
            </wx-view>
            <wx-view class="element--h5-br element--node-${node8.$$nodeId}" data-private-node-id="${node8.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
        </wx-view>
    </element>`))
    expect(node1.$$wxComponent).toBe(component.querySelector('.h5-body').instance)
    expect(node2.$$wxComponent).toBe(component.querySelector('.h5-body').instance)
    expect(node3.$$wxComponent).toBe(component.querySelector('.h5-body').instance)
    expect(node5.$$wxComponent).toBe(component.querySelector('.h5-body').instance)
    expect(node8.$$wxComponent).toBe(component.querySelector('.h5-body').instance)

    node1.removeChild(node3)
    node1.replaceChild(node4, node8)
    await _.sleep(10)
    expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId}" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            123
        </wx-view>
    </element>`))

    node1.style.display = 'flex'
    node2.classList.add('test-node2')
    await _.sleep(10)
    expect(_.getSimpleHTML(component.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-article element--node-${node1.$$nodeId}" data-private-node-id="${node1.$$nodeId}" data-private-page-id="${page.pageId}" style="display:flex;">
            <wx-view class="element--h5-span element--node-${node2.$$nodeId} element--test-node2" data-private-node-id="${node2.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
            123
        </wx-view>
    </element>`))

    document.body.removeChild(wrapper)
    page.document.body.removeChild(node1)
    component.detach()

    // event
    const evtList = []
    const component2 = _.render(componentId)
    const evtWrapper = document.createElement('div')
    document.body.appendChild(evtWrapper)
    component2.attach(evtWrapper)

    const evtNode1 = page.document.createElement('div')
    evtNode1.id = 'n1'
    evtNode1.addEventListener('click', () => evtList.push(1))
    page.document.body.appendChild(evtNode1)
    const evtNode2 = page.document.createElement('div')
    evtNode2.id = 'n2'
    evtNode2.addEventListener('click', () => evtList.push(2))
    evtNode1.appendChild(evtNode2)

    const evtNode3 = page.document.createElement('wx-view')
    evtNode3.id = 'n3'
    evtNode3.addEventListener('click', () => evtList.push(3))
    evtNode2.appendChild(evtNode3)
    const evtNode4 = page.document.createElement('div')
    evtNode4.id = 'n4'
    evtNode4.addEventListener('click', () => evtList.push(4))
    evtNode3.appendChild(evtNode4)
    const evtNode5 = page.document.createElement('div')
    evtNode5.id = 'n5'
    evtNode5.addEventListener('click', () => evtList.push(5))
    evtNode4.appendChild(evtNode5)
    const evtNode6 = page.document.createElement('video')
    evtNode6.id = 'n6'
    evtNode6.addEventListener('click', () => evtList.push(6))
    evtNode5.appendChild(evtNode6)

    const evtNode7 = page.document.createElement('div')
    evtNode7.id = 'n7'
    evtNode7.addEventListener('click', () => evtList.push(7))
    evtNode6.appendChild(evtNode7)
    const evtNode8 = page.document.createElement('div')
    evtNode8.id = 'n8'
    evtNode8.addEventListener('click', () => evtList.push(8))
    evtNode7.appendChild(evtNode8)
    const evtNode9 = page.document.createElement('wx-view')
    evtNode9.id = 'n9'
    evtNode9.addEventListener('click', () => evtList.push(9))
    evtNode8.appendChild(evtNode9)

    const evtNode10 = page.document.createElement('div')
    evtNode10.id = 'n10'
    evtNode10.addEventListener('click', () => evtList.push(10))
    evtNode9.appendChild(evtNode10)

    await _.sleep(10)
    expect(_.getSimpleHTML(component2.dom.innerHTML)).toBe(_.getSimpleHTML(`<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}">
        <wx-view class="element--h5-div element--node-${evtNode1.$$nodeId}" data-private-node-id="${evtNode1.$$nodeId}" data-private-page-id="${page.pageId}" style="">
            <wx-view class="element--h5-div element--node-${evtNode2.$$nodeId}" data-private-node-id="${evtNode2.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                <element class="element--h5-wx-component element--wx-view" data-private-node-id="${evtNode3.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                    <wx-view class="element--wx-comp-view element--node-${evtNode3.$$nodeId}" style="">
                        <wx-view class="element--h5-div element--node-${evtNode4.$$nodeId}" data-private-node-id="${evtNode4.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                            <wx-view class="element--h5-div element--node-${evtNode5.$$nodeId}" data-private-node-id="${evtNode5.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                                <wx-video class="element--h5-video element--wx-comp-video element--node-${evtNode6.$$nodeId}" data-private-node-id="${evtNode6.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                                    <wx-view class="element-vhost--h5-div element-vhost--node-${evtNode7.$$nodeId}" data-private-node-id="${evtNode7.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                                        <wx-view class="element-vhost--h5-div element-vhost--node-${evtNode8.$$nodeId}" data-private-node-id="${evtNode8.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                                            <element class="element-vhost--h5-wx-component element-vhost--wx-view" data-private-node-id="${evtNode9.$$nodeId}" data-private-page-id="${page.pageId}" style="">
                                                <wx-view class="element--wx-comp-view element--node-${evtNode9.$$nodeId}" style="">
                                                    <wx-view class="element--h5-div element--node-${evtNode10.$$nodeId}" data-private-node-id="${evtNode10.$$nodeId}" data-private-page-id="${page.pageId}" style=""></wx-view>
                                                </wx-view>
                                            </element>
                                        </wx-view>
                                    </wx-view>
                                </wx-video>
                            </wx-view>
                        </wx-view>
                    </wx-view>
                </element>
            </wx-view>
        </wx-view>
    </element>`))

    component2.querySelector('.h5-body >>> #n1').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n2').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n3').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n4').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n5').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([5, 4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n6').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([6, 5, 4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n7').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([7, 6, 5, 4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n8').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([8, 7, 6, 5, 4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n9').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])

    evtList.length = 0
    component2.querySelector('.h5-body >>> #n10').dispatchEvent('tap')
    await _.sleep(10)
    expect(evtList).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    document.body.removeChild(evtWrapper)
    page.document.body.removeChild(evtNode1)
    component2.detach()
})
