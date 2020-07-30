<template>
  <div class="cnt">
    <Header></Header>
    <a href="/page2.html" target="_blank">打开 page2</a>
    <a href="/page3.html" target="_blank">打开 page3</a>
    <button @click="createWorker">创建 worker</button>
    <button @click="stopWorker">关闭 worker</button>
    <button @click="sendMsgToWorker">发送信息给 worker</button>
    <button @click="createSharedWorker">创建 sharedWorker</button>
    <button @click="stopSharedWorker">关闭 sharedWorker</button>
    <button @click="sendMsgToSharedWorker">发送信息给 sharedWorker</button>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import MyWorker from '../worker/worker'
import MySharedWorker from '../worker/sharedWorker'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  methods: {
    createWorker() {
      this.worker = new MyWorker()
      console.log('worker create')
      this.worker.onmessage = evt => {
        console.log('worker.onmessage: ', evt, evt.data)
      }
      this.worker.addEventListener('message', evt => {
        console.log('worker.addEventListener: ', evt, evt.data)
      })
    },

    stopWorker() {
      if (this.worker) {
        this.worker.terminate()
        console.log('worker terminate')
      }
    },

    sendMsgToWorker() {
      if (this.worker) this.worker.postMessage({from: 'page1', to: 'worker'})
    },

    createSharedWorker() {
      this.sharedWorker = new SharedWorker(MySharedWorker.toString().match(/"(.*?)"/)[1])
      console.log('sharedWorker create')
      this.sharedWorker.port.onmessage = evt => {
        console.log('sharedWorker.onmessage: ', evt, evt.data)
      }
      this.sharedWorker.port.addEventListener('message', evt => {
        console.log('sharedWorker.addEventListener: ', evt, evt.data)
      })
    },

    stopSharedWorker() {
      if (this.sharedWorker) {
        this.sharedWorker.port.close()
        console.log('sharedWorker terminate')
      }
    },

    sendMsgToSharedWorker() {
      if (this.sharedWorker) this.sharedWorker.port.postMessage({from: 'page1', to: 'sharedWorker'})
    },
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
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
