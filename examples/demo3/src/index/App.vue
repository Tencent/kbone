<template>
  <div>
    <div class="group" v-for="item in list" :key="item">
      <div class="label">{{item}}</div>
      <div class="comp">
        <div v-if="item === 'normal'">
          <div>
            <div class="inline">hello </div>
            <div class="inline">world!</div>
          </div>
          <div>
            <a class="margin-left-10 block" href="javascript: void(0)">fake jump</a>
          </div>
        </div>
        <!-- 可使用 html 标签替代的内置组件 -->
        <div v-else-if="item === 'img'">
          <img src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" width="50" height="50" @load="onImgLoad" />
          <img src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" mode="top" width="50" height="50" @load="onImgLoad" />
        </div>
        <div v-else-if="item === 'input'">
          <input type="text" placeholder="请输入文本内容" @input="onInput" v-model="input.inputText" />
          <input type="number" placeholder="请输入数字内容" @input="onInput" v-model="input.inputNumber" data-is-number="yes" />
          <input type="radio" />
          <input type="radio" name="radio" value="radio1" @input="onInput" v-model="input.inputRadio" />
          <input type="radio" name="radio" value="radio2" @input="onInput" v-model="input.inputRadio" />
          <input type="checkbox" @input="onInput" v-model="input.inputCheckbox" />
        </div>
        <textarea v-else-if="item === 'textarea'" placeholder="请输入内容" maxlength="50" :auto-height="true" value="我是 textarea" @input="onTextareaInput" />
        <div v-else-if="item === 'label'">
          <!-- input -->
          <label>
            <div>输入框1</div>
            <input placeholder="输入框1" @change="onLabelChange"/>
          </label>
          <label for="input2">
            <div>输入框2</div>
          </label>
          <input id="input2" placeholder="输入框2" @change="onLabelChange"/>
          <!-- radio -->
          <label>
            <div>radio1</div>
            <input name="label-radio" type="radio" checked="checked" @change="onLabelChange"/>
          </label>
          <label for="input3">
            <div>radio2</div>
          </label>
          <input name="label-radio" type="radio" id="input3" @change="onLabelChange"/>
          <!-- checkbox -->
          <label>
            <div>checkbox1</div>
            <input type="checkbox" @change="onLabelChange"/>
          </label>
          <label for="input4">
            <div>checkbox2</div>
          </label>
          <input type="checkbox" id="input4" @change="onLabelChange"/>
          <!-- switch -->
          <label>
            <div>switch1</div>
            <wx-component behavior="switch" @change="onLabelChange"></wx-component>
          </label>
          <label for="switch2">
            <div>switch2</div>
          </label>
          <wx-component behavior="switch" id="switch2" @change="onLabelChange"></wx-component>
        </div>
        <video v-else-if="item === 'video'" class="video" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" :muted="true" :show-mute-btn="true" :controls="true">
          <Inner></Inner>
        </video>
        <canvas v-else-if="item === 'canvas'" class="canvas" ref="canvas" canvas-id="canvas" width="300" height="200">
          <Inner style="margin-top: 100px;"></Inner>
        </canvas>
        <!-- 使用 wx-component 来创建内置组件 -->
        <wx-component v-else-if="item === 'view'" :behavior="item">我是视图</wx-component>
        <wx-component v-else-if="item === 'text'" :behavior="item" :selectable="true">{{'this is first line\nthis is second line'}}</wx-component>
        <wx-component v-else-if="item === 'button'" :behavior="item" open-type="share">分享</wx-component>
        <wx-component v-else-if="item === 'image'" :behavior="item" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-component>
        <div v-else-if="item === 'picker'">
          <wx-component :behavior="item" :value="1" :range="['美国', '中国', '巴西', '日本']">点击&nbsp;&nbsp;选择国家</wx-component>
          <wx-component :behavior="item" mode="region" @change="onPickerChange">
            <span>点击&nbsp;&nbsp;</span>
            <span>选择城市</span>
          </wx-component>
        </div>
        <div v-else-if="item === 'switch'">
          <wx-component :behavior="item" type="switch" :checked="true" @change="onSwitchChange"></wx-component>
          <wx-component :behavior="item" type="checkbox" @change="onSwitchChange"></wx-component>
        </div>
        <wx-component v-else-if="item === 'slider'" :behavior="item" min="50" max="200" :show-value="true" @change="onSliderChange"></wx-component>
        <wx-component v-else-if="item === 'map'" :behavior="item" :class="item" :longitude="113.324520" :latitude="23.099994" :scale="14" :controls="map.controls" :markers="map.markers" :polyline="map.polyline" :show-location="true" @markertap="onMapMarkerTap" @regionchange="onMapRegionChange" @controltap="onMapControlTap">
          <Inner></Inner>
        </wx-component>
        <wx-compoennt v-else-if="item === 'cover-view'" :behavior="item">测试 cover-view</wx-compoennt>
        <wx-component v-else-if="item === 'cover-image'" behavior="cover-view">
          <wx-component :behavior="item" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"></wx-component>
        </wx-component>
        <wx-component v-else-if="item === 'live-player'" :behavior="item" :class="item" mode="live" :autoplay="true" src="rtmp://live.hkstv.hk.lxdns.com/live/hks" @statechange="onLivePlayerStateChange">
          <Inner></Inner>
        </wx-component>
        <wx-component v-else-if="item === 'live-pusher'" :behavior="item" :class="item" mode="RTC" :autopush="true" url="https://domain/push_stream" @statechange="onLivePusherStateChange">
          <Inner></Inner>
        </wx-component>
        <wx-component v-else-if="item === 'camera'" :behavior="item" :class="item">
          <Inner></Inner>
        </wx-component>
        <wx-component v-else-if="item === 'web-view'" :behavior="item" :class="item" src="https://www.qq.com/"></wx-component>
        <!-- 不支持标签 -->
        <iframe v-else-if="item === 'iframe'"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Inner from './Inner.vue'

