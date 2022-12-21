<template>
  <div class="cnt">
    <h2>kbone</h2>
    <comp-a ref="compA" class="block" :prefix="prefixA" :suffix="suffixA" :testObj="testObj" :testArr="testArr" @someevent="onEvent">
      <div>comp-a slot</div>
    </comp-a>
    <comp-b class="block" :prefix="prefixB" name="test" my-class="external-red">
      <div>comp-b slot</div>
    </comp-b>
    <comp-c class="block" @touchstart="log('touchstart')" @touchend="log('touchend')" @click="log('click')">
      <div>comp-c slot</div>
    </comp-c>
    <button class="btn" @click="onClick">update</button>
    <button class="btn" @click="goOther">进入 other 页面</button>
    <!-- weui 组件，补充配置后可直接使用 -->
    <!-- <mp-msg type="success" title="操作成功" size="64">
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
    </mp-msg> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      suffixA: 'suffix-a',
      prefixB: 'prefix-b',
      testObj: {},
      testArr: [],
    }
  },
  methods: {
    onClick() {
      this.prefixA = 'prefix-new-a'
      this.prefixB = 'prefix-new-b'
      this.testObj = {a: 'hello', b: 'kbone'},
      this.testArr = [1, 2, 3, 4, 5, 6, 7]

      this.$refs.compA._wxCustomComponent.printf()
    },

    goOther() {
      window.open('/other')
    },

    onEvent(evt) {
      console.log('someevent', evt)
    },

    log(str) {
      console.log(str)
    },
  },
}
</script>

<style>
.cnt {
  margin: 15px;
}

.block {
  border: 1px solid #ddd;
  padding: 15px;
  box-sizing: content-box;
  display: block;
  margin-bottom: 15px;
}

.btn {
  margin-top: 15px;
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
</style>
