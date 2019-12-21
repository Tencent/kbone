<template>
  <div class="cnt"></div>
</template>

<script>
import AlloyFinger from 'alloyfinger'

export default {
  name: 'App',
  mounted() {
    new AlloyFinger(this.$el, {
      touchStart() {
        console.log('touchStart')
      },
      touchMove() {
        console.log('touchMove')
      },
      touchEnd() {
        console.log('touchEnd')
      },
      touchCancel() {
        console.log('touchCancel')
      },
      multipointStart() {
        console.log('multipointStart')
      },
      multipointEnd() {
        console.log('multipointEnd')
      },
      tap() {
        console.log('tap')
      },
      doubleTap() {
        console.log('doubleTap')
      },
      longTap() {
        console.log('longTap')
      },
      singleTap() {
        console.log('singleTap')
      },
      rotate(evt) {
        console.log('rotate', evt.angle)
      },
      pinch(evt) {
        console.log('pinch', evt.zoom)
      },
      pressMove(evt) {
        console.log('pressMove', evt.deltaX, evt.deltaY)
      },
      swipe(evt) {
        console.log('swipe', evt.direction)
      },
    })
  },
}
</script>

<style>
.cnt {
  width: 100%;
  height: 1000px;
  background: greenyellow;
}
</style>
