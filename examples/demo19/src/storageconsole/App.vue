<template>
  <div class="container">
    <div class="list">
      <div class="list-item">
        <span class="black">上传成功</span>
      </div>
      <div class="list-item">
        <span class="request-text">文件 ID：{{fileID}}</span>
      </div>
      <div class="list-item">
        <span class="request-text">云文件路径：{{cloudPath}}</span>
      </div>
      <div class="list-item">
        <img class="image1" :src="imagePath" mode="aspectFit" />
      </div>
    </div>

    <div class="guide">
      <span class="headline">云开发控制台中管理文件</span>
      <span class="p">1. 打开云开发控制台</span>
      <img class="image1" src="../images/console-entrance.png" mode="aspectFit" />
      <span class="p">2. 切换到文件管理标签页</span>
      <span class="p">3. 可查看文件列表、管理权限</span>
      <span class="p">4. 详细的教程和 API 文件，可点击调试器中打印的链接查看</span>
    </div>
  </div>
</template>

<script>
const app = getApp()

export default {
  name: 'App',
  data() {
    return {
      fileID: '',
      cloudPath: '',
      imagePath: '',
    }
  },
  mounted() {
    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData

    this.fileID = fileID
    this.cloudPath = cloudPath
    this.imagePath = imagePath

    console.group('文件存储文档')
    console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html')
    console.groupEnd()
  },
}
</script>

<style lang="less">
@import "../style/guide";

.black {
  color: black;
}
</style>
