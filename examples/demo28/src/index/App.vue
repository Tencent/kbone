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
      <wx-view class="item">
        <div class="title">mp-gallery</div>
        <div class="comp-cnt">
          <wx-button class="wx-button" type="default" @click="mpGallery.show = true">显示 mp-gallery</wx-button>
          <mp-gallery :show="mpGallery.show.toString()" @change="log('[mp-gallery] change', $event.detail)" @delete="log('[mp-gallery] delete', $event.detail)" @hide="mpGallery.show = false" :img-urls="mpGallery.imgUrls" delete="true" hide-on-click="true" current="1"></mp-gallery>
        </div>
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
      <wx-view class="item">
        <div class="title">mp-form/mp-form-page/mp-checkbox-group/mp-checkbox</div>
        <div class="comp-cnt form-cnt">
          <mp-toptips :msg="mpForm.error" type="error" :show="!!mpForm.error" @hide="mpForm.error = ''"></mp-toptips>
          <mp-form-page title="表单结构" subtitle="展示表单页面的信息结构样式, 分别由头部区域/控件区域/提示区域/操作区域和底部信息区域组成。">
            <mp-form id="form" :rules="mpForm.rules" :models="mpForm.formData">
              <mp-cells title="单选列表项">
                <mp-checkbox-group prop="radio" multi="false" @change="onFomrRadioChange">
                  <mp-checkbox v-for="(item, index) in mpForm.radioItems" :key="index" :label="item.name" :value="item.value" :checked="item.checked.toString()"></mp-checkbox>
                </mp-checkbox-group>
              </mp-cells>
              <mp-cells title="复选列表项">
                <mp-checkbox-group prop="checkbox" multi="true" @change="onFormCheckBoxChange">
                  <mp-checkbox v-for="(item, index) in mpForm.checkboxItems" :key="index" :label="item.name" :value="item.value" :checked="item.checked.toString()"></mp-checkbox>
                </mp-checkbox-group>
              </mp-cells>
              <mp-cells title="表单" footer="底部说明文字底部说明文字">
                <mp-cell prop="name" title="姓名">
                  <wx-input @input="onFormInputChange" data-field="name" class="weui-input" placeholder="请输入姓名"></wx-input>
                </mp-cell>
                <mp-cell prop="qq" title="qq">
                  <wx-input @input="onFormInputChange" data-field="qq" class="weui-input" placeholder="请输入qq"></wx-input>
                </mp-cell>
                <mp-cell prop="mobile" title="手机号" ext-class="weui-cell_vcode">
                  <wx-input @input="onFormInputChange" data-field="mobile" class="weui-input" placeholder="请输入手机号"></wx-input>
                  <wx-button slot="footer" type="default" class="weui-vcode-btn">获取验证码</wx-button>
                </mp-cell>
                <mp-cell prop="date" title="日期">
                  <wx-picker data-field="date" mode="date" :value="mpForm.date" start="2015-09-01" end="2017-09-01" @change="onFormDateChange">
                    <div class="weui-input">{{mpForm.date}}</div>
                  </wx-picker>
                </mp-cell>
                <mp-cell prop="vcode" title="验证码" ext-class="weui-cell_vcode">
                  <wx-input @input="onFormInputChange" data-field="vcode" class="weui-input" placeholder="请输入验证码"></wx-input>
                  <div slot="footer"><wx-image class="weui-vcode-img" src="data:image/jpeg;base64,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" style="width: 108px"></wx-image></div>
                </mp-cell>
              </mp-cells>
              <mp-cells title="提交后表单项报错">
                <mp-cell show-error="true" prop="idcard" title="卡号">
                  <wx-input @input="onFormInputChange" data-field="idcard" class="weui-input" placeholder="请输入卡号"></wx-input>
                </mp-cell>
              </mp-cells>
              <mp-cells title="开关">
                <mp-cell title="标题文字">
                  <div slot="footer">
                    <wx-switch  checked="true"></wx-switch>
                  </div>
                </mp-cell>
              </mp-cells>
              <mp-cells title="文本框">
                <mp-cell title="标题文字">
                  <wx-input class="weui-input" placeholder="请输入文本"></wx-input>
                </mp-cell>
              </mp-cells>
              <mp-cells title="文本域">
                <mp-cell has-header="false" has-footer="false">
                  <wx-textarea class="weui-textarea" placeholder="请输入文本" style="height: 3.3em"></wx-textarea>
                  <div class="weui-textarea-counter">0/200</div>
                </mp-cell>
              </mp-cells>
              <mp-cells title="选择">
                <mp-cell ext-class="weui-cell_select weui-cell_select-before">
                  <div slot="title" style="width: 105px">
                    <wx-picker @change="mpForm.countryCodeIndex = $event.detail.value" :value="mpForm.countryCodeIndex" :range="mpForm.countryCodes">
                      <div class="weui-select">{{mpForm.countryCodes[mpForm.countryCodeIndex]}}</div>
                    </wx-picker>
                  </div>
                  <wx-input class="weui-input" placeholder="请输入号码"></wx-input>
                </mp-cell>
              </mp-cells>
              <mp-cells title="选择">
                <mp-cell has-header="false" ext-class="weui-cell_select">
                  <wx-picker @change="mpForm.accountIndex = $event.detail.value" :value="mpForm.accountIndex" :range="mpForm.accounts">
                    <div class="weui-select">{{mpForm.accounts[mpForm.accountIndex]}}</div>
                  </wx-picker>
                </mp-cell>
                <mp-cell ext-class="weui-cell_select weui-cell_select-after">
                  <div slot="title" class="weui-label">国家/地区</div>
                  <wx-picker @change="mpForm.countryIndex = $event.detail.value" :value="mpForm.countryIndex" :range="mpForm.countries">
                    <div class="weui-select">{{mpForm.countries[mpForm.countryIndex]}}</div>
                  </wx-picker>
                </mp-cell>
              </mp-cells>
            </mp-form>
            <div slot="tips">
              <label class="weui-agree">
                <input type='checkbox' name="agree" class="weui-agree__checkbox-check" @change="mpForm.isAgree = !!$event.currentTarget.checked"/>
                <wx-text class="weui-agree__checkbox" :class="mpForm.isAgree ? 'checked' : ''"></wx-text>
                <div class="weui-agree__text">阅读并同意<a href="">《相关条款》</a></div>
              </label>
            </div>
            <div slot="button">
              <wx-button class="weui-btn" type="primary" @tap="doSubmitForm">确定</wx-button>
            </div>
          </mp-form-page>
        </div>
      </wx-view>
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
      <wx-view class="item">
        <div class="title">mp-uploader</div>
        <div class="comp-cnt">
          <mp-uploader
            :select="onSelectFile"
            :upload="onUplaodFile"
            :files="mpUploader.files"
            max-count="6"
            title="图片上传"
            tips="图片上传提示"
            @select="log('[mp-uploader] select', $event.detail)"
            @delete="log('[mp-uploader] delete', $event.detail)"
            @success="log('[mp-uploader] success', $event.detail)"
            @fail="log('[mp-uploader] fail', $event.detail)"
          ></mp-uploader> 
        </div>
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
      <wx-view class="item">
        <div class="title">mp-actionsheet</div>
        <div class="comp-cnt">
          <wx-button class="wx-button opr-button" @tap="mpActionSheet.show = true">模拟 ActionSheet</wx-button>
          <mp-actionsheet :show="mpActionSheet.show" :actions="mpActionSheet.groups" title="这是一个标题，可以为一行或者两行。" @close="mpActionSheet.show = false" @actiontap="log('[mp-actionsheet] action tap', $event.detail)"></mp-actionsheet>
        </div>
      </wx-view>
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
              <wx-switch @change="mpNavigationBar.show = $event.detail.value"></wx-switch>
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
            <wx-switch @change="mpTabbar.show = $event.detail.value"></wx-switch>
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
      mpGallery: {
        show: false,
        imgUrls: [
          'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3',
          'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3',
          'https://res.wx.qq.com/op_res/0TZreUFL8sWsS1cFx5_f7MF5aY767_cWsd9JiKdHxL9Ktu6O6JLAJwvF-jLVxpB3'
        ],
      },
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
      mpForm: {
        error: '',
        radioItems: [
          {name: 'cell standard', value: '0', checked: true},
          {name: 'cell standard', value: '1', checked: false},
        ],
        checkboxItems: [
          {name: 'standard is dealt for u.', value: '0', checked: true},
          {name: 'standard is dealicient for u.', value: '1', checked: false},
        ],
        items: [
          {name: 'USA', value: '美国'},
          {name: 'CHN', value: '中国', checked: 'true'},
          {name: 'BRA', value: '巴西'},
          {name: 'JPN', value: '日本'},
          {name: 'ENG', value: '英国'},
          {name: 'TUR', value: '法国'},
        ],
        date: '2016-09-01',
        time: '12:01',
        countryCodes: ['+86', '+80', '+84', '+87'],
        countryCodeIndex: 0,
        countries: ['中国', '美国', '英国'],
        countryIndex: 0,
        accounts: ['微信号', 'QQ', 'Email'],
        accountIndex: 0,
        isAgree: false,
        formData: {},
        rules: [{
          name: 'radio',
          rules: {required: false, message: '单选列表是必选项'},
        }, {
          name: 'checkbox',
          rules: {required: true, message: '多选列表是必选项'},
        }, {
          name: 'name',
          rules: {required: true, message: '请输入姓名'},
        }, {
          name: 'qq',
          rules: {required: true, message: 'qq必填'},
        }, {
          name: 'mobile',
          rules: [{required: true, message: 'mobile必填'}, {mobile: true, message: 'mobile 格式不对'}],
        }, {
          name: 'vcode',
          rules: {required: true, message: '验证码必填'},
        }, {
          name: 'idcard',
          rules: {
            validator(rule, value) {
              if (!value || value.length !== 18) return 'idcard 格式不正确'
              return ''
            }
          },
        }]
      },
      mpSlideView: {
        buttons: [{
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
        }],
      },
      mpUploader: {
        files: [{
          url: 'https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg',
        }, {
          url: 'https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg',
          loading: true,
        }, {
          url: 'https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg',
          error: true,
        }]
      },
      mpDialog: {
        dialogShow: false,
        showOneButtonDialog: false,
        buttons: [{text: '取消'}, {text: '确定'}],
        oneButton: [{text: '确定'}], // 也支持传 json 串，用于对付某些会将属性值转成字符串的 Web 框架
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
        buttons: [{
          type: 'default',
          className: '',
          text: '辅助操作',
          value: 0
        }, {
          type: 'primary',
          className: '',
          text: '主操作',
          value: 1
        }],
      },
      mpActionSheet: {
        show: false,
        groups: [
          {text: '示例菜单', value: 1},
          {text: '示例菜单', value: 2},
          {text: '负向菜单', type: 'warn', value: 3},
        ],
      },
      mpNavigationBar: {
        loading: false,
        color: '#000',
        background: '#f8f8f8',
        show: false,
        animated: false
      },
      mpTabbar: {
        show: false,
        list: [{
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
        }],
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

    onFomrRadioChange(evt) {
      console.log('[mp-checkbox] change', evt.detail)

      const radioItems = this.mpForm.radioItems
      for (let i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = (radioItems[i].value === evt.detail.value)
      }

      this.mpForm.formData = {...this.mpForm.formData} // 拷贝
      this.mpForm.formData.radio = evt.detail.value
    },

    onFormCheckBoxChange(evt) {
      console.log('[mp-checkbox] change', evt.detail)

      const checkboxItems = this.mpForm.checkboxItems
      const values = evt.detail.value
      for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false

        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxItems[i].value === values[j]) {
            checkboxItems[i].checked = true
            break
          }
        }
      }

      this.mpForm.formData = {...this.mpForm.formData} // 拷贝
      this.mpForm.formData.checkbox = evt.detail.value
    },

    onFormInputChange(evt) {
      const {field} = evt.currentTarget.dataset
      this.mpForm.formData = {...this.mpForm.formData} // 拷贝
      this.mpForm.formData[field] = evt.detail.value
    },

    onFormDateChange(evt) {
      const date = evt.detail.value
      this.mpForm.date = date
      this.mpForm.formData = {...this.mpForm.formData} // 拷贝
      this.mpForm.formData.date = evt.detail.value
    },

    doSubmitForm() {
      document.querySelector('#form').$$wxCustomComponent.validate((valid, errors) => {
        if (!valid) {
          console.log('[mp-form] invalid', valid, errors)
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.mpForm.error = errors[firstError[0]].message
          }
        } else {
          console.log('[mp-form] valid success', this.mpForm.formData)
        }
      })
    },

    onSelectFile(files) {
      console.log('select files', files)
      // 返回false可以阻止某次文件上传
    },

    onUplaodFile(files) {
      console.log('upload files', files)
      // 文件上传的函数，返回一个promise
      if (!this._uploadError) {
        this._uploadError = true
        return new Promise(resolve => setTimeout(() => resolve({urls: files.tempFilePaths}), 1000))
      } else {
        this._uploadError = false
        return new Promise((resolve, reject) => setTimeout(() => reject(new Error('some error')), 1000))
      }
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
/* weui 补充样式 */
.weui-input {
  display: block;
}
.weui-agree__checkbox.checked {
  -webkit-mask-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2022C6.477%2022%202%2017.523%202%2012S6.477%202%2012%202s10%204.477%2010%2010-4.477%2010-10%2010zm-1.177-7.86l-2.765-2.767L7%2012.431l3.119%203.121a1%201%200%20001.414%200l5.952-5.95-1.062-1.062-5.6%205.6z%22%2F%3E%3C%2Fsvg%3E); mask-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2022C6.477%2022%202%2017.523%202%2012S6.477%202%2012%202s10%204.477%2010%2010-4.477%2010-10%2010zm-1.177-7.86l-2.765-2.767L7%2012.431l3.119%203.121a1%201%200%20001.414%200l5.952-5.95-1.062-1.062-5.6%205.6z%22%2F%3E%3C%2Fsvg%3E);
  color: var(--weui-BRAND);
}

/* 其他样式 */
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
.comp-cnt.form-cnt {
  padding: 0;
  margin: 10px -30px;
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
.weui-agree .weui-agree__text {
  display: inline;
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
.searchbar-result{
  margin-top: 0;
  font-size: 14px;
}
.searchbar-result:before{
  display: none;
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
