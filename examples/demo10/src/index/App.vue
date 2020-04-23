<template>
  <div class="cnt">
    <h2>kbone</h2>
    <comp-a ref="compA" class="block" :prefix="prefixA" :suffix="suffixA" @someevent="onEvent">
      <div>comp-a slot</div>
    </comp-a>
    <comp-b class="block" :prefix="prefixB">
      <div>comp-b slot</div>
    </comp-b>
    <comp-c class="block">
      <div>comp-c slot</div>
    </comp-c>
    <button class="btn" @click="onClick">update</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      suffixA: 'suffix-a',
      prefixB: 'prefix-b',
    }
  },
  methods: {
    onClick() {
      this.prefixA = 'prefix-new-a'
      this.prefixB = 'prefix-new-b'

      this.$refs.compA._wxCustomComponent.printf()
    },

    onEvent(evt) {
      console.log('someevent', evt)
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
