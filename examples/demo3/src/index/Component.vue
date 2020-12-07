<template>
  <!-- className 属性用来测试 -->
  <div className="cnt2">
    <div class="group" v-for="item in list" :key="item">
      <div class="label">{{item}}</div>
      <wx-view class="comp">
        <div v-if="item === 'normal'">
          <div>
            <div class="inline">hello </div>
            <div class="inline">world!</div>
          </div>
          <div>
            <a class="margin-left-10 block" href="javascript: void(0)">fake jump</a>
          </div>
        </div>
        <div v-if="item === 'event'">
          <div @click="log('root click')" @longpress="log('root longpress')">
            <div>touchstart -> touchend -> click -> root click</div>
            <button @touchstart="log('touchstart')" @touchmove="log('touchmove')" @touchend="log('touchend')" @touchcancel="log('touchcancel')" @click="log('click')" @longpress="log('longpress')">normal event</button>
            <div>parent touchstart -> parent touchend -> parent click -> click -> root click</div>
            <wx-capture @touchstart="log('parent touchstart')" @touchend="log('parent touchend')" @click="log('parent click')" @longpress="log('parent longpress')">
              <button @click="onClick" @longpress="log('longpress')">capture-inner({{eventCount}})</button>
            </wx-capture>
            <div>parent touchstart -> parent touchend</div>
            <wx-catch @touchstart="log('parent touchstart')" @touchend="log('parent touchend')" @click="log('parent click')" @longpress="log('parent longpress')">
              <button @click="onClick" @longpress="log('longpress')">catch-inner1({{eventCount}})</button>
            </wx-catch>
            <div>click -> parent click</div>
            <wx-catch @click="log('parent click')">
              <button @click="onClick" @longpress="log('longpress')">catch-inner2({{eventCount}})</button>
            </wx-catch>
            <wx-catch>{{eventCountComputed}}</wx-catch>
            <div class="event-cnt">
              <wx-animation :class="['event-t', transition ? 'event-t-s' : 'event-t-e']" @transitionend="log('transition end')"></wx-animation>
              <button @click="startTranstion">transition</button>
            </div>
            <div class="event-cnt">
              <wx-animation class="event-a" @animationstart="log('animation start')" @animationiteration="log('animation iteration')" @animationend="log('animation end')"></wx-animation>
            </div>
          </div>
        </div>
        <!-- 可使用 html 标签替代的内置组件 -->
        <div v-else-if="item === 'img'">
          <img src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" width="50" height="50" @load="log('onImgLoad', $event)" />
          <img src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" mode="top" width="50" height="50" @load="log('onImgLoad', $event)" />
        </div>
        <div v-else-if="item === 'input'">
          <input type="text" placeholder="请输入文本内容" @input="log('onInput', $event.target.value, $event)" v-model="input.inputText" @change="log('onInputChange', $event.target.value, $event)" />
          <input type="number" placeholder="请输入数字内容" :kbone-event-map="{input: evt => log('onInput', evt.target.value, evt)}" v-model="input.inputNumber" data-is-number="yes" />
          <input type="radio" />
          <input type="radio" name="radio" value="radio1" @input="log('onInput', $event.target.value, $event)" v-model="input.inputRadio" />
          <input type="radio" name="radio" value="radio2" @input="log('onInput', $event.target.value, $event)" v-model="input.inputRadio" />
          <input type="checkbox" @input="log('onInput', $event.target.value, $event)" v-model="input.inputCheckbox" />
          <input type="hidden" value="I am Hidden" />
        </div>
        <textarea v-else-if="item === 'textarea'" class="textarea-node" style="height: 30px;" placeholder="请输入内容" maxlength="50" :auto-height="true" adjust-position="" value="我是 textarea" @input="onTextareaInput" />
        <div v-else-if="item === 'label'">
          <!-- input -->
          <label>
            <div>输入框1</div>
            <input placeholder="输入框1" @change="log('onLabelChange', $event.detail)"/>
          </label>
          <label for="input2">
            <div>输入框2</div>
          </label>
          <input id="input2" placeholder="输入框2" @change="log('onLabelChange', $event.detail)"/>
          <!-- radio -->
          <label>
            <div>radio1</div>
            <input name="label-radio" type="radio" checked="checked" @change="log('onLabelChange', $event.detail)"/>
          </label>
          <label for="input3">
            <div>radio2</div>
          </label>
          <input name="label-radio" type="radio" id="input3" @change="log('onLabelChange', $event.detail)"/>
          <!-- checkbox -->
          <label>
            <div>checkbox1</div>
            <input type="checkbox" @change="log('onLabelChange', $event.detail)"/>
          </label>
          <label for="input4">
            <div>checkbox2</div>
          </label>
          <input type="checkbox" id="input4" @change="log('onLabelChange', $event.detail)"/>
          <!-- switch -->
          <label>
            <div>switch1</div>
            <template>
              <wx-component v-if="!wxPrefix" behavior="switch" @change="log('onLabelChange', $event.detail)"></wx-component>
              <wx-switch v-else class="switch-node" @change="log('onLabelChange', $event.detail)"></wx-switch>
            </template>
          </label>
          <label for="switch2">
            <div>switch2</div>
          </label>
          <template>
            <wx-component v-if="!wxPrefix" behavior="switch" id="switch2" @change="log('onLabelChange', $event.detail)"></wx-component>
            <wx-switch v-else id="switch2" @change="log('onLabelChange', $event.detail)"></wx-switch>
          </template>
        </div>
        <video v-else-if="item === 'video'" class="video" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" :muted="true" :show-mute-btn="true" :kbone-attribute-map="{controls: false}">
          <Inner></Inner>
        </video>
        <canvas v-else-if="item === 'canvas'" class="canvas" ref="canvas" type="2d" width="300" height="200" @touchstart="onCanvasTouchStart('normal', $event)" @canvastouchstart="onCanvasTouchStart('canvas', $event)" @longtap="log('onCanvasLongTap', $event)">
          <Inner style="margin-top: 100px;"></Inner>
        </canvas>
        <div v-else-if="item === 'select'">
          <select v-model="select.selected" @change="log('onSelectChange', $event)">
            <option disabled value="">请选择</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: {{select.selected}}</span>
        </div>
        <!-- 使用 wx-component 来创建内置组件 -->
        <template v-else-if="item === 'view'">
          <wx-component v-if="!wxPrefix" :behavior="item">我是视图</wx-component>
          <wx-view v-else-if="wxPrefix === 1">我是视图</wx-view>
          <view v-else-if="wxPrefix === 2">我是视图</view>
          <wx-component v-if="!wxPrefix" :behavior="item" :hidden="true">我是 hidden 视图</wx-component>
          <wx-view v-else-if="wxPrefix === 1" :hidden="true">我是 hidden 视图</wx-view>
          <view v-else-if="wxPrefix === 2" :hidden="true">我是 hidden 视图</view>
        </template>
        <template v-else-if="item === 'text'">
          <wx-component v-if="!wxPrefix" :behavior="item" :selectable="true">{{'this is first line\nthis is second line'}}</wx-component>
          <wx-text v-else-if="wxPrefix === 1" :selectable="true">{{'this is first line\nthis is second line'}}</wx-text>
          <text v-else-if="wxPrefix === 2" :selectable="true">{{'this is first line\nthis is second line'}}</text>
        </template>
        <template v-else-if="item === 'match-media'">
          <wx-component v-if="!wxPrefix" :behavior="item" min-width="300" max-width="600"><view>当页面宽度在 300 ~ 500 px 之间时展示这里</view></wx-component>
          <wx-match-media v-else-if="wxPrefix === 1" min-width="300" max-width="600"><view>当页面宽度在 300 ~ 500 px 之间时展示这里</view></wx-match-media>
          <match-media v-else-if="wxPrefix === 2" min-width="300" max-width="600"><view>当页面宽度在 300 ~ 500 px 之间时展示这里</view></match-media>
        </template>
        <template v-else-if="item === 'rich-text'">
          <wx-component v-if="!wxPrefix" :behavior="item" :nodes="richText.nodes"></wx-component>
          <wx-rich-text v-else-if="wxPrefix === 1" :nodes="richText.nodes"></wx-rich-text>
          <rich-text v-else-if="wxPrefix === 2" :nodes="richText.nodes"></rich-text>
        </template>
        <template v-else-if="item === 'swiper'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="5000" :duration="500" @change="log('onSwiperChange', $event.detail)">
            <wx-component behavior="swiper-item" class="swiper-item-1" item-id="1"><span>A</span></wx-component>
            <wx-component behavior="swiper-item" class="swiper-item-2" item-id="2"><span>B</span></wx-component>
            <wx-component behavior="swiper-item" class="swiper-item-3" item-id="3"><span>C</span></wx-component>
            <div>不会被渲染</div>
          </wx-component>
          <wx-swiper v-else-if="wxPrefix === 1" :class="item" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="5000" :duration="500" @change="log('onSwiperChange', $event.detail)">
            <wx-swiper-item class="swiper-item-1" item-id="1"><span>A</span></wx-swiper-item>
            <wx-swiper-item class="swiper-item-2" item-id="2"><span>B</span></wx-swiper-item>
            <wx-swiper-item class="swiper-item-3" item-id="3"><span>C</span></wx-swiper-item>
            <div>不会被渲染</div>
          </wx-swiper>
          <swiper v-else-if="wxPrefix === 2" :class="item" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="5000" :duration="500" @change="log('onSwiperChange', $event.detail)">
            <swiper-item class="swiper-item-1" item-id="1"><span>A</span></swiper-item>
            <swiper-item class="swiper-item-2" item-id="2"><span>B</span></swiper-item>
            <swiper-item class="swiper-item-3" item-id="3"><span>C</span></swiper-item>
            <div>不会被渲染</div>
          </swiper>
          <div>
            <wx-switch name="switch-a" :checked="swiper.indicatorDots" @change="swiper.indicatorDots = !swiper.indicatorDots" /> 指示点
          </div>
          <div>
            <wx-switch name="switch-a" :checked="swiper.autoplay" @change="swiper.autoplay = !swiper.autoplay" /> 自动播放
          </div>
        </template>
        <template v-else-if="item === 'movable'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" :scale-area="true">
            <wx-component ref="movable-view" class="movable-view" behavior="movable-view" direction="all" :inertia="true" :out-of-bounds="true" :x="movable.x" :y="movable.y" :scale-value="movable.scaleValue" :scale="true" @change="log('onMovableChange', $event.detail)" @scale="log('onMovableScale', $event.detail)"><span>text</span></wx-component>
            <wx-component class="movable-view" behavior="movable-view" direction="all" :x="0" :y="0">plaintext</wx-component>
          </wx-component>
          <wx-movable-area v-else-if="wxPrefix === 1" :class="item" :scale-area="true">
            <wx-movable-view ref="movable-view" class="movable-view" direction="all" :inertia="true" :out-of-bounds="true" :x="movable.x" :y="movable.y" :scale-value="movable.scaleValue" :scale="true" @change="log('onMovableChange', $event.detail)" @scale="log('onMovableScale', $event.detail)"><span>text</span></wx-movable-view>
            <wx-movable-view class="movable-view" direction="all" :x="0" :y="0">plaintext</wx-movable-view>
          </wx-movable-area>
          <movable-area v-else-if="wxPrefix === 2" :class="item" :scale-area="true">
            <movable-view ref="movable-view" class="movable-view" direction="all" :inertia="true" :out-of-bounds="true" :x="movable.x" :y="movable.y" :scale-value="movable.scaleValue" :scale="true" @change="log('onMovableChange', $event.detail)" @scale="log('onMovableScale', $event.detail)"><span>text</span></movable-view>
            <movable-view class="movable-view" direction="all" :x="0" :y="0">plaintext</movable-view>
          </movable-area>
          <wx-button @click="onClickMovableMove">move to (30px, 30px)</wx-button>
          <wx-button @click="onClickMovableScale">scale to 3.0</wx-button>
        </template>
        <template v-else-if="item === 'form'">
          <!-- form 组件 -->
          <wx-form :report-submit="true" @submit="onFormSubmit" @reset="onFormReset">
            <div>
              <div>form 组件</div>
              <input type="text" name="text-a" value="text value" />
              <input type="text" value="text value2" />
              <input type="number" name="number-a" value="123" />
              <textarea name="textare-a" value="textare value" />
              <wx-switch name="switch-a" :checked="true" />
              <wx-slider name="slider-a" min="50" max="200" :show-value="true" />
              <wx-picker name="picker-a" :value="1" :range="pickerRange">点击&nbsp;&nbsp;选择国家</wx-picker>
              <div class="ipt-group"><input type="radio" name="radio-a" value="radio1" :checked="true" />radio1</div>
              <div class="ipt-group"><input type="radio" name="radio-a" value="radio2" />radio2</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-a" value="checkbox1" :checked="true" />checkbox1</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-a" value="checkbox2" :checked="true" />checkbox2</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-a" value="checkbox3" />checkbox3</div>
              <input type="hidden" name="hidden-a" value="hidden value" />
              <button type="submit">submit（普通标签）</button>
              <button type="reset">reset（普通标签）</button>
              <button>什么也不做（普通标签）</button>
              <wx-button form-type="submit">submit（内置组件）</wx-button>
              <wx-button form-type="reset">reset（内置组件）</wx-button>
              <wx-button>什么也不做（内置组件）</wx-button>
            </div>
          </wx-form>
          <!-- form 标签 -->
          <form @submit="onFormSubmit" @reset="onFormReset">
            <div>
              <div>form 标签</div>
              <input type="text" name="text-b" value="text value" />
              <input type="text" value="text value2" />
              <input type="number" name="number-b" value="123" />
              <textarea name="textare-b" value="textare value" />
              <wx-switch name="switch-b" :checked="true" />
              <wx-slider name="slider-b" min="50" max="200" :show-value="true" />
              <wx-picker name="picker-a" :value="1" :range="pickerRange">点击&nbsp;&nbsp;选择国家</wx-picker>
              <div class="ipt-group"><input type="radio" name="radio-b" value="radio1" :checked="true" />radio1</div>
              <div class="ipt-group"><input type="radio" name="radio-b" value="radio2" />radio2</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-b" value="checkbox1" :checked="true" />checkbox1</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-b" value="checkbox2" :checked="true" />checkbox2</div>
              <div class="ipt-group"><input type="checkbox" name="checkbox-b" value="checkbox3" />checkbox3</div>
              <input type="hidden" name="hidden-b" value="hidden value" />
              <button type="submit">submit（普通标签）</button>
              <button type="reset">reset（普通标签）</button>
              <button>什么也不做（普通标签）</button>
              <wx-button form-type="submit">submit（内置组件）</wx-button>
              <wx-button form-type="reset">reset（内置组件）</wx-button>
              <wx-button>什么也不做（内置组件）</wx-button>
            </div>
          </form>
        </template>
        <template v-else-if="item === 'button'">
          <!-- className 属性用来测试 -->
          <wx-component v-if="!wxPrefix" :behavior="item" className="wx-button-custom" open-type="share">分享</wx-component>
          <wx-button v-else-if="wxPrefix === 1" className="wx-button-custom" open-type="share">分享</wx-button>
          <button v-else-if="wxPrefix === 2" className="wx-button-custom" open-type="share">分享</button>
          <wx-component v-if="!wxPrefix" :behavior="item" open-type="getPhoneNumber" @getphonenumber="log('onGetPhoneNumber', $event)">获取手机号</wx-component>
          <wx-button v-else-if="wxPrefix === 1" open-type="getPhoneNumber" @getphonenumber="log('onGetPhoneNumber', $event)">获取手机号</wx-button>
          <button v-else-if="wxPrefix === 2" open-type="getPhoneNumber" @getphonenumber="log('onGetPhoneNumber', $event)">获取手机号</button>
          <wx-component v-if="!wxPrefix" :behavior="item">
            <span>span1</span>
            <input type="checkbox"/>
            <span>span2</span>
          </wx-component>
          <wx-button v-else-if="wxPrefix === 1">
            <span>span1</span>
            <input type="checkbox"/>
            <span>span2</span>
          </wx-button>
          <button v-else-if="wxPrefix === 2">
            <span>span1</span>
            <input type="checkbox"/>
            <span>span2</span>
          </button>
        </template>
        <template v-else-if="item === 'image'">
          <wx-component v-if="!wxPrefix" :behavior="item" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-component>
          <wx-image v-else-if="wxPrefix === 1" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-image>
          <image v-else-if="wxPrefix === 2" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></image>
        </template>
        <template v-else-if="item === 'icon'">
          <div v-if="!wxPrefix">
            <div><wx-component :behavior="item" v-for="subItem in icon.size" :key="subItem" type="success" :size="subItem"></wx-component></div>
            <div><wx-component :behavior="item" v-for="subItem in icon.color" :key="subItem" type="success" size="40" :color="subItem"></wx-component></div>
            <div><wx-component :behavior="item" v-for="subItem in icon.type" :key="subItem" :type="subItem" size="40"></wx-component></div>
          </div>
          <div v-else-if="wxPrefix === 1">
            <div><wx-icon v-for="subItem in icon.size" :key="subItem" type="success" :size="subItem"></wx-icon></div>
            <div><wx-icon v-for="subItem in icon.color" :key="subItem" type="success" size="40" :color="subItem"></wx-icon></div>
            <div><wx-icon v-for="subItem in icon.type" :key="subItem" :type="subItem" size="40"></wx-icon></div>
          </div>
          <div v-else-if="wxPrefix === 2">
            <div><icon v-for="subItem in icon.size" :key="subItem" type="success" :size="subItem"></icon></div>
            <div><icon v-for="subItem in icon.color" :key="subItem" type="success" size="40" :color="subItem"></icon></div>
            <div><icon v-for="subItem in icon.type" :key="subItem" :type="subItem" size="40"></icon></div>
          </div>
        </template>
        <template v-else-if="item === 'progress'">
          <div v-if="!wxPrefix">
            <wx-component :behavior="item" percent="20" :show-info="true"></wx-component>
            <wx-component :behavior="item" percent="40" stroke-width="12"></wx-component>
            <wx-component :behavior="item" percent="60" color="pink"></wx-component>
            <wx-component :behavior="item" percent="80" :active="true"></wx-component>
          </div>
          <div v-else-if="wxPrefix === 1">
            <wx-progress percent="20" :show-info="true"></wx-progress>
            <wx-progress percent="40" stroke-width="12"></wx-progress>
            <wx-progress percent="60" color="pink"></wx-progress>
            <wx-progress percent="80" :active="true"></wx-progress>
          </div>
          <div v-else-if="wxPrefix === 2">
            <progress percent="20" :show-info="true"></progress>
            <progress percent="40" stroke-width="12"></progress>
            <progress percent="60" color="pink"></progress>
            <progress percent="80" :active="true"></progress>
          </div>
        </template>
        <template v-else-if="item === 'navigator'">
          <wx-component v-if="!wxPrefix" :behavior="item" target="miniProgram" open-type="exit">退出小程序</wx-component>
          <wx-navigator v-else-if="wxPrefix === 1" target="miniProgram" open-type="exit">退出小程序</wx-navigator>
          <navigator v-else-if="wxPrefix === 2" target="miniProgram" open-type="exit">退出小程序</navigator>
        </template>
        <template v-else-if="item === 'open-data'">
          <div v-if="!wxPrefix">
            <wx-component :behavior="item" type="userNickName"></wx-component>
            <wx-component :behavior="item" type="userAvatarUrl"></wx-component>
            <wx-component :behavior="item" type="userGender"></wx-component>
            <wx-component :behavior="item" type="userGender" lang="zh_CN"></wx-component>
            <wx-component :behavior="item" type="userCity"></wx-component>
            <wx-component :behavior="item" type="userProvince"></wx-component>
            <wx-component :behavior="item" type="userCountry"></wx-component>
            <wx-component :behavior="item" type="userLanguage"></wx-component>
          </div>
          <div v-else-if="wxPrefix === 1">
            <wx-open-data type="userNickName"></wx-open-data>
            <wx-open-data type="userAvatarUrl"></wx-open-data>
            <wx-open-data type="userGender"></wx-open-data>
            <wx-open-data type="userGender" lang="zh_CN"></wx-open-data>
            <wx-open-data type="userCity"></wx-open-data>
            <wx-open-data type="userProvince"></wx-open-data>
            <wx-open-data type="userCountry"></wx-open-data>
            <wx-open-data type="userLanguage"></wx-open-data>
          </div>
          <div v-else-if="wxPrefix === 2">
            <open-data type="userNickName"></open-data>
            <open-data type="userAvatarUrl"></open-data>
            <open-data type="userGender"></open-data>
            <open-data type="userGender" lang="zh_CN"></open-data>
            <open-data type="userCity"></open-data>
            <open-data type="userProvince"></open-data>
            <open-data type="userCountry"></open-data>
            <open-data type="userLanguage"></open-data>
          </div>
        </template>
        <template v-else-if="item === 'picker'">
          <div v-if="!wxPrefix">
            <wx-component :behavior="item" :value="1" :range="pickerRange">点击&nbsp;&nbsp;选择国家</wx-component>
            <wx-component :behavior="item" mode="region" @change="log('onPickerChange', $event.detail)">
              <span>点击&nbsp;&nbsp;</span>
              <span>选择城市</span>
            </wx-component>
          </div>
          <div v-else-if="wxPrefix === 1">
            <wx-picker :value="1" :range="pickerRange">点击&nbsp;&nbsp;选择国家</wx-picker>
            <wx-picker mode="region" @change="log('onPickerChange', $event.detail)">
              <span>点击&nbsp;&nbsp;</span>
              <span>选择城市</span>
            </wx-picker>
          </div>
          <div v-else-if="wxPrefix === 2">
            <picker :value="1" :range="pickerRange">点击&nbsp;&nbsp;选择国家</picker>
            <picker mode="region" @change="log('onPickerChange', $event.detail)">
              <span>点击&nbsp;&nbsp;</span>
              <span>选择城市</span>
            </picker>
          </div>
        </template>
        <template v-else-if="item === 'picker-view'">
          <div>{{pickerView.year}}年{{pickerView.month}}月{{pickerView.day}}日</div>
          <div v-if="!wxPrefix">
            <wx-component :behavior="item" indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="pickerView.value" @change="onPickerViewChange">
              <wx-component behavior="picker-view-column" style="line-height: 50px">
                <div v-for="item in pickerView.years" :key="item" >{{item}}年</div>
              </wx-component>
              <wx-component behavior="picker-view-column" style="line-height: 50px">
                <div v-for="item in pickerView.months" :key="item">{{item}}月</div>
              </wx-component>
              <wx-component behavior="picker-view-column" style="line-height: 50px">
                <div v-for="item in pickerView.days" :key="item">{{item}}日</div>
              </wx-component>
            </wx-component>
          </div>
          <div v-else-if="wxPrefix === 1">
            <wx-picker-view indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="pickerView.value" @change="onPickerViewChange">
              <wx-picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.years" :key="item">{{item}}年</div>
              </wx-picker-view-column>
              <wx-picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.months" :key="item">{{item}}月</div>
              </wx-picker-view-column>
              <wx-picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.days" :key="item">{{item}}日</div>
              </wx-picker-view-column>
            </wx-picker-view>
          </div>
          <div v-else-if="wxPrefix === 2">
            <picker-view indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="pickerView.value" @change="onPickerViewChange">
              <picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.years" :key="item">{{item}}年</div>
              </picker-view-column>
              <picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.months" :key="item">{{item}}月</div>
              </picker-view-column>
              <picker-view-column style="line-height: 50px">
                <div v-for="item in pickerView.days" :key="item">{{item}}日</div>
              </picker-view-column>
            </picker-view>
          </div>
        </template>
        <template v-else-if="item === 'switch'">
          <div v-if="!wxPrefix">
            <wx-component :behavior="item" type="switch" :checked="true" @change="log('onSwitchChange', $event.detail)"></wx-component>
            <wx-component :behavior="item" type="checkbox" @change="log('onSwitchChange', $event.detail)"></wx-component>
          </div>
          <div v-else-if="wxPrefix === 1">
            <wx-switch type="switch" :checked="true" @change="log('onSwitchChange', $event.detail)"></wx-switch>
            <wx-switch type="checkbox" @change="log('onSwitchChange', $event.detail)"></wx-switch>
          </div>
          <div v-else-if="wxPrefix === 2">
            <switch type="switch" :checked="true" @change="log('onSwitchChange', $event.detail)"></switch>
            <switch type="checkbox" @change="log('onSwitchChange', $event.detail)"></switch>
          </div>
        </template>
        <template v-else-if="item === 'slider'">
          <wx-component v-if="!wxPrefix" :behavior="item" min="50" max="200" :show-value="true" @change="log('onSliderChange', $event.detail)"></wx-component>
          <wx-slider v-else-if="wxPrefix === 1" min="50" max="200" :show-value="true" @change="log('onSliderChange', $event.detail)"></wx-slider>
          <slider v-else-if="wxPrefix === 2" min="50" max="200" :show-value="true" @change="log('onSliderChange', $event.detail)"></slider>
        </template>
        <template v-else-if="item === 'map'">
          <wx-component v-if="!wxPrefix" :behavior="item" ref="map" :class="item" :longitude="map.longitude" :latitude="map.latitude" :scale="map.scale" :controls="map.controls" :markers="map.markers" :polyline="map.polyline" :show-location="true" @markertap="log('onMapMarkerTap', $event.detail)" @regionchange="log('onMapRegionChange', $event.detail)" @controltap="log('onMapControlTap', $event.detail)">
            <Inner></Inner>
            <CustomCallout></CustomCallout>
          </wx-component>
          <wx-map v-else-if="wxPrefix === 1" ref="map" :class="item" :longitude="map.longitude" :latitude="map.latitude" :scale="map.scale" :controls="map.controls" :markers="map.markers" :polyline="map.polyline" :show-location="true" @markertap="log('onMapMarkerTap', $event.detail)" @regionchange="log('onMapRegionChange', $event.detail)" @controltap="log('onMapControlTap', $event.detail)">
            <Inner></Inner>
            <CustomCallout></CustomCallout>
          </wx-map>
          <map v-else-if="wxPrefix === 2" ref="map" :class="item" :longitude="map.longitude" :latitude="map.latitude" :scale="map.scale" :controls="map.controls" :markers="map.markers" :polyline="map.polyline" :show-location="true" @markertap="log('onMapMarkerTap', $event.detail)" @regionchange="log('onMapRegionChange', $event.detail)" @controltap="log('onMapControlTap', $event.detail)">
            <Inner></Inner>
            <CustomCallout></CustomCallout>
          </map>
          <!-- TODO：基础库不支持 -->
          <!-- <button @click="resetMap">reset</button> -->
        </template>
        <template v-else-if="item === 'cover-view'">
          <wx-compoennt v-if="!wxPrefix" :behavior="item">测试 cover-view</wx-compoennt>
          <wx-cover-view v-else-if="wxPrefix === 1">测试 cover-view</wx-cover-view>
          <cover-view v-else-if="wxPrefix === 2">测试 cover-view</cover-view>
        </template>
        <template v-else-if="item === 'cover-image'">
          <wx-component v-if="!wxPrefix" behavior="cover-view">
            <wx-component :behavior="item" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-component>
          </wx-component>
          <wx-cover-view v-else-if="wxPrefix === 1">
            <wx-cover-image src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-cover-image>
          </wx-cover-view>
          <cover-view v-else-if="wxPrefix === 2">
            <wx-cover-image src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-cover-image>
          </cover-view>
        </template>
        <template v-else-if="item === 'live-player'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" mode="live" :autoplay="true" src="rtmp://live.hkstv.hk.lxdns.com/live/hks" @statechange="log('onLivePlayerStateChange', $event.detail)">
            <Inner></Inner>
          </wx-component>
          <wx-live-player v-else-if="wxPrefix === 1" :class="item" mode="live" :autoplay="true" src="rtmp://live.hkstv.hk.lxdns.com/live/hks" @statechange="log('onLivePlayerStateChange', $event.detail)">
            <Inner></Inner>
          </wx-live-player>
          <live-player v-else-if="wxPrefix === 2" :class="item" mode="live" :autoplay="true" src="rtmp://live.hkstv.hk.lxdns.com/live/hks" @statechange="log('onLivePlayerStateChange', $event.detail)">
            <Inner></Inner>
          </live-player>
        </template>
        <template v-else-if="item === 'live-pusher'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" mode="RTC" :autopush="true" url="https://domain/push_stream" @statechange="log('onLivePusherStateChange', $event.detail)">
            <Inner></Inner>
          </wx-component>
          <wx-live-pusher v-else-if="wxPrefix === 1" :class="item" mode="RTC" :autopush="true" url="https://domain/push_stream" @statechange="log('onLivePusherStateChange', $event.detail)">
            <Inner></Inner>
          </wx-live-pusher>
          <live-pusher v-else-if="wxPrefix === 2" :class="item" mode="RTC" :autopush="true" url="https://domain/push_stream" @statechange="log('onLivePusherStateChange', $event.detail)">
            <Inner></Inner>
          </live-pusher>
        </template>
        <template v-else-if="item === 'editor'">
          <wx-component v-if="!wxPrefix" :behavior="item" placeholder="请输入内容" :show-img-size="true" :show-img-toolbar="true" :show-img-resize="true" @statuschange="log('onEditorStatusChange', $event.detail)" @ready="log('onEditorReady', $event.detail)"></wx-component>
          <wx-editor v-else-if="wxPrefix === 1" placeholder="请输入内容" :show-img-size="true" :show-img-toolbar="true" :show-img-resize="true" @statuschange="log('onEditorStatusChange', $event.detail)" @ready="log('onEditorReady', $event.detail)"></wx-editor>
          <editor v-else-if="wxPrefix === 2" placeholder="请输入内容" :show-img-size="true" :show-img-toolbar="true" :show-img-resize="true" @statuschange="log('onEditorStatusChange', $event.detail)" @ready="log('onEditorReady', $event.detail)"></editor>
        </template>
        <template v-else-if="item === 'camera'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item">
            <Inner></Inner>
          </wx-component>
          <wx-camera v-else-if="wxPrefix === 1" :class="item">
            <Inner></Inner>
          </wx-camera>
          <camera v-else-if="wxPrefix === 2" :class="item">
            <Inner></Inner>
          </camera>
        </template>
        <template v-else-if="item === 'ad'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" unit-id="123" @error="log('onAdError', $event.detail)"></wx-component>
          <wx-ad v-else-if="wxPrefix === 1" :class="item" unit-id="123" @error="log('onAdError', $event.detail)"></wx-ad>
          <ad v-else-if="wxPrefix === 2" :class="item" unit-id="123" @error="log('onAdError', $event.detail)"></ad>
        </template>
        <template v-else-if="item === 'ad-custom'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" unit-id="123" @error="log('onAdCustomError', $event.detail)"></wx-component>
          <wx-ad-custom v-else-if="wxPrefix === 1" :class="item" unit-id="123" @error="log('onAdCustomError', $event.detail)"></wx-ad-custom>
          <ad-custom v-else-if="wxPrefix === 2" :class="item" unit-id="123" @error="log('onAdCustomError', $event.detail)"></ad-custom>
        </template>
        <template v-else-if="item === 'official-account'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" @error="log('onOfficialAccountError', $event.detail)"></wx-component>
          <wx-official-account v-else-if="wxPrefix === 1" :class="item" @error="log('onOfficialAccountError', $event.detail)"></wx-official-account>
          <official-account v-else-if="wxPrefix === 2" :class="item" @error="log('onOfficialAccountError', $event.detail)"></official-account>
        </template>
        <template v-else-if="item === 'voip-room'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" @error="log('onVoipRoomError', $event.detail)"><Inner></Inner></wx-component>
          <wx-voip-room v-else-if="wxPrefix === 1" :class="item" @error="log('onVoipRoomError', $event.detail)"><Inner></Inner></wx-voip-room>
          <voip-room v-else-if="wxPrefix === 2" :class="item" @error="log('onVoipRoomError', $event.detail)"><Inner></Inner></voip-room>
        </template>
        <template v-else-if="item === 'web-view'">
          <wx-component v-if="!wxPrefix" :behavior="item" :class="item" src="https://www.qq.com/"></wx-component>
          <wx-web-view v-else-if="wxPrefix === 1" :class="item" src="https://www.qq.com/"></wx-web-view>
          <web-view v-else-if="wxPrefix === 2" :class="item" src="https://www.qq.com/"></web-view>
        </template>
        <template v-else-if="item === 'scroll-view'">
          <div>
            <wx-component ref="scroll-view" v-if="!wxPrefix" :behavior="item" :class="item + '-y'" :scroll-into-view="'y1' + scrollView.yDest" :scroll-top="scrollView.scrollTop" :scroll-y="true" :scroll-with-animation="scrollView.yAnimation" @scroll="onScrollViewScroll"><Inner2 :class="`scroll-num-${scrollView.count}`" type="y1"/></wx-component>
            <wx-scroll-view ref="scroll-view" v-else-if="wxPrefix === 1" :class="item + '-y'" :scroll-into-view="'y2' + scrollView.yDest" :scroll-top="scrollView.scrollTop" :scroll-y="true" :scroll-with-animation="scrollView.yAnimation" @scroll="onScrollViewScroll"><Inner2 :class="`scroll-num-${scrollView.count}`" type="y2"/></wx-scroll-view>
            <scroll-view ref="scroll-view" v-else-if="wxPrefix === 2" :class="item + '-y'" :scroll-into-view="'y3' + scrollView.yDest" :scroll-top="scrollView.scrollTop" :scroll-y="true" :scroll-with-animation="scrollView.yAnimation" @scroll="onScrollViewScroll"><Inner2 :class="`scroll-num-${scrollView.count}`" type="y3"/></scroll-view>
            <div class="scroll-view-btn" @click="onClickScrollViewYBtn">滚动到第三个滑块</div>
            <div class="scroll-view-btn" @click="onClickScrollViewYTopBtn">滚动到 120px 处</div>
            <div class="scroll-view-btn" @click="onClickScrollViewYAnimBtn">{{scrollView.yAnimation ? '关闭' : '打开'}}动画</div>
          </div>
          <div>
            <wx-component ref="scroll-view" v-if="!wxPrefix" :behavior="item" :class="item + '-x'" :scroll-into-view="'x1' + scrollView.xDest" :scroll-x="true" :scroll-with-animation="true" @scroll="log('onScrollViewScroll', $event.detail)"><Inner2 type="x1"/></wx-component>
            <wx-scroll-view ref="scroll-view" v-else-if="wxPrefix === 1" :class="item + '-x'" :scroll-into-view="'x2' + scrollView.xDest" :scroll-x="true" :scroll-with-animation="true" @scroll="log('onScrollViewScroll', $event.detail)"><Inner2 type="x2"/></wx-scroll-view>
            <scroll-view ref="scroll-view" v-else-if="wxPrefix === 2" :class="item + '-x'" :scroll-into-view="'x3' + scrollView.xDest" :scroll-x="true" :scroll-with-animation="true" @scroll="log('onScrollViewScroll', $event.detail)"><Inner2 type="x3"/></scroll-view>
            <div class="scroll-view-btn" @click="onClickScrollViewXBtn">滚动到第二个滑块</div>
          </div>
        </template>
        <!-- 不支持标签 -->
        <template v-else-if="item === 'xxxx'" >
          <wx-component v-if="!wxPrefix" :behavior="item">会作为普通标签渲染</wx-component>
          <wx-xxxx v-else-if="wxPrefix === 1">会作为普通标签渲染</wx-xxxx>
        </template>
        <iframe v-else-if="item === 'iframe'"></iframe>
        <div v-else-if="item === 'intersection'">
          <div>{{intersection.appear ? '小球出现' : '小球消失'}}</div>
          <wx-scroll-view class="intersection-scroll-view" :scroll-y="true">
            <div class="intersection-scroll-area" :style="intersection.appear ? 'background: #ccc' : ''">
              <div class="intersection-ball"></div>
            </div>
          </wx-scroll-view>
        </div>
      </wx-view>
    </div>
  </div>
