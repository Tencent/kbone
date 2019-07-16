const _ = require('./utils')

test('render', () => {
  // TODO
  const page = global.$$page
  const componentId = _.load({
    template: `<element class="h5-body" style="width: 100%; height: 100%;" data-private-node-id="e-body" data-private-page-id="${page.pageId}"></element>`,
    usingComponents: {
      element: _.load('index', 'element'),
    },
  }, 'page')
  const component = _.render(componentId)

  component.attach(document.body)

  console.log(document.body.innerHTML)

  const node1 = page.document.createElement('article')
  // const node2 = document.createElement('span')
  // const node3 = document.createElement('div')
  // const node4 = document.createTextNode('123')
  // const node5 = document.createElement('span')
  // const node6 = document.createTextNode('321')
  // const node7 = document.createTextNode('555')
  // const node8 = document.createElement('br')
  // node5.appendChild(node7)
  // node3.appendChild(node4)
  // node3.appendChild(node5)
  // node3.appendChild(node6)
  // node1.appendChild(node2)
  // node1.appendChild(node3)
  // node1.appendChild(node8)
  page.document.body.appendChild(node1)

  console.log(component.querySelector('.h5-body').data)
  console.log(document.body.innerHTML)
})
