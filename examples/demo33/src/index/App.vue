<template>
  <canvas
    type="webgl"
    ref="canvas"
  ></canvas>
</template>

<script>
import * as threeModule from 'threejs'
import * as orbitModule from 'OrbitControls'

let negx = 'https://res.wx.qq.com/op_res/m_LtPXT7r0J-oE8bg_b-fR13m0F86unvY6ZBrcyNMghxrU7e7mvpcl-Gfe05zZXKjrdmvAbwI3o3XEPw6EMhKw'
let negy = 'https://res.wx.qq.com/op_res/m_LtPXT7r0J-oE8bg_b-fY42lpJZ0pby6nbp-hiE4SlMRQYjFZ7vUHyGo9k2cnt8ThbOhhqXV5PJcFbSstunCA'
let negz = 'https://res.wx.qq.com/op_res/m_LtPXT7r0J-oE8bg_b-feNKHxp4vipZ2zANFe79cSroZS1MxFbEICn-BBiXM8sX2OQrks7DyWtGpRDtYi5COw'
let posx = 'https://res.wx.qq.com/op_res/CHdJxEMpxQxLqpWVe01CQh7aQ8Fs3NuzPmJXJoJU7pnprB5gxQ4xIrr0uojukw9JTzbpU_TyrOl-AI4O7JrDaA'
let posy = 'https://res.wx.qq.com/op_res/CHdJxEMpxQxLqpWVe01CQvnpGYq24F7r_CJVbCIeHHRpkiWxOFpbDAAbJcNZvUsZhg5oEZtC4fHVS9DIf1du7g'
let posz = 'https://res.wx.qq.com/op_res/CHdJxEMpxQxLqpWVe01CQi9lxEWNS6GM5J7hpXBkGe8v3NfCRzm9d0prT9fCVL36TmcSKtFmTH6IXtaxt6pKIw'
let width = 0
let height = 0
let devicePixelRatio = 2
let THREE
let OrbitControls

export default {
  name: 'App',
  mounted() {
    const canvas = this.$refs.canvas

    if (process.env.isMiniprogram) {
      const systemInfo = wx.getSystemInfoSync()
      width = systemInfo.windowWidth
      height = systemInfo.windowHeight
      devicePixelRatio = systemInfo.devicePixelRatio

      canvas.width = width
      canvas.height = height

      canvas.$$getNodesRef().then(nodesRef => {
        nodesRef.node(res => {
          // 事件转成 threejs 需要的事件
          const transEvt = (node, type, evt) => {
            return {
              type,
              target: node,
              timeStamp: evt.timeStamp,
              touches: evt.touches,
              changedTouches: evt.changedTouches,
              detail: evt.timeSdetailtamp,
            }
          }
          canvas.addEventListener('canvastouchstart', evt => node.dispatchTouchEvent(transEvt(node, 'touchstart', evt)))
          canvas.addEventListener('canvastouchmove', evt => node.dispatchTouchEvent(transEvt(node, 'touchmove', evt)))
          canvas.addEventListener('canvastouchend', evt => node.dispatchTouchEvent(transEvt(node, 'touchend', evt)))
          canvas.addEventListener('canvastouchcancel', evt => node.dispatchTouchEvent(transEvt(node, 'touchcancel', evt)))

          const node = res.node
          node.width = width
          node.height = height
          THREE = threeModule.createScopedThreejs(node)
          OrbitControls = orbitModule.default(THREE).OrbitControls
          this.init(node)
        }).exec()
      })
    } else {
      // chrome 下 localhost cors 有限制，故改本地资源方便体验
      negx = '/res/negx.jpg'
      negy = '/res/negy.jpg'
      negz = '/res/negz.jpg'
      posx = '/res/posx.jpg'
      posy = '/res/posy.jpg'
      posz = '/res/posz.jpg'
      width = window.innerWidth
      height = window.innerHeight
      devicePixelRatio = window.devicePixelRatio

      canvas.width = width
      canvas.height = height

      THREE = threeModule
      OrbitControls = orbitModule.OrbitControls
      this.init(canvas)
    }
  },
  methods: {
    init(canvas) {
      // camera
      const camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000)
      camera.position.set(0, 0, 1000)

      // scene
      const scene = new THREE.Scene()

      // 光线
      const ambient = new THREE.AmbientLight(0xffffff)
      scene.add(ambient)

      // skybox
      const loader = new THREE.CubeTextureLoader()
      const textureCube = loader.load([posx, negx, posy, negy, posz, negz])
      textureCube.format = THREE.RGBFormat
      textureCube.mapping = THREE.CubeReflectionMapping
      textureCube.encoding = THREE.sRGBEncoding
      scene.background = textureCube

      // renderer
      const renderer = new THREE.WebGLRenderer({canvas})
      renderer.setPixelRatio(devicePixelRatio)
      renderer.setSize(width, height)
      renderer.gammaOutput = true

      // 手势控制
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.minDistance = 500
      controls.maxDistance = 2500

      // 渲染
      const onUpdate = () => {
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        requestAnimationFrame(onUpdate)
      }
      onUpdate()
    }
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}
</style>
