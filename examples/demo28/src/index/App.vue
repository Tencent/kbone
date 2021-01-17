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
        <div class="comp-cnt">
          <mp-cells title="新消息提示跟摘要信息后，统一在列表右侧">
            <mp-cell title="单行列表" :link="true">
              <div slot="footer">
                <div style="display: inline-block;vertical-align:middle; font-size: 17px;">详细信息</div>
                <mp-badge style="margin-left: 5px;margin-right: 5px;" ext-class="blue"/>
              </div>
            </mp-cell>
          </mp-cells>
          <mp-cells title="未读数红点跟在主题信息后，统一在列表左侧">
            <mp-cell>
              <div slot="title" style="position: relative;margin-right: 10px;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAIAAAAErfB6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUU3QzMwMDU3NEZGMTFFNkIwQzZDNTI2QjgwMzcwMzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUU3QzMwMDY3NEZGMTFFNkIwQzZDNTI2QjgwMzcwMzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRTdDMzAwMzc0RkYxMUU2QjBDNkM1MjZCODAzNzAzNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRTdDMzAwNDc0RkYxMUU2QjBDNkM1MjZCODAzNzAzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjSJHvsAAAU3SURBVHja7J3rThs7FEYphDshEBJAvP+jVREoCrdwv+l8hy19dcczJk2BFLLWr8ngeNJZ3tvbnpH6YzgcLsD3ZZFbgGBAMCAYEAwIBgQDghEMCAYEA4IBwYBgQDCCAcGAYEAwIBgQDAgGBCMYEAwIBgQDggHBgGAEA4IBwYBgQDAgGBCMYEAwIBgQDAgGBAOCAcEIBgQDggHBgGBAMCAYwYBgQDAgGBAMCAYEIxgQDAgGBMMsaH3alV5eXn4Nq8XFWTV+304K33qXX/WVBN/d3Z2ensbxwcHB8vJyU8vHx8eTkxPfmqOjo0K39/f3/j+u+/3+6urqdD9PF3U/5Z+Xon+R/l06WFtb6/V66Z8Gg0EcdDqddrv9/VN0est0N8v3Oo0DKSw0fnh4qL0EzECwM1VqJefm5qZJYW0Ex4FiaIaZEMH/s7Ky4nQ9YVCmCsuNp07OCH43NjY24uDp6SmtQSr5Of6kiPRoeLNx2h5mJjh10BTEPq/R4PZNc7bPKzkzAc9esDS0Wq3yzJrOqc66t7e35dnayT9fxmgQqFka66yDPzaIr66umiJYDuK8xoFGw5tztkeJk78Zj8fX19eaCypX16JlrmL9swXbWUzDlbrXKTeSsyJYDdSsqbGDsrIGG41GFbUeKOJvlsuk6D+YhvOZ1anY46AQxP66wt2CY5PEdiNkRXrd4XBYrsyJ4L+dhkOAEmwlkmzRPpR746Tm0Uoe9gScylPs+mS323XQt9tthbs3nuR48u0qInjKIK6EUaTiypaFG+dFmcPUUS7lcVJjqNfrVVK6PuqkqzzN0KToT93u8Mc0rF14Rz2cjwYPAp05Pz+PM7u7u01X39vbqyQABH/gNJwGcdOaJ93xyEdD1Ns6eH5+jppLHws1lNKyR8w8OG7NYEw1TMORhHM99q3R4Mcyztj5Zoh6KNdQvrrGBII/djVsZ17z5FsW5QheX1+PA9uSPD/4KzMPgmfz+MVWHIjpDmUe8ZW6LJ2AXQlPsfKpXSsv/P6sfroe5j2CbSVKJ31Mdyjz9kraMQIipaerKZfKLo91sLm5OcnPWFpaSofRFJHtoeCrI7g6DUuwbnSEsiumPEtfXFw4pdc+InRuVydTvEGRroknFPzySm1hOO8purLAzR8R5nc/xMejQ0dwelttaOq06SicMNun4yBNBgj+bRqWLUekT5ZXz6GwUm/7FuuvZUPHx8c/X6kskyxYl5jEcSSVPAEguBpw3lQq3Ca7vLy8rM2K8t3pdOL47OysqR9lC4+PSkGXfiz04CivLQUQXFMb5zuUhZTuDJzX26qtoge1UZjmxXD66mT+dZ3Z2tryVdRDUxyPx+N0JdbtdqmiFwq1cV4xNe1ApfNrPmHL7s7OTrycq5aDwSDeGlD21nyZxpy62t7ezq+ik8rbMTJiPa0e1Hjplejk6ZXU7r/8st8sBTdtSb65PVKotxWFMjEajUJSPADOi6n9/f3ar+tkv9/X5OpvFd4PjPGUZwIE1xQmk7xUpRLMggujQSF7eHioqdrlWEVJeS7Qz+j1eopU5eGCXSVzhfu//6Lujwl39b4osZGi1KqwTl/M/tOvB+pEWedrveDXWvjWlJ8sffTX57qKBgQDggHBCAYEA4IBwYBgQDAgGBCMYEAwIBgQDAgGBAOCEQwIBgQDggHBgGBAMCAYwYBgQDAgGBAMCAYEIxgQDAgGBAOCAcGAYAQDggHBgGBAMCAYEAwIRjAgGBAMCAYEA4IBwQgGBAOCAcGAYEAwIBjBgGBAMCAYPp//BBgAStflVPGsRa8AAAAASUVORK5CYII=" style="width: 50px; height: 50px; display: block"/>
                <mp-badge content="99+" style="position: absolute;top: -.4em;right: -.4em;"/>
              </div>
              <div>联系人名称</div>
              <div style="font-size: 13px;color: #888888;">摘要信息</div>
            </mp-cell>
            <mp-cell :link="true">
              <div style="display: inline-block; vertical-align: middle">单行列表</div>
              <mp-badge content="8" style="margin-left: 5px;"/>
            </mp-cell>
            <mp-cell :link="true">
              <div style="display: inline-block; vertical-align: middle">单行列表</div>
              <mp-badge style="margin-left: 5px;" content="New"/>
            </mp-cell>
          </mp-cells>
        </div>
      </wx-view>
      <!-- <wx-view class="item">
        <div class="title">mp-gallery</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
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
      <!-- <wx-view class="item">
        <div class="title">mp-form</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <!-- <wx-view class="item">
        <div class="title">mp-form-page</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
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
      <!-- <wx-view class="item">
        <div class="title">mp-checkbox-group</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <!-- <wx-view class="item">
        <div class="title">mp-checkbox</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <!-- <wx-view class="item">
        <div class="title">mp-slideview</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <!-- <wx-view class="item">
        <div class="title">mp-uploader</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
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
        <div class="comp-cnt">
          <mp-toptips :msg="mpToptips.message" :type="mpToptips.type" :show="mpToptips.showTopTips" delay="3000" @hide="mpToptips.showTopTips = false"></mp-toptips>
          <div class="opr-cnt">
            <input class="weui-input" placeholder="输入文本" v-model="mpToptips.value"/>
          </div>
          <wx-button class="wx-button" type="default" @tap="showMpToptips">确认</wx-button>
        </div>
      </wx-view>
      <!-- <wx-view class="item">
        <div class="title">mp-half-screen-dialog</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <!-- <wx-view class="item">
        <div class="title">mp-actionsheet</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
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
      <!-- <wx-view class="item">
        <div class="title">mp-tabbar</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <wx-view class="item" style="padding-bottom: 150px;">
        <div class="title">mp-searchbar</div>
        <div class="comp-cnt">
          <mp-searchbar @selectresult="log('[mp-searchbar] selectresult', $event.detail)" :search="onSearch"></mp-searchbar>
        </div>
      </wx-view>
      <!-- <wx-view class="item">
        <div class="title">mp-grids</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
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
      mpToptips: {
        value: '',
        showTopTips: false,
        message: '请输入文本',
        type: 'info',
      },
      mpNavigationBar: {
        loading: false,
        color: '#000',
        background: '#f8f8f8',
        show: true,
        animated: false
      },
      mpSearchbar: {
        i: 0,
      },
    }
  },
  mounted() {
    setInterval(() => this.mpLoading.show = !this.mpLoading.show, 2000)
  },
  methods: {
    log(...args) {
      console.log.apply(console, args)
    },

    onMpIconModeChange(evt) {
      const colorLight = 'rgba(0, 0, 0, .9)'
      const colorDark = 'rgba(255, 255, 255, .8)'
      const color = evt.detail.value ? colorDark : colorLight
      this.mpIcon.list.forEach(item => item.color = color)
    },

    showMpToptips() {
      if (this.mpToptips.value) {
        this.mpToptips.showTopTips = true
        this.mpToptips.message = this.mpToptips.value
        this.mpToptips.type = 'success'
      } else {
        this.mpToptips.showTopTips = true
        this.mpToptips.message = '缺少内容'
        this.mpToptips.type = 'error'
      }
    },

    onSearch() {
      return new Promise(resolve => {
        if (this.mpSearchbar.i % 2 === 0) {
          setTimeout(() => resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}]), 200)
        } else {
          setTimeout(() => resolve([]), 200)
        }
        this.mpSearchbar.i = this.mpSearchbar.i + 1
      })
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
.blue {
  background: blue;
}
.searchbar-result{
  margin-top: 0;
  font-size: 14px;
}
.searchbar-result:before{
  display: none;
}
</style>
