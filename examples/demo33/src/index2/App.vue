<template>
  <div>
    <video
      preload
      ref="video"
      controls
      loop
      style="width: 100%; visibility: hidden; position: absolute"
      :src="videoSrc"
      muted
    ></video>

    <canvas
      type="webgl"
      ref="canvas"
    ></canvas>
  </div>
</template>

<script>
import * as threeModule from 'threejs'
import * as orbitModule from 'OrbitControls'

let width = 0
let height = 0
let devicePixelRatio = 2
let THREE
let OrbitControls

export default {
  name: 'App',
  data() {
    return {
      // chrome 下 localhost cors 有限制，故改本地资源方便体验
      videoSrc: process.env.isMiniprogram ? 'https://vm.gtimg.cn/comps/360/360video2.mp4' : '/res/360video2.mp4',
    }
  },
  mounted() {
    console.warn('小程序侧 webgl 暂时不支持视频纹理')

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
      const camera = new THREE.PerspectiveCamera(45, 1024 / 768, 1, 1000)
      camera.position.z = 30

      // scene
      const scene = new THREE.Scene()

      // 全景视频
      const videoTexture = new THREE.VideoTexture(this.$refs.video)
      videoTexture.needsUpdate = true
      videoTexture.updateMatrix()

      const geometry = new THREE.SphereGeometry(100, 32, 16)
      const material = new THREE.ShaderMaterial({
        wireframe: false,
        side: THREE.DoubleSide,
        map: videoTexture,
        uniforms: {
          tex_0: new THREE.Uniform(videoTexture),
        },
        vertexShader: `
          precision highp float;
          varying vec2 v_uv;
          void main() {
              gl_Position = projectionMatrix *
                  modelViewMatrix *
                  vec4(position.xyz, 1.0);
              v_uv = uv;
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 v_uv;
          uniform sampler2D tex_0;
          void main() {
              vec4 texColor = texture2D(tex_0, vec2(1. - v_uv.x, v_uv.y));
              gl_FragColor = texColor;
          }
        `,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      })
      renderer.setPixelRatio(devicePixelRatio)
      renderer.setSize(width, height)
      renderer.gammaOutput = true

      // 手势控制
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.maxDistance = 100
      controls.update()

      // 渲染
      const onUpdate = () => {
        renderer.render(scene, camera)
        requestAnimationFrame(onUpdate)
      }
      onUpdate()

      // 播发视频
      setTimeout(() => this.$refs.video.play())
    },
  },
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