</template>

<script>
import Inner from './Inner.vue'
import Inner2 from './Inner2.vue'
import CustomCallout from './CustomCallout.vue'

export default {
  name: 'Component',
  components: {
    Inner,
    Inner2,
    CustomCallout,
  },
  props: ['wxPrefix'],
  data() {
    const date = new Date()
    const years = []
    const months = []
    const days = []

    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }

    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }

    return {
      list: [
        'normal',
        'event',
        'img',
        'input',
        'textarea',
        'select',
        'label',
        'video',
        'canvas',
        'view',
        'text',
        'match-media',
        'rich-text',
        'swiper',
        'movable',
        'picker-view',
        'form',
        'button',
        'icon',
        'progress',
        'open-data',
        'navigator',
        'picker',
        'picker-view',
        'switch',
        'slider',
        'image',
        'map',
        'cover-view',
        'cover-image',
        'live-player',
        'live-pusher',
        'camera',
        'editor',
        'ad',
        'ad-custom',
        'official-account',
        'voip-room',
        'scroll-view',
        // 'web-view',
        'xxxx',
        'iframe',
        'intersection',
      ],
      eventCount: 0,
      transition: false,
      icon: {
        size: [20, 30, 40, 50, 60, 70],
        color: ['red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'],
        type: ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear']
      },
      select: {
        selected: 'A',
      },
      input: {
        inputText: '',
        inputNumber: '',
        inputRadio: 'radio2',
        inputCheckbox: true,
      },
      pickerRange: ['美国', '中国', '巴西', '日本'],
      map: {
        markers: [{
          id: 1,
          latitude: 23.098994,
          longitude: 113.322520,
          iconPath: require('./imgs/location.png'),
          callout: {
            content: '文本内容',
            color: '#ff0000',
            fontSize: 14,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: '#000000',
            bgColor: '#fff',
            padding: 5,
            display: 'ALWAYS',
            textAlign: 'center'
          },
        }, {
          id: 2,
          latitude: 23.097994,
          longitude: 113.323520,
          iconPath: require('./imgs/location.png'),
          customCallout: {
            anchorY: 0,
            anchorX: 0,
            display: 'ALWAYS'
          },
        }, {
          id: 3,
          latitude: 23.096994,
          longitude: 113.324520,
          iconPath: require('./imgs/location.png'),
          customCallout: {
            anchorY: 10,
            anchorX: 0,
            display: 'ALWAYS',
          },
        }],
        polyline: [{
          points: [{
            longitude: 113.3245211,
            latitude: 23.10229,
          }, {
            longitude: 113.324520,
            latitude: 23.21229,
          }],
          color: '#FF0000DD',
          width: 2,
          dottedLine: true,
        }],
        controls: [{
          id: 1,
          iconPath: 'https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg',
          position: {
            left: 0,
            top: 300 - 50,
            width: 50,
            height: 50,
          },
          clickable: true,
        }],
        longitude: 113.324520,
        latitude: 23.099994,
        scale: 14,
      
      },
      scrollView: {
        yDest: '',
        xDest: '',
        scrollTop: 0,
        yAnimation: true,
        count: 0,
      },
      pickerView: {
        years: years,
        year: date.getFullYear(),
        months: months,
        month: 2,
        days: days,
        day: 2,
        value: [9999, 1, 1],
      },
      movable: {
        x: 10,
        y: 10,
        scaleValue: 1.2,
      },
      swiper: {
        indicatorDots: true,
        autoplay: false,
      },
      richText: {
        nodes: [{
          name: 'div',
          attrs: {
            class: 'rich-text-div',
            style: 'line-height: 60px; color: red;',
          },
          children: [{
            type: 'text',
            text: 'Hello&nbsp;World!',
          }],
        }],
      },
      intersection: {
        appear: false,
      },
    }
  },
  computed: {
    eventCountComputed() {
      return `catch-inner3(${this.eventCount})`
    },
  },
  watch: {
    'input.inputText'(value) {
      console.log('input.inputText', value)
    },
    'input.inputNumber'(value) {
      console.log('input.inputNumber', value)
    },
    'input.inputRadio'(value) {
      console.log('input.inputRadio', value)
    },
    'input.inputCheckbox'(value) {
      console.log('input.inputCheckbox', value)
    },
  },
  created() {
    window.onDealWithNotSupportDom = dom => {
      dom.textContent = `标签 ${dom.tagName.toLowerCase()} 暂不支持`
    }
  },
  mounted() {
    wx.login({
      success(res) {
        console.log('login success', res)
      }
    })

    const canvas = this.$refs.canvas[0]
    canvas.$$prepare().then(domNode => {
      const context = domNode.getContext('2d')

      context.strokeStyle = '#00ff00'
      context.lineWidth = 5
      context.rect(0, 0, 200, 200)
      context.stroke()
      context.strokeStyle = '#ff0000'
      context.lineWidth = 2
      context.moveTo(160, 100)
      context.arc(100, 100, 60, 0, 2 * Math.PI, true)
      context.moveTo(140, 100)
      context.arc(100, 100, 40, 0, Math.PI, false)
      context.moveTo(85, 80)
      context.arc(80, 80, 5, 0, 2 * Math.PI, true)
      context.moveTo(125, 80)
      context.arc(120, 80, 5, 0, 2 * Math.PI, true)
      context.stroke()
    }).catch(console.error)

    canvas.$$getNodesRef().then(nodesRef => {
      nodesRef.boundingClientRect(res => {
        console.log('test $$getNodesRef', res)
      }).exec()
    })

    this.observer = window.$$createIntersectionObserver()
    this.observer
      .relativeTo('.h5-body >>> .intersection-scroll-view')
      .observe('.h5-body >>> .intersection-ball', res => {
        console.log(res)
        this.intersection.appear = res.intersectionRatio > 0
      })
  },
  methods: {
    log(text, arg) {
      console.log(text, arg)
    },

    onClick() {
      this.eventCount++
      console.log('click')
    },

    startTranstion() {
      this.transition = !this.transition
    },

    onInput(evt) {
      console.log('onInput', evt.target.value, evt)
    },

    onTextareaInput(evt) {
      console.log('onTextareaInput', evt.target.value)
    },

    onClickScrollViewYBtn() {
      const domNodes = this.$refs['scroll-view'] || []
      if (domNodes[0]) {
        const wxPrefix = this.wxPrefix
        const prefix = wxPrefix === 1 ? 'y2' : wxPrefix === 2 ? 'y3' : 'y1'
        // 会被 vue 给 diff 掉，得走 setAttribute
        domNodes[0].setAttribute('scroll-into-view', prefix + 'block3')
      }
      this.scrollView.yDest = 'block3'
    },

    onClickScrollViewYTopBtn() {
      const domNodes = this.$refs['scroll-view'] || []
      if (domNodes[0]) {
        // 会被 vue 给 diff 掉，得走 setAttribute
        domNodes[0].setAttribute('scroll-top', 120)
      }
      this.scrollView.scrollTop = 120
    },

    onClickScrollViewYAnimBtn() {
      this.scrollView.yAnimation = !this.scrollView.yAnimation
    },

    onClickScrollViewXBtn() {
      const domNodes = this.$refs['scroll-view'] || []
      if (domNodes[1]) {
        const wxPrefix = this.wxPrefix
        const prefix = wxPrefix === 1 ? 'x2' : wxPrefix === 2 ? 'x3' : 'x1'
        domNodes[1].setAttribute('scroll-into-view', prefix + 'block2')
      }
      this.scrollView.xDest = 'block2'
    },

    onFormSubmit(evt) {
      console.log('form submit', evt.$$from, evt.detail)
    },

    onFormReset(evt) {
      console.log('form reset', evt.$$from)
    },

    onPickerViewChange(evt) {
      this.pickerView.year = this.pickerView.years[evt.detail.value[0]]
      this.pickerView.month = this.pickerView.months[evt.detail.value[1]]
      this.pickerView.day = this.pickerView.days[evt.detail.value[2]]
      this.pickerView.value = evt.detail.value
      console.log('onPickerViewChange', evt.detail)
    },

    onClickMovableMove() {
      const domNodes = this.$refs['movable-view'] || []
      if (domNodes[0]) {
        domNodes[0].setAttribute('x', 30)
        domNodes[0].setAttribute('y', 30)
      }
      this.movable.x = this.movable.y = 30
    },

    onClickMovableScale() {
      const domNodes = this.$refs['movable-view'] || []
      if (domNodes[0]) {
        domNodes[0].setAttribute('scale-value', 3)
      }
      this.movable.scaleValue = 3
    },

    onCanvasTouchStart(type, evt) {
      console.log(`onCanvasTouchStart[${type}]`, evt)
    },

    resetMap() {
      const domNodes = this.$refs['map'] || []
      if (domNodes[0]) {
        domNodes[0].setAttribute('longitude', 113.324520)
        domNodes[0].setAttribute('latitude', 23.099994)
        domNodes[0].setAttribute('scale', 14)
      }
      this.map.longitude = 113.324520
      this.map.latitude = 23.099994
      this.map.scale = 14
    },

    onScrollViewScroll(evt) {
      this.log('onScrollViewScroll', evt.detail)
      this.scrollView.count++
    },
  }
}
</script>

