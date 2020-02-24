<template>
  <div class="container">
    <div class="list">
      <div class="list-item">
        <span class="black">调用失败</span>
      </div>
      <div class="list-item">
        <span class="request-text">请检查 login 云函数是否已部署</span>
      </div>
    </div>

    <div class="guide">
      <span class="headline">部署 login 云函数</span>
      <span class="p">1. 确保已通过工具栏云开发入口开通云开发</span>
      <span class="p">2. 在 cloudfunctions/login 目录上右键上传并部署</span>
      <span class="p">3. 回到首页，重新点击获取 openid</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
@import "../style/guide";

.black {
  color: black;
}
</style>
