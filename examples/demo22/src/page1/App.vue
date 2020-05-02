<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page2" target="_blank">跳转页面2</a>
    <a href="/page3" target="_blank">跳转页面3</a>
    <a href="/page4" target="_blank">跳转页面4</a>
    <button @click="startFetchData">开启数据更新</button>
    <button @click="startFetchList">开启列表更新</button>
    <div>count: {{count}} - {{say && say.word || ''}} name: {{info.name || ''}}</div>
    <div>{{list.join(', ')}}</div>
    <Storage name="1"></Storage>
    <Footer></Footer>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import Storage from '../common/Storage.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Storage,
  },
  computed: {
    ...mapState(['count', 'say', 'info', 'list'])
  },
  mounted() {
    let count = 0
    setInterval(() => {
      console.log('开始发送轮询消息，10s一次')
      window.$$publish('polling', ++count)
    }, 10000)
    window.$$subscribe('page1', data => console.log('首页收到来自其他页面的消息', data))
  },
  methods: {
    startFetchData() {
      const sayWordList = ['hello', 'hi', 'bye']
      const nameList = ['june', 'green']
      let count = 0
      let sayWord = sayWordList[count % 3]
      let name = nameList[count % 2]

      setInterval(() => {
        count++
        sayWord = sayWordList[count % 3]
        name = nameList[count % 2]

        this.FETCH_DATA({
          count,
          name,
          say: {
            word: sayWord,
          },
        })
      }, 1000)
    },

    startFetchList() {
      let count = 0
      
      setInterval(() => {
        count++

        this.FETCH_LIST({
          count,
        })
      }, 1000)
    },

    ...mapActions(['FETCH_DATA', 'FETCH_LIST'])
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
  text-align: center;
}
a, button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
