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
            <mp-slideview show="true" :buttons="mpSlideView.buttons" @buttontap="log('[mp-slideview] buttontap', $event.detail)">
              <mp-cell value="左滑可以删除" footer="说明文字"></mp-cell>
            </mp-slideview>
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
            <mp-cell hover="true" value="有 hover 效果，无跳转 URL" footer="说明文字">
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
      <wx-view class="item">
        <div class="title">mp-slideview</div>
        <div class="comp-cnt mp-sliderview-cnt">
          <div class="mp-slideview-1">
            <mp-slideview show="true" :buttons="mpSlideView.buttons" @buttontap="log('[mp-slideview] buttontap', $event.detail)">
              <mp-cell value="左滑可以删除" footer="说明文字"></mp-cell>
            </mp-slideview>
          </div>
          <div class="mp-slideview-2">
            <mp-slideview :buttons="mpSlideView.buttons" icon="true" @buttontap="log('[mp-slideview] buttontap', $event.detail)">
              <div class="weui-slidecell">
                左滑可以删除（图标Button） 
              </div>
            </mp-slideview>
          </div>
        </div>
      </wx-view>
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
      <wx-view class="item">
        <div class="title">mp-half-screen-dialog</div>
        <div class="comp-cnt">
          <div class="opr-cnt">
            <wx-button class="wx-button opr-button" type="primary" @tap="mpHalfScreenDialog.typeF = true">样式一</wx-button>
            <wx-button class="wx-button opr-button" type="primary" @tap="mpHalfScreenDialog.typeS = true">样式二</wx-button>
            <wx-button class="wx-button opr-button" type="primary" @tap="mpHalfScreenDialog.typeT = true">样式三</wx-button>
          </div>
          <mp-half-screen-dialog :show="mpHalfScreenDialog.typeF" @close="mpHalfScreenDialog.typeF = false">
            <div slot="title">测试标题A</div>
            <div slot="desc">这是自定义描述区</div>
            <div slot="footer">
              <wx-button type="default" class="weui-btn weui-btn_default">按钮A</wx-button>
              <wx-button type="primary" class="weui-btn weui-btn_primary">按钮B</wx-button>
            </div>
          </mp-half-screen-dialog>
          <mp-half-screen-dialog 
            :show="mpHalfScreenDialog.typeS"
            :maskClosable="false" 
            title="测试标题B" 
            sub-title="测试标题B的副标题"
            desc="辅助描述内容，可根据实际需要安排"
            tips="辅助提示内容，可根据实际需要安排"
            :buttons="mpHalfScreenDialog.buttons"
            @buttontap="log('[mp-half-screen-dialog] buttontap', $event.detail)"
            @close="mpHalfScreenDialog.typeS = false"
          ></mp-half-screen-dialog>
          <mp-half-screen-dialog :show="mpHalfScreenDialog.typeT" closabled="false" @close="mpHalfScreenDialog.typeT = false">
            <div slot="title">测试标题A</div>
            <div slot="desc">这是自定义描述区</div>
            <div slot="footer">
              <wx-button type="default" class="weui-btn weui-btn_default">按钮A</wx-button>
              <wx-button type="primary" class="weui-btn weui-btn_primary">按钮B</wx-button>
            </div>
          </mp-half-screen-dialog>
        </div>
      </wx-view>
      <!-- <wx-view class="item">
        <div class="title">mp-actionsheet</div>
        <div class="comp-cnt"></div>
      </wx-view> -->
      <wx-view class="item">
        <div class="title">mp-navigation-bar</div>
        <div class="comp-cnt">
          <!-- 放到最顶端 -->
          <div class="opr-cnt">
            <div class="opr-label">
              <div class="opr-label">触发 loading</div>
              <wx-switch @change="mpNavigationBar.loading = $event.detail.value"></wx-switch>
            </div>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.color = '#07C160'">修改文字颜色</wx-button>
            <wx-button class="wx-button opr-button" @tap="mpNavigationBar.background = '#ededed'">修改背景颜色</wx-button>
            <div class="opr-cnt">
              <div class="opr-label">显示/隐藏</div>
              <wx-switch :checked="true" @change="mpNavigationBar.show = $event.detail.value"></wx-switch>
            </div>
            <div class="opr-cnt">
              <div class="opr-label">动画</div>
              <wx-switch @change="mpNavigationBar.animated = $event.detail.value"></wx-switch>
            </div>
          </div>
        </div>
      </wx-view>
      <wx-view class="item">
        <div class="title">mp-tabbar</div>
        <div class="comp-cnt">
          <mp-tabbar v-if="mpTabbar.show" style="position:fixed;bottom:0;width:100%;left:0;right:0;z-index:100;" :list="mpTabbar.list" @change="log('[mp-tabbar] change', $event.detail)"></mp-tabbar>
          <div class="opr-cnt">
            <div class="opr-label">显示/隐藏</div>
            <wx-switch :checked="true" @change="mpTabbar.show = $event.detail.value"></wx-switch>
          </div>
        </div>
      </wx-view>
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
    const tabbarIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAAllBMVEUAAAC/v7+qqqrHx8evr6/ExMS5ubmxsbGsrKysrKytra2pqam8vLy9vb2lpaXExMT////s7Oz8/Pz09PTu7u729vb5+fnp6enMzMzLy8vm5ub4+Pjj4+O3t7fx8fHb29vAwMDHx8ePj4/S0tLf39+rq6ulpaWSkpK7u7vY2NjR0dGnp6eenp6ampqysrLPz8+fn5+ioqKXtObzAAAAEHRSTlMA6wT4/e/f0KyZSy/z8mz4uKbH2gAAA6FJREFUSMellody2zAMhuXEGU6TVBgkbGp529np+79cKREUpbrxdfxnn7g+cYACkKku7m5vricPl4v5Yq5arWLJN14+TK5vbu8udLhCsyuHeY6QD0Q0rEHb765mA/DbJIw4j4XGybdIPV5q13lMC9NHnWvKpxhiAVBYPMX4ezffxSQnHmFoahFgkRpEmHCEMeWTdn8zygOnmAVhkxZZ1AImYdyOnvnJrrohrBiymF/3ZgGsYty1XV1kdy6MATKGnJRgoiAVuRRH/inhTe4uu9U1Q8MMmy0nOcdJ5bMwbEs9g9vsJg8yjq2UXxugdJYBtHKTXUeM64bO2c00bGP/dTbBIAIBERyIaFgTASHQyiS7hyC3KaHcQNSm2r2+vbwvBFRt91OjlfssXizZ+q2WjN3yqvXrcfWxmS/362lYGJfYjQm6zBah4InWbtRyy3UlGPaGvDxU6B8EvqVo9NgX2TwUGDosJzb7vQyPBHafxNSZ2zq9hXOdzYoJWM6Hyo5P0h4PkAcMwI5mAxOx/bvgGEOpfqBihoezoeSKLffWAA4xBLIvS8VywYR5RjFaix8PmDBs77+sa8XYDDA2ilVV9xbAiCF0cFUpZniASa6Yn0y5aICO8tMplkvCMGKbV8x7jqhbYSf8fI4YJgwUq46+FjmillIdK8UgYQUrtlvliaspUflqpxgXHbYiIhD/d77w+kG9oGkg1T5eiYhLImkbV2PsbUO96qcnStq8jbCwyFoX+TJPjhK8kpucv+gi66LfmwXF3peJMkQmcct3xcCeGmCxx55qDdBzuF8kA5yYW9bcUy3Wc7x2p+bOuQgYTJdKxctVBG65g4AVMMCoVgwOECjFlOMDKFbTbz+camcRilwxvS84rX79cPQztYrh51HM+DMtZPmGilkYOQUDiuX1iVPA44F7p2DGLghYZwP+8SJDjKdvADqbg+SCOtmyw9p94anDKwCDw7Pq8JJ7LduTga69rtaf0b3uIJyneAySe32AIPdc+r8D1bM6c23oulzvzB9S6BDnf1+HDifkUugYBCrT1OcCVd1QClQpLALQubDoHAGlsBiDMG3J0pMUthdzKhfw5LtLiUE4hnx0AgDNtnEQVZYQ5XyHf8jWasjXBAPBxgQDziQYFqwmGNmMlIrpDH+ZzihHs5A8+co4eeKUPEFKngKHIXnKvn0H++epmoWppoaP079JDL8//lsa+p9Jb0qx77sUexG0WmmhS7HvRyn2TxZ1zUyK+LY0AAAAAElFTkSuQmCC'

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
      mpSlideView: {
        buttons: JSON.stringify([{
          text: '普通',
          src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMicgaGVpZ2h0PScyMicgdmlld0JveD0nMCAwIDIyIDIyJz4gPHBhdGggZmlsbC1vcGFjaXR5PScuOScgZmlsbC1ydWxlPSdldmVub2RkJyBkPSdNMTcuNjc4IDExLjU5MWEzLjQ4MyAzLjQ4MyAwIDAgMC00Ljk2NC00Ljg4N2MtLjE3Ny4xNzYtLjQuMzkxLS42NzIuNjQ4bC0uNzU0LjcxLS43NTUtLjcxYTMyLjMzNyAzMi4zMzcgMCAwIDEtLjY3MS0uNjQ4IDMuNDgzIDMuNDgzIDAgMCAwLTQuOTI3IDAgMy40ODEgMy40ODEgMCAwIDAtLjA1IDQuODc2bDYuNDAzIDYuNDAyIDYuMzktNi4zOXpNNC4xNTggNS45MjZhNC41ODMgNC41ODMgMCAwIDEgNi40ODEgMGMuMTY4LjE2Ny4zODQuMzc2LjY0OS42MjUuMjY0LS4yNS40OC0uNDU4LjY0OC0uNjI1YTQuNTgzIDQuNTgzIDAgMCAxIDYuNTMxIDYuNDMxbC02LjUzMSA2LjUzMmEuOTE3LjkxNyAwIDAgMS0xLjI5NyAwbC02LjUzMS02LjUzMWE0LjU4NCA0LjU4NCAwIDAgMSAuMDUtNi40MzJ6Jy8+PC9zdmc+',
          data: {test: 'a'},
        }, {
          text: '普通',
          extClass: 'test',
          src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMicgaGVpZ2h0PScyMicgdmlld0JveD0nMCAwIDIyIDIyJz4gPHBhdGggZmlsbC1vcGFjaXR5PScuOScgZmlsbC1ydWxlPSdldmVub2RkJyBkPSdNMTQuNjEzIDEzLjA5bDMuNjEzLTMuNTIxLTQuOTkzLS43MjZMMTEgNC4zMiA4Ljc2NyA4Ljg0M2wtNC45OTMuNzI2IDMuNjEzIDMuNTIyLS44NTMgNC45NzJMMTEgMTUuNzE2bDQuNDY2IDIuMzQ3LS44NTMtNC45NzJ6TTExIDE2Ljk1OUw2LjcxNyAxOS4yMWEuOTE3LjkxNyAwIDAgMS0xLjMzLS45NjZsLjgxOC00Ljc3LTMuNDY1LTMuMzc3YS45MTcuOTE3IDAgMCAxIC41MDgtMS41NjNsNC43ODktLjY5NiAyLjE0MS00LjM0YS45MTcuOTE3IDAgMCAxIDEuNjQ0IDBsMi4xNDEgNC4zNCA0Ljc4OS42OTZhLjkxNy45MTcgMCAwIDEgLjUwOCAxLjU2M2wtMy40NjUgMy4zNzguODE4IDQuNzY5YS45MTcuOTE3IDAgMCAxLTEuMzMuOTY2TDExIDE2Ljk1OHonLz48L3N2Zz4=',
          data: {test: 'b'},
        }, {
          type: 'warn',
          text: '警示',
          extClass: 'test',
          src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMicgaGVpZ2h0PScyMicgdmlld0JveD0nMCAwIDIyIDIyJz4gPHBhdGggZmlsbC1vcGFjaXR5PScuOScgZmlsbC1ydWxlPSdldmVub2RkJyBkPSdNNi4yMSA1Ljg2N2wuNzQ0IDEyLjUxYy4wMjMuMzg3LjM0NC42OS43MzIuNjloNi42MjhhLjczMy43MzMgMCAwIDAgLjczMi0uNjlsLjc0NS0xMi41MUg2LjIwOXptMTAuNjgzIDBsLS43NDkgMTIuNTc1YTEuODMzIDEuODMzIDAgMCAxLTEuODMgMS43MjVINy42ODZjLS45NyAwLTEuNzczLS43NTYtMS44My0xLjcyNUw1LjEwNyA1Ljg2N0gzLjIwOHYtLjY0MmMwLS4yNTMuMjA2LS40NTguNDU5LS40NThoMTQuNjY2Yy4yNTMgMCAuNDU5LjIwNS40NTkuNDU4di42NDJoLTEuOXptLTQuMDYtMy4xMTdjLjI1MyAwIC40NTkuMjA1LjQ1OS40NTh2LjY0Mkg4LjcwOHYtLjY0MmMwLS4yNTMuMjA2LS40NTguNDU5LS40NThoMy42NjZ6bS00LjEyNSA1LjVoMS4xbC40NTkgOC4yNWgtMS4xbC0uNDU5LTguMjV6bTMuNDg0IDBoMS4xbC0uNDU5IDguMjVoLTEuMWwuNDU5LTguMjV6Jy8+PC9zdmc+',
          data: {test: 'c'},
        }]),
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
      mpHalfScreenDialog: {
        typeF: false,
        typeS: false,
        typeT: false,
        buttons: JSON.stringify([{
          type: 'default',
          className: '',
          text: '辅助操作',
          value: 0
        }, {
          type: 'primary',
          className: '',
          text: '主操作',
          value: 1
        }])
      },
      mpNavigationBar: {
        loading: false,
        color: '#000',
        background: '#f8f8f8',
        show: true,
        animated: false
      },
      mpTabbar: {
        show: true,
        list: JSON.stringify([{
          text: '微信',
          iconPath: tabbarIcon,
          selectedIconPath: tabbarIcon,
          badge: '8'
        }, {
          text: '通讯录',
          iconPath: tabbarIcon,
          selectedIconPath: tabbarIcon,
        }, {
          text: '发现',
          iconPath: tabbarIcon,
          selectedIconPath: tabbarIcon,
          dot: true
        }, {
          text: '我',
          iconPath: tabbarIcon,
          selectedIconPath: tabbarIcon,
        }])
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
.weui-slidecell {
  background-color: #fff;
  border-radius: 8px;
  padding: 26px;
  line-height: 1.4;
  font-size: 17px;
}
.mp-sliderview-cnt {
  background-color: #f7f7f7;
}
.mp-slideview-1 {
  background-color: #fff;
}
.mp-slideview-2 {
  margin-top: 10px;
}
@media (prefers-color-scheme: dark) {
  .weui-slidecell {
    background-color: #191919;
  }
  .mp-sliderview-cnt {
    background-color: #1e1e1e;
  }
  .mp-slideview-1 {
    background-color: #191919;
  }
}
</style>
