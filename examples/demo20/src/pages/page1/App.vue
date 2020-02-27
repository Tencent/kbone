<template>
  <div class="cnt">
    <m-header></m-header>
    <div class="title">{{text}}</div>
    <m-link href="/page2">当前页跳转</m-link>
    <m-link href="/page3" target="_blank">新开页面跳转</m-link>
    <button @click="onClickJump">当前页跳转</button>
    <button @click="onClickOpen">新开页面跳转</button>
    <m-footer></m-footer>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import navigator from '@/lib/navigator'
import { onWxLoad, onWxShow, onWxReady, onWxHide, onWxUnload } from '@/lib/wxLife'

export default {
  name: 'App',
  setup () {
    const state = reactive({
      text: '首页'
    })
    onWxLoad(query => console.log('page1 wxload', query))
    onWxShow(() => console.log('page1 wxshow'))
    onWxReady(() => console.log('page1 wxready'))
    onWxHide(() => console.log('page1 wxhide'))
    onWxUnload(() => console.log('page1 wxunload'))

    onUnmounted(() => console.log('page1 onUnmounted'))
    onBeforeUnmount(() => console.log('page1 onBeforeUnmount'))
    // cookie
    onMounted(() => {
      console.log('page1 onMounted')
      console.log('before set cookie', document.cookie)
      document.cookie = `time=${+new Date()}; expires=Wed Jan 01 2220 00:00:00 GMT+0800; path=/`
      console.log('after set cookie', document.cookie)
    })
    onBeforeMount(() => console.log('page1 onBeforeMount'))
    return {
      ...toRefs(state),
      onClickJump () {
        navigator.to('/page2')
      },
      onClickOpen () {
        navigator.open('/page3')
      }
    }
  }
}
</script>

<style>
.cnt {
  margin-top: 20px;
}

.title {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
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
