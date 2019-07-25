<template>
  <div>
    <div class="group" v-for="item in list" :key="item">
      <div class="label">{{item}}</div>
      <div class="comp">
        <view v-if="item === 'view'">我是视图</view>
        <img v-if="item === 'image'" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" width="50" height="50" />
        <input v-else-if="item === 'input'" placeholder="请输入内容" @input="onInput" />
        <wx-component v-else-if="item === 'picker'" behavior="picker" mode="region" @change="onPickerChange">选择城市</wx-component>
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
        'view',
        'image',
        'input',
        'picker'
      ],
    }
  },
  methods: {
    onInput(evt) {
      console.log(evt.target.value)
    },

    onPickerChange(evt) {
      console.log(evt.detail)
    },
  }
}
</script>

<style>
.group {
  margin-top: 20px;
}

.label {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background: rgba(7, 193, 96, 0.06);
}

.comp {
  padding: 10px 20px;
}
</style>
