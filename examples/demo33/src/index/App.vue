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
let total360 = 'https://res.wx.qq.com/op_res/jhgYUBa8GgeG9mV42CtwLmWCGHIvCb-6k3_lWjKB4FCydOsLyfq2U9PD4MSK2IDhLz9rrHAwS6Qtjb4W69KsmA'
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
      total360 = '/res/total360.jpg'
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

      // 立方体
      const textureCube = new THREE.CubeTextureLoader().load([posx, negx, posy, negy, posz, negz])
      textureCube.format = THREE.RGBFormat
      textureCube.mapping = THREE.CubeReflectionMapping
      textureCube.encoding = THREE.sRGBEncoding
      scene.background = textureCube

      // 球体
      // const textureEquirec = new THREE.TextureLoader().load(total360, res => console.log('@@@@@@@', res), undefined, err => console.log('#########', err))
      // textureEquirec.needsUpdate = true
      // textureEquirec.updateMatrix()
      // const equirectGeometry = new THREE.SphereGeometry(100, 32, 16)
      // const equirectMaterial = new THREE.ShaderMaterial({
      //   wireframe: false,
      //   side: THREE.DoubleSide,
      //   uniforms: {
      //     tex_0: new THREE.Uniform(textureEquirec),
      //   },
      //   vertexShader: `
      //     precision highp float;
      //     varying vec2 v_uv;
      //     void main() {
      //         gl_Position = projectionMatrix *
      //             modelViewMatrix *
      //             vec4(position.xyz, 1.0);
      //         v_uv = uv;
      //     }
      //   `,
      //   fragmentShader: `
      //     precision highp float;
      //     varying vec2 v_uv;
      //     uniform sampler2D tex_0;
      //     void main() {
      //         vec4 texColor = texture2D(tex_0, vec2(1. - v_uv.x, v_uv.y));
      //         gl_FragColor = texColor;
      //     }
      //   `,
      // })
      // const mesh = new THREE.Mesh(equirectGeometry, equirectMaterial)
      // scene.add(mesh)

      // renderer
      const renderer = new THREE.WebGLRenderer({canvas})
      renderer.setPixelRatio(devicePixelRatio)
      renderer.setSize(width, height)
      renderer.gammaOutput = true

      // 手势控制
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.maxDistance = 100
      controls.update()

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
