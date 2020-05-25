function wrapTouch(evt) {
  for (let i = 0, len = evt.touches.length; i < len; ++i) {
    const touch = evt.touches[i]
    touch.offsetX = touch.x
    touch.offsetY = touch.y
  }
  return evt
}

export function getChart(canvas, echarts, options) {
  return new Promise((resolve, reject) => {
    // 使用新的 canvas 接口：https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
    canvas.$$prepare().then(canvas => {
      // 避免走 document.createElement('canvas') 接口
      echarts.setCanvasCreator(() => canvas)
      
      // echarts.env.wxa = false // 去除小程序环境判断，为了走正常的 tooltip 创建逻辑
      // echarts.env.domSupported = true // 补充 dom 支持判断，让其走正常的 touch 事件处理，但是此处因为没有同步 getBoundingClientRect，会导致 zrX/zrY 计算错误，故注释

      canvas.addEventListener('canvastouchstart', evt => {
          if (chart && evt.touches.length > 0) {
              const touch = evt.touches[0]
              const handler = chart.getZr().handler
              handler.dispatch('mousedown', {
                zrX: touch.x,
                zrY: touch.y,
              })
              handler.dispatch('mousemove', {
                zrX: touch.x,
                zrY: touch.y,
              })
              handler.processGesture(wrapTouch(evt), 'start')
          }
      })

      canvas.addEventListener('canvastouchmove', evt => {
          if (chart && evt.touches.length > 0) {
              const touch = evt.touches[0]
              const handler = chart.getZr().handler
              handler.dispatch('mousemove', {
                zrX: touch.x,
                zrY: touch.y,
              })
              handler.processGesture(wrapTouch(evt), 'change')
          }
      })

      canvas.addEventListener('canvastouchend', evt => {
          if (chart) {
              const touch = evt.changedTouches ? evt.changedTouches[0] : {}
              const handler = chart.getZr().handler
              handler.dispatch('mouseup', {
                zrX: touch.x,
                zrY: touch.y,
              })
              handler.dispatch('click', {
                zrX: touch.x,
                zrY: touch.y,
              })
              handler.processGesture(wrapTouch(evt), 'end')
          }
      })

      // 为了拿到正确的 zrX/zrY，不走正常的 touch 事件
      canvas.addEventListener = () => {}

      const chart = echarts.init(canvas, null, {
          width: options.width || 300,
          height: options.height || 150,
          devicePixelRatio: options.devicePixelRatio,
      })

      resolve(chart)
    }).catch(reject)
  })
}