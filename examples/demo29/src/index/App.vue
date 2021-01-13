<template>
  <div>
    <div style="margin-top: 100px; display: flex; justify-content: center;">
      <div ref="animation-cnt" style="width: 200px; height: 30px; line-height: 30px; text-align: center; background: red; color: #fff;">关键帧动画元素</div>
    </div>
    <button class="btn" @click="startAnimation">开始关键帧动画</button>
    <button class="btn" @click="stopAnimation">取消关键帧动画</button>
    <wx-scroll-view id="scroller" :scroll-y="true" style="height: 200px; width: 100%;">
      <div style="width: 100%; background: #ccc;">
        <div style="text-align: center; font-size: 18px;">这是 scroll-view，请往下滚动</div>
        <div style="margin-top: 140px; display: flex; justify-content: center;">
          <div ref="animation-cnt-2" style="transform: sclae(0.2); border-radius: 15px; width: 200px; height: 30px; line-height: 30px; text-align: center; background: red; color: #fff;">滚动驱动动画元素</div>
        </div>
        <div style="height: 500px;"></div>
      </div>
    </wx-scroll-view>
    <div style="margin-top: 20px; width: 100%; display: flex; justify-content: center;">
      <wx-animation style="width: 200rpx; height: 200rpx; background-color: #1AAD19;" :animation="animation"></wx-animation>
    </div>
    <button class="btn" @click="doRotate">旋转</button>
    <button class="btn" @click="doScale">缩放</button>
    <button class="btn" @click="doTranslate">移动</button>
    <button class="btn" @click="doSkew">倾斜</button>
    <button class="btn" @click="doRotateAndScale">旋转并缩放</button>
    <button class="btn" @click="doRotateThenScale">旋转后缩放</button>
    <button class="btn" @click="doAll">同时展示全部</button>
    <button class="btn" @click="doAllInQueue">顺序展示全部</button>
    <button class="btn" @click="doReset">还原</button>
    <Footer/>
  </div>
</template>

<script>
import Footer from '../common/Footer.vue'

export default {
  name: 'App',
  components: {
    Footer,
  },
  data() {
    return {
      animation: undefined,
    }
  },
  mounted() {
    // 滚动驱动动画
    setTimeout(() => {
      this.$refs['animation-cnt-2'].$$animate([{
        borderRadius: '15px',
        transform: 'scale(0.2)',
        offset: 0,
      }, {
        borderRadius: '10px',
        transform: 'scale(.5)',
        offset: .5,
      }, {
        borderRadius: '0',
        transform: `scale(1)`,
        offset: 1
      }], 2000, {
        scrollSource: '#scroller',
        timeRange: 2000,
        startScrollOffset: 0,
        endScrollOffset: 85,
      })
    }, 500)

    if (process.env.isMiniprogram) {
      this.animationObj = wx.createAnimation()
    }
  },
  methods: {
    startAnimation() {
      this.$refs['animation-cnt'].$$animate([
        {scale: [1, 1], rotate: 0, ease: 'ease-out'},
        {scale: [1.5, 1.5], rotate: 45, ease: 'ease-in', offset: 0.9},
        {scale: [2, 2], rotate: 90},
      ], 5000, () => {
        console.log('动画正常结束')
        this.$refs['animation-cnt'].$$clearAnimation({scale: true, rotate: true}, () => {
          console.log('清除动画属性')
        })
      })
    },

    stopAnimation() {
      this.$refs['animation-cnt'].$$clearAnimation({scale: true, rotate: true}, () => {
        console.log('清除动画属性')
      })
    },

    doRotate() {
      if (this.animationObj) {
        this.animationObj.rotate(Math.random() * 720 - 360).step()
        this.animation = this.animationObj.export()
      }
    },

    doScale() {
      if (this.animationObj) {
        this.animationObj.scale(Math.random() * 2).step()
        this.animation = this.animationObj.export()
      }
    },

    doTranslate() {
      if (this.animationObj) {
        this.animationObj.translate(Math.random() * 100 - 50, Math.random() * 100 - 50).step()
        this.animation = this.animationObj.export()
      }
    },

    doSkew() {
      if (this.animationObj) {
        this.animationObj.skew(Math.random() * 90, Math.random() * 90).step()
        this.animation = this.animationObj.export()
      }
    },

    doRotateAndScale() {
      if (this.animationObj) {
        this.animationObj.rotate(Math.random() * 720 - 360)
          .scale(Math.random() * 2)
          .step()
        this.animation = this.animationObj.export()
      }
    },

    doRotateThenScale() {
      if (this.animationObj) {
        this.animationObj.rotate(Math.random() * 720 - 360).step()
          .scale(Math.random() * 2)
          .step()
        this.animation = this.animationObj.export()
      }
    },

    doAll() {
      if (this.animationObj) {
        this.animationObj.rotate(Math.random() * 720 - 360)
          .scale(Math.random() * 2)
          .translate(Math.random() * 100 - 50, Math.random() * 100 - 50)
          .skew(Math.random() * 90, Math.random() * 90)
          .step()
        this.animation = this.animationObj.export()
      }
    },

    doAllInQueue() {
      if (this.animationObj) {
        this.animationObj.rotate(Math.random() * 720 - 360)
          .step()
          .scale(Math.random() * 2).step()
          .translate(Math.random() * 100 - 50, Math.random() * 100 - 50).step()
          .skew(Math.random() * 90, Math.random() * 90)
          .step()
        this.animation = this.animationObj.export()
      }
    },

    doReset() {
      if (this.animationObj) {
        this.animationObj.rotate(0, 0)
          .scale(1)
          .translate(0, 0)
          .skew(0, 0)
          .step({duration: 0})
        this.animation = this.animationObj.export()
      }
    },
  },
}
</script>

<style>
.btn {
  display: block;
  margin: 15px auto;
  width: 250px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #000;
  font-size: 16px;
  background: #dff1e7;
  border-radius: 5px;
}
</style>
