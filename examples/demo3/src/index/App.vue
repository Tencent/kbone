<template>
  <div>
    <div class="group" v-for="item in list" :key="item">
      <div class="label">{{item}}</div>
      <div class="comp">
        <!-- 可使用 html 标签替代的内置组件 -->
        <img v-if="item === 'image'" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" width="50" height="50" />
        <input v-else-if="item === 'input'" type="number" placeholder="请输入内容" @input="onInput" />
        <textarea v-else-if="item === 'textarea'" placeholder="请输入内容" maxlength="50" :auto-height="true" value="我是 textarea" @input="onTextareaInput" />
        <video class="video" v-else-if="item === 'video'" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" :muted="true" :show-mute-btn="true" :controls="true">
          <div class="controls" @click="onVideoControlsClick">
            <div>
              img1:
              <img class="video-img" src="https://i.loli.net/2019/07/27/5d3c141367f2784840.jpg"/>
            </div>
            <div>
              img2:
              <img class="video-img" src="https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg"/>
            </div>
            <div>this is video</div>
          </div>
          <div class="btn-cnt">
            <wx-component class="video-btn" behavior="button" open-type="share">分享</wx-component>
          </div>
        </video>
        <!-- 使用 wx-component 来创建内置组件 -->
        <wx-component v-else-if="item === 'view'" behavior="view">我是视图</wx-component>
        <wx-component v-else-if="item === 'button'" behavior="button" open-type="share">分享</wx-component>
        <wx-component v-else-if="item === 'picker'" behavior="picker" mode="region" @change="onPickerChange">
          <span>点击&nbsp;&nbsp;</span>
          <span>选择城市</span>
        </wx-component>
        <!-- 不支持标签 -->
        <iframe v-else-if="item === 'iframe'"></iframe>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      list: [
        'image',
        'input',
        'textarea',
        'video',
        'view',
        'button',
        'picker',
        'iframe',
      ],
    }
  },
  created() {
    window.onDealWithNotSupportDom = dom => {
      dom.textContent = `标签 ${dom.tagName.toLowerCase()} 暂不支持`
    }
  },
  methods: {
    onInput(evt) {
      console.log(evt.target.value)
    },

    onTextareaInput(evt) {
      console.log(evt.target.value)
    },

    onPickerChange(evt) {
      console.log(evt.detail)
    },

    onVideoControlsClick(evt) {
      console.log('onVideoControlsClick')
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

.comp {
  padding: 10px 20px;
}

.video {
  position: relative;
  width: 300px;
  height: 225px;
}

.controls {
  display: flex;
  width: 100%;
  height: 60px;
  background: #ddd;
}

.controls .video-img {
  width: 40px;
  height: 40px;
}

.btn-cnt {
  position: relative;
  width: 100%;
}

.btn-cnt .video-btn {
  margin: 10px auto;
  width: 100px;
  height: 30px;
  color: #fff;
  background: #07c160;
  text-align: center;
  line-height: 30px;
  border-radius: 10px;
}
</style>
