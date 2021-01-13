<template>
  <div>
    <ul class="tabbar">
      <li><router-link class="link" to="/test/aaa">aaa</router-link></li>
      <li><router-link class="link" to="/test/bbb">bbb</router-link></li>
    </ul>
    <router-view></router-view>
    <button class="btn" @click="consoleGlobal">console global</button>
    <button class="btn" @click="throwError">throw an error</button>
    <button class="btn" ref="btn" @click="updateStyle">update style</button>
    <div style="margin-left: 20px;">
      <p>这是<span>1</span>段中间插入了span的文本</p>
    </div>
    <div style="margin: 20px;">
      <p style="width: 10rem;">这段看起来特别特别长的文字宽度是 10 rem，测试测试测试测试测试测试测试测试测试测试测试测试</p>
    </div>
    <div style="margin: 20px; display: flex; justify-content: center;">
      <div ref="animation-cnt" style="width: 200px; height: 30px; line-height: 30px; text-align: center; background: red; color: #fff;">关键帧动画元素</div>
    </div>
    <button class="btn" @click="startAnimation">开始关键帧动画</button>
    <button class="btn" @click="stopAnimation">取消关键帧动画</button>
    <wx-scroll-view id="scroller" :scroll-y="true" style="height: 200px; width: 100%;">
      <div style="width: 100%; background: #ccc;">
        <div>这是 scroll-view，请往下滚动</div>
        <div style="margin: 80px; display: flex; justify-content: center;">
          <div ref="animation-cnt-2" style="transform: sclae(0.2); border-radius: 15px; width: 200px; height: 30px; line-height: 30px; text-align: center; background: red; color: #fff;">滚动驱动动画元素</div>
        </div>
        <div style="height: 1000px;"></div>
      </div>
    </wx-scroll-view>
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
  mounted() {
    console.log(TEST_VAR_STRING)
    console.log(TEST_VAR_NUMBER)
    console.log(TEST_VAR_BOOL)
    console.log(TEST_VAR_FUNCTION)
    console.log(TEST_VAR_OTHERS)
    console.log(open)
    console.log('self --> ', self)
    console.log('HTMLElement --> ', HTMLElement)
    console.log('Element --> ', Element)
    console.log('Node --> ', Node)
    console.log('localStorage --> ', localStorage)
    console.log('sessionStorage --> ', sessionStorage)
    console.log('navigator --> ', navigator)
    console.log('history --> ', history)
    console.log('location --> ', location)
    console.log('performance --> ', performance)
    console.log('Image --> ', Image)
    console.log('CustomEvent --> ', CustomEvent)
    console.log('Event --> ', Event)
    console.log('requestAnimationFrame --> ', requestAnimationFrame)
    console.log('cancelAnimationFrame --> ', cancelAnimationFrame)

    // cookie
    console.log('before set cookie', document.cookie)
    document.cookie = `time=${+new Date()}; expires=Wed Jan 01 2220 00:00:00 GMT+0800; path=/`
    console.log('after set cookie', document.cookie)

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
  },
  methods: {
    consoleGlobal() {
      console.log('global: ', global) // 如果配置了 node.global = false，则可以拿到小程序的 global，默认是 window 对象
    },

    throwError() {
      setTimeout(() => {
        throw new Error('I am an error')
      }, 0)
    },

    updateStyle() {
      if (this.$refs.btn.style.backgroundColor === '#000') {
        this.$refs.btn.style.backgroundColor = '#dff1e7'
        this.$refs.btn.style.color = '#000'
      } else {
        this.$refs.btn.style.backgroundColor = '#000'
        this.$refs.btn.style.color = '#fff'
      }
    },

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
  },
}
</script>

<style>
.tabbar {
  margin-top: 20px;
  padding: 0;
  width: 100%;
  display: flex;
  list-style: none;
  justify-content: center;
}
.tabbar li {
  position: relative;
  display: block;
  height: 50px;
  width: 80px;
  text-align: center;
  line-height: 50px;
  background: #dff1e7;
  margin: 5px;
}
.tabbar li .link {
  display: block;
  width: 100%;
  height: 100%;
}
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
