<template>
  <div class="header">
    <p>wechat-miniprogram</p>
  </div>
</template>

<script>
import add from 'add'
import {printf} from './utils'

export default {
  mounted() {
    printf('I am Header --> ' + add([7, 8]))
  },
}
</script>

<style>
.header {
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
}
</style>
