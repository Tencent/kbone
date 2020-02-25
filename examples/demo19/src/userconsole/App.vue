<template>
  <div class="container">
    <div class="list">
      <div class="list-item">
        <span class="request-text">用户 openid 获取成功</span>
      </div>
      <div class="list-item">
        <span class="request-text">{{openid}}</span>
      </div>
    </div>

    <!-- 云开发用户管理指引 -->
    <div class="guide">
      <span class="headline">云开发管理用户</span>
      <span class="p">1. 打开云开发控制台</span>
      <img class="image1" src="../images/console-entrance.png" mode="aspectFit" />
      <span class="p">2. 切换到 "用户管理" 标签页</span>
      <span class="p">3. 查看访问小程序的用户列表</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      openid: '',
    }
  },
  mounted() {
    this.openid = getApp().globalData.openid
  },
}
</script>

<style lang="less">
@import "../style/guide";
</style>
