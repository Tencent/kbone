<template>
  <div>
    <List />
  </div>
</template>

<script>
import List from './common/list.vue'

export default {
  name: 'App',
  components: {
    List
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
  },
}
</script>

<style>
body {
  font-size: 16px;
  /* background-color: #EEEEEE; */
}
</style>
