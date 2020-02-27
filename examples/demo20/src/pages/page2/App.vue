<template>
  <div class="cnt">
    <m-header></m-header>
    <m-link href="/page1">回到首页</m-link>
    <button @click="onClickJump">回到首页</button>
    <m-footer></m-footer>
  </div>
</template>

<script>
import navigator from '@/lib/navigator'
import { onWxLoad, onWxShow, onWxReady, onWxHide, onWxUnload } from '@/lib/wxLife'

export default {
  name: 'App',
  setup () {
    console.log('after set cookie', document.cookie)
    onWxLoad(query => console.log('page2 wxload', query))
    onWxShow(() => console.log('page2 wxshow'))
    onWxReady(() => console.log('page2 wxready'))
    onWxHide(() => console.log('page2 wxhide'))
    onWxUnload(() => console.log('page2 wxunload'))
    return {
      onClickJump () {
        navigator.to('/page1')
      }
    }
  }
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