<style>
.event-cnt {
  position: relative;
  height: 100px;
}

.event-t, .event-a {
  left: 0;
  top: 60px;
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  transition: all 0.5s;
}

.event-t-s {
  left: 50px;
}

.event-t-e {
  left: 0;
}

@keyframes event-aa {
  0% {
    left: 0;
  }
  50% {
    left: 50px
  }
  100% {
    left: 0;
  }
}

.event-a {
  animation: 1s ease 0s 8 event-aa;
}

.label {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background: rgba(7, 193, 96, 0.06);
}

textarea .wx-comp-textarea {
  background-color: #ddd;
}

.inline {
  display: inline;
}

.block {
  display: block;
}

.margin-left-10 {
  margin-left: 10px;
}

.comp {
  padding: 10px 20px;
}

.video {
  position: relative;
  width: 300px;
  height: 225px;
}

.map {
  width: 300px;
  height: 200px;
}

.live-player, .live-pusher, .camera {
  width: 300px;
  height: 225px;
}

.scroll-view-y {
  width: 100%;
  height: 125px;
}

.scroll-view-x {
  width: 300px;
  height: 125px;
}

.scroll-view-btn {
  margin: 10px 20px;
  text-align: center;
  background: #07c160;
  color: #fff;
  line-height: 30px;
  height: 30px;
  font-size: 16px;
  border-radius: 5px;
}

.ipt-group input {
  display: inline-block;
}

.swiper {
  display: block;
  height: 150px;
}

.swiper-item-1, .swiper-item-2, .swiper-item-3 {
  display: flex;
  height: 150px;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}
.swiper-item-1 {
  background-color: #1AAD19;
}
.swiper-item-2 {
  background-color: #2782D7;
}
.swiper-item-3 {
  background-color: #F1F1F1;
  color: #353535;
}

.movable {
  height: 250px;
  width: 250px;
  background: #ccc;
  overflow: hidden;
}
.movable-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  background: #1AAD19;
  color: #fff;
}

.rich-text-div {
  font-size: 30px;
}

.intersection-scroll-view {
  height: 200px;
  background: #fff;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.intersection-scroll-area {
  padding-top: 200px;
  height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: .5s;
}

.intersection-ball {
  width: 100px;
  height: 100px;
  background: #1AAD19;
  border-radius: 50%;
}
</style>
