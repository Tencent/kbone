<template>
  <div>
    <div class="title">弹出位置</div>
    <div class="box">
      <wx-button class="btn" @click="doPopup" data-position="right">右侧弹出</wx-button>
      <wx-button class="btn" @click="doPopup" data-position="top">顶部弹出</wx-button>
      <wx-button class="btn" @click="doPopup" data-position="bottom">底部弹出</wx-button>
      <wx-button class="btn" @click="doPopup" data-position="center">中央弹出</wx-button>
    </div>

    <div class="title">弹窗圆角</div>
    <div class="box">
      <wx-button class="btn" @click="changeRound">设置{{round ? '直角' : '圆角'}}</wx-button>
    </div>

    <div class="title">遮罩层</div>
    <div class="box">
      <wx-button class="btn" @click="changeOverlay">设置{{overlay ? '无' : '有'}}遮罩</wx-button>
      <wx-button class="btn" @click="changeOverlayStyle" data-type="black">黑色半透明遮罩</wx-button>
      <wx-button class="btn" @click="changeOverlayStyle" data-type="white">白色半透明遮罩</wx-button>
      <wx-button class="btn" @click="changeOverlayStyle" data-type="blur">模糊遮罩</wx-button>
    </div>

    <wx-page-container 
      :show="show"
      :round="round"
      :overlay="overlay"
      duration="300"
      :position="position"
      close-on-slide-down="false"
      :custom-style="customStyle"
      :overlay-style="overlayStyle"
      @beforeenter="onBeforeEnter"
      @enter="onEnter"
      @afterenter="onAfterEnter"
      @beforeleave="onBeforeLeave"
      @leave="onLeave"
      @afterleave="onAfterLeave"
      @clickoverlay="onClickOverlay"
    >
      <div class="detail-page">
        <wx-button type="primary" @click="doExit">退出</wx-button>
      </div>
    </wx-page-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      show: false,
      position: 'right',
      round: false,
      overlay: true,
      customStyle: '',
      overlayStyle: '',
    }
  },
  methods: {
    doPopup(evt) {
      const position = evt.currentTarget.dataset.position
      let customStyle = ''
      switch(position) {
        case 'top':
        case 'bottom': 
          customStyle = 'height: 30%;'
          break
        case 'right':
          break
      }
      this.position = position
      this.show = true
      this.customStyle = customStyle
    },

    changeRound() {
      this.round = !this.round
    },

    changeOverlay() {
      this.overlay = !this.overlay
      this.show = true
    },

    changeOverlayStyle(evt) {
      let overlayStyle = ''
      const type = evt.currentTarget.dataset.type
      switch(type) {
        case 'black':
          overlayStyle = 'background-color: rgba(0, 0, 0, 0.7)'
          break
        case 'white':
          overlayStyle = 'background-color: rgba(255, 255, 255, 0.7)'
          break
        case 'blur':
          overlayStyle = 'background-color: rgba(0, 0, 0, 0.7); filter: blur(4px);'
      }
      this.overlayStyle = overlayStyle
      this.show = true

    },

    doExit() {
      this.show = false
    },

    onBeforeEnter(evt) {
      console.log('beforeenter', evt)
    },

    onEnter(evt) {
      console.log('enter', evt)
    },

    onAfterEnter(evt) {
      this.show = true
      console.log('afterenter', evt)
    },

    onBeforeLeave(evt) {
      console.log('beforeleave', evt)
    },

    onLeave(evt) {
      console.log('leave', evt)
    },

    onAfterLeave(evt) {
      this.show = false
      console.log('afterleave', evt)
    },

    onClickOverlay(evt) {
      console.log('clickoverlay', evt)
    }
  },
}
</script>

<style>
html {
  background-color: #f7f8fa;
  color: #323232;
  width: 100%;
  height: 100%;
}

.box {
  margin: 0 12px;
}

.title {
  margin: 0;
  padding: 32px 16px 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
}

.btn {
  display: block;
  width: 100%;
  margin: 10px 0;
  background-color: #fff;
}

.detail-page {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
