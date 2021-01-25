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
    <button class="btn" ref="btn" @tap="log('tap')" @click="log('click')" @longpress="log('longpress')">only click</button>
    <div style="margin-left: 20px;">
      <p>这是<span>1</span>段中间插入了span的文本</p>
    </div>
    <div style="margin: 20px;">
      <p style="width: 10rem;">这段看起来特别特别长的文字宽度是 10 rem，测试测试测试测试测试测试测试测试测试测试测试测试</p>
    </div>
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
  },
  methods: {
    log(...args) {
      console.log(...args)
    },
  
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
