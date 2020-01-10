<template>
  <div>
    <ul class="tab">
      <li class="tab-item" :class="{selected: wxPrefix === 0}" @click="wxPrefix = 0">wx-component 用法</li>
      <li class="tab-item" :class="{selected: wxPrefix === 1}" @click="wxPrefix = 1">wx- 前缀用法</li>
      <!-- <li class="tab-item" :class="{selected: wxPrefix === 2}" @click="wxPrefix = 2">无前缀用法</li> -->
    </ul>
    <Comp :wxPrefix="wxPrefix" />
  </div>
</template>

<script>
import Comp from './Component.vue'

export default {
  name: 'App',
  components: {
    Comp,
  },
  data() {
    return {
      wxPrefix: 1, // 0 - wx-component 用法，1 - wx- 前缀用法，2 - 无前缀用法(需要配置 runtime.wxComponent 字段)
    }
  },
}
</script>

<style>
.tab {
  padding: 10px;
}

.tab-item {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 5px;
}

.tab-item.selected {
  background: #3eaf7c;
  color: #fff;
}
</style>
