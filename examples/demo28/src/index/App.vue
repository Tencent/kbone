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
      <span slot="center">我是标题</span>
    </mp-navigation-bar>
    <div class="cnt">
      <wx-view class="item">
        <div class="title">mp-badge</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-gallery</div>
        <div class="comp-cnt"></div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-loading</div>
        <div class="comp-cnt">
          <mp-loading type="circle"></mp-loading>
          <mp-loading duration="900" ext-class="demo0" type="dot-gray" :show="mpLoading.show" :animated="mpLoading.animated"></mp-loading>
          <mp-loading type="dot-white" ext-class="demo1"></mp-loading>
        </div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-icon</div>
        <div class="comp-cnt">
          <div class="weui-grids">
            <div class="weui-grid mp-icon-cnt" v-for="item in mpIcon.list" :key="item.icon">
              <mp-icon :type="mpIcon.filled ? 'filled' : 'outline'" :icon="item.icon" :color="item.color" :size="item.size"></mp-icon>
              <div class="weui-grid__label">{{item.icon}}</div>
            </div>
          </div>
          <div class="opr-cnt">
            <div class="opr-label">切换黑夜模式</div>
            <wx-switch @change="onMpIconModeChange"></wx-switch>
          </div>
          <div class="opr-cnt">
            <div class="opr-label">切换填充模式</div>
            <wx-switch @change="mpIcon.filled = $event.detail.value"></wx-switch>
          </div>
        </div>
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
        <div class="title">mp-cells/mp-cell</div>
        <div class="comp-cnt">
          <mp-cells title="带说明的列表项">
            <mp-cell value="标题文字" footer="说明文字"></mp-cell>
            <mp-cell>
              <div>标题文字（使用 slot）</div>
              <div slot="footer">说明文字</div>
            </mp-cell>
          </mp-cells>
          <mp-cells title="带图标、说明的列表项" footer="底部说明文字">
            <mp-cell value="标题文字" footer="说明文字">
              <img slot="icon" :src="mpCells.icon" style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"/>
            </mp-cell>
            <mp-cell value="标题文字" footer="说明文字">
              <img slot="icon" :src="mpCells.icon" style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"/>
            </mp-cell>
          </mp-cells>
          <mp-cells title="带跳转的列表项">
            <mp-cell :hover="true" value="有 hover 效果，无跳转 URL" footer="说明文字">
              <img slot="title" :src="mpCells.icon" style="margin-right: 16px;vertical-align: middle;width:20px; height: 20px;"/>
            </mp-cell>
          </mp-cells>
        </div>
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
        <div class="comp-cnt">
          <wx-button class="wx-button" type="default" @click="mpDialog.dialogShow = true">确认取消按钮</wx-button>
          <wx-button class="wx-button" type="default" @click="mpDialog.showOneButtonDialog = true">只有确认按钮</wx-button>
          <mp-dialog title="test" :show="mpDialog.dialogShow" @buttontap="mpDialog.dialogShow = false" :buttons="mpDialog.buttons">
            <view>test content</view>
          </mp-dialog>
          <mp-dialog title="test1" :show="mpDialog.showOneButtonDialog" @buttontap="mpDialog.showOneButtonDialog = false" :buttons="mpDialog.oneButton">
            <view>test content1</view>
          </mp-dialog>
        </div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-msg</div>
        <div class="comp-cnt">
          <mp-msg type="success" title="操作成功">
            <div slot="desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现</div>
            <div slot="extend">
              <div>1. 说明1</div>
              <div>2. 说明2</div>
            </div>
            <div slot="handle">
              <wx-button class="wx-button" type="primary">主要操作</wx-button>
              <wx-button class="wx-button" type="default">辅助操作</wx-button>
            </div>
            <div slot="footer">
              <div class="weui-footer__links">
                <a href="" class="weui-footer__link">底部链接文本</a>
              </div>
            </div>
          </mp-msg>
        </div>
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
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      mpLoading: {
        show: true,
        animated: true,
      },
      mpIcon: {
        filled: undefined,
        list: [{"icon":"add-friends","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"add","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"add2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"album","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"arrow","color":"rgba(0, 0, 0, .9)","size":12,"name":""},{"icon":"at","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"back","color":"rgba(0, 0, 0, .9)","size":12,"name":""},{"icon":"back2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"bellring-off","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"bellring-on","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"camera","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"cellphone","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"clip","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"close","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"close2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"comment","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"contacts","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"copy","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"delete-on","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"delete","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"discover","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"display","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"done","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"done2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"download","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"email","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"error","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"eyes-off","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"eyes-on","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"folder","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"group-detail","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"help","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"home","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"imac","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"info","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"keyboard","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"like","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"link","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"location","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"lock","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"max-window","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"me","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"mike","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"mike2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"mobile-contacts","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"more","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"more2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"mosaic","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"music-off","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"music","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"note","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"pad","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"pause","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"pencil","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"photo-wall","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"play","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"play2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"previous","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"previous2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"qr-code","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"refresh","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"report-problem","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"search","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"sending","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"setting","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"share","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"shop","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"star","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"sticker","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"tag","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"text","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"time","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"transfer-text","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"transfer2","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"translate","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"tv","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"video-call","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"voice","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"volume-down","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"volume-off","color":"rgba(0, 0, 0, .9)","size":25,"name":""},{"icon":"volume-up","color":"rgba(0, 0, 0, .9)","size":25,"name":""}],
      },
      mpCells: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=',
      },
      mpDialog: {
        dialogShow: false,
        showOneButtonDialog: false,
        buttons: JSON.stringify([{text: '取消'}, {text: '确定'}]),
        oneButton: JSON.stringify([{text: '确定'}]), // 也支持传 json 串，用于对付某些会将属性值转成字符串的 Web 框架
      },
      mpNavigationBar: {
        loading: false,
        color: '#000',
        background: '#f8f8f8',
        show: true,
        animated: false
      },
    }
  },
  mounted() {
    setInterval(() => this.mpLoading.show = !this.mpLoading.show, 2000)
  },
  methods: {
    onMpIconModeChange(evt) {
      const colorLight = 'rgba(0, 0, 0, .9)'
      const colorDark = 'rgba(255, 255, 255, .8)'
      const color = evt.detail.value ? colorDark : colorLight
      this.mpIcon.list.forEach(item => item.color = color)
    },
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
.mp-icon-cnt {
  text-align: center;
}
.demo0 {
  height: 60px;
  background: white;
}
.demo1 {
  height: 60px;
  background: rgba(0,0,0,.1);
}
</style>
