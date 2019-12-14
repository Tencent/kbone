<template>
  <div class="header">
    <p>wechat-miniprogram</p>
  </div>
</template>

<script>
import {printf} from './utils'

export default {
  mounted() {
    printf('I am Header --> kbone')
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