export default {
  name: 'App',
  components: {
    Inner,
  },
  data() {
    return {
      list: [
        'normal',
        'img',
        'input',
        'textarea',
        'label',
        'video',
        'canvas',
        'view',
        'text',
        'button',
        'picker',
        'switch',
        'slider',
        'image',
        'map',
        'cover-view',
        'cover-image',
        'live-player',
        'live-pusher',
        'camera',
        // 'web-view',
        'iframe',
      ],
      input: {
        inputText: '',
        inputNumber: '',
        inputRadio: 'radio2',
        inputCheckbox: true,
      },
      map: {
        markers: [{
          iconPath: 'https://i.loli.net/2019/07/27/5d3c141367f2784840.jpg',
          id: 0,
          latitude: 23.099994,
          longitude: 113.324520,
          width: 50,
          height: 50,
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
      }
    }
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
    const canvas = this.$refs.canvas[0]
    canvas.$$getContext().then(context => {
      context.setStrokeStyle("#00ff00")
      context.setLineWidth(5)
      context.rect(0, 0, 200, 200)
      context.stroke()
      context.setStrokeStyle("#ff0000")
      context.setLineWidth(2)
      context.moveTo(160, 100)
      context.arc(100, 100, 60, 0, 2 * Math.PI, true)
      context.moveTo(140, 100)
      context.arc(100, 100, 40, 0, Math.PI, false)
      context.moveTo(85, 80)
      context.arc(80, 80, 5, 0, 2 * Math.PI, true)
      context.moveTo(125, 80)
      context.arc(120, 80, 5, 0, 2 * Math.PI, true)
      context.stroke()
      context.draw()
    })
  },
  methods: {
    onInput(evt) {
      console.log('onInput', evt.target.value, evt)
    },

    onTextareaInput(evt) {
      console.log('onTextareaInput', evt.target.value)
    },

    onImgLoad(evt) {
      console.log('onImgLoad')
    },

    onPickerChange(evt) {
      console.log('onPickerChange', evt.detail)
    },

    onMapMarkerTap(evt) {
      console.log('onMapMarkerTap', evt.detail)
    },

    onMapRegionChange(evt) {
      console.log('onMapRegionChange', evt.detail)
    },

    onMapControlTap(evt) {
      console.log('onMapControlTap', evt.detail)
    },

    onLivePlayerStateChange(evt) {
      console.log('onLivePlayerStateChange', evt.detail)
    },

    onLivePusherStateChange(evt) {
      console.log('onLivePusherStateChange', evt.detail)
    },

    onSwitchChange(evt) {
      console.log('onSwitchChange', evt.detail)
    },

    onLabelChange(evt) {
      console.log('onLabelChange', evt.detail)
    },

    onSliderChange(evt) {
      console.log('onSliderChange', evt.detail)
    },
  }
}
</script>

<style>
.label {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background: rgba(7, 193, 96, 0.06);
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
</style>
