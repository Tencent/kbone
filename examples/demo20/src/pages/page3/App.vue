<template>
  <div class="cnt">
    <m-header></m-header>
    <button @click="onClickBack">回到上一页</button>
    <m-footer></m-footer>
  </div>
</template>

<script>
import navigator from '@/lib/navigator'
import { onWxLoad, onWxShow, onWxReady, onWxHide, onWxUnload } from '@/lib/wxLife'

export default {
  name: 'App',
  setup () {
    onWxLoad(query => console.log('page3 wxload', query))
    onWxShow(() => console.log('page3 wxshow'))
    onWxReady(() => console.log('page3 wxready'))
    onWxHide(() => console.log('page3 wxhide'))
    onWxUnload(() => console.log('page3 wxunload'))
    return {
      onClickBack () {
        navigator.back()
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
