<template>
  <div>
    <mp-navigation-bar
      :loading="mpNavigationBar.loading"
      :show="mpNavigationBar.show.toString()"
      :animated="mpNavigationBar.animated.toString()"
      :color="mpNavigationBar.color"
      :background="mpNavigationBar.background"
      :back="true"
    >
      <span slot="center">自定义 Navigation</span>
    </mp-navigation-bar>
    <div class="cnt">
      <wx-view class="item">
        <div class="title">mp-badge</div>
        <div class="comp-cnt">
          <div class="flex">
            <mp-badge ext-class="blue"></mp-badge>
            <mp-badge content="99+"></mp-badge>
            <mp-badge content="8"></mp-badge>
            <mp-badge content="New"></mp-badge>
          </div>
        </div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-gallery</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-loading</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-form</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-form-page</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-cell</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-cells</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-checkbox-group</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-checkbox</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-slideview</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-uploader</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-dialog</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-msg</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-toptips</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-half-screen-dialog</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-actionsheet</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-navigation-bar</div>
        <div class="comp-cnt">
          <!-- 放到最顶端 -->
          <div class="opr-cnt">
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.loading = !mpNavigationBar.loading">触发 loading</wx-button>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.color = '#07C160'">修改文字颜色</wx-button>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.background = '#ededed'">修改背景颜色</wx-button>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.show = !mpNavigationBar.show">显示/隐藏</wx-button>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.animated = !mpNavigationBar.animated">设置显示/隐藏 opacity 动画</wx-button>
          </div>
        </div>
      </wx-view>
          <wx-view class="item">
        <div class="title">mp-tabbar</div>
        <div class="comp-cnt"></div>
      </wx-view>
          <wx-view class="item">
        <div class="title">mp-searchbar</div>
        <div class="comp-cnt"></div>
      </wx-view>
          <wx-view class="item">
        <div class="title">mp-grids</div>
        <div class="comp-cnt"></div>
      </wx-view>

      <!-- <mp-navigation-bar>
        <div slot="center">我是标题</div>
      </mp-navigation-bar> -->
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
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      mpNavigationBar: {
        loading: false,
        color: '#000',
        background: '#f8f8f8',
        show: true,
        animated: false
      },

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
  margin: 30px;
}
@media (prefers-color-scheme: dark) {
  html {
    background-color: #222;
    color: #fff;
  }
  .title {
    color: #000;
  }
}
.title {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background-color: #b8e8ab;
  padding-left: 20px;
}
.comp-cnt {
  padding: 10px;
}
.opr-cnt {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.opr-label, .opr-button  {
  margin: 0 10px 10px;
}
.opr-box {
  flex: 1;
}
.comp-cnt .wx-button {
  margin-bottom: 10px;
}
</style>
