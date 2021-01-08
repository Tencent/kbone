<template>
  <div class="cnt">
    <mp-navigation-bar>
      <div slot="center">我是标题</div>
    </mp-navigation-bar>
    <button type="default" @click="dialogShow = true">确认取消按钮</button>
    <button type="default" @click="showOneButtonDialog = true">只有确认按钮</button>
    <mp-dialog title="test" :show="dialogShow" @buttontap="dialogShow = false" :buttons="buttons">
      <view>test content</view>
    </mp-dialog>
    <mp-dialog title="test1" :show="showOneButtonDialog" @buttontap="showOneButtonDialog = false" :buttons="oneButton">
      <view>test content1</view>
    </mp-dialog>
    <mp-msg type="success" title="操作成功">
      <div slot="desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现</div>
      <div slot="extend">
        <div>1. 说明1</div>
        <div>2. 说明2</div>
      </div>
      <div slot="handle">
        <wx-button class="weui-btn" type="primary">主要操作</wx-button>
        <wx-button class="weui-btn" type="default">辅助操作</wx-button>
      </div>
      <div slot="footer">
        <div class="weui-footer__links">
          <a href="" class="weui-footer__link">底部链接文本</a>
        </div>
      </div>
    </mp-msg>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      dialogShow: false,
      showOneButtonDialog: false,
      buttons: [{text: '取消'}, { text: '确定'}],
      oneButton: JSON.stringify([{text: '确定'}]), // 也支持传 json 串，用于对付某些会将属性值转成字符串的 Web 框架
    }
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
