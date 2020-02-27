<template>
  <div class="footer">
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'MFooter',
  setup () {
    return {
      text: 'wechat-miniprogram'
    }
  }
}
</script>

<style>
.footer {
  margin-top: 10px;
  width: 100%;
  text-align: center;
}
</style>
