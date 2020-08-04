<template>
  <div class="cnt">
    <button @click="bigUpdate">大更新</button>
    <div class="item" v-for="item in list" :key="item">
      <div class="head" :class="{green: item > 1000, red: item > 10000}">{{item}}</div>
      <div class="info">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line" style="width: 70%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      url: location.href,
      list: [],
    }
  },
  created() {
    // 初始是全量更新
    let key = 0
    for (let i = 0; i < 50; i++) this.list.push(++key)

    window.addEventListener('reachbottom', () => {
      // 局部更新
      for (let i = 1, len = this.list.length; i <= 5; i++) {
        if (i === 5 || i === 1) this.list[len - i] += 10000 // 修改
        if (i === 2) this.list.splice(len - i, 1) // 删除
      }
      for (let i = 0; i < 5; i++) this.list.push(++key) // 追加
    })
  },
  methods: {
    bigUpdate() {
      // 触发全量更新
      for (let i = 0; i < 50; i++) this.list[i] += 1000 // 修改
      for (let i = 0, len = this.list.length; i < 50; i++) this.list.push(i + len)

    },
  },
}
</script>

<style>
html {
  background-color: #eee;
}
button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
  margin-bottom: 20px;
}
.cnt {
  margin-top: 20px;
}
.item {
  display: flex;
  background-color: #fff;
  border-radius: 20px;
  margin: 0 20px 20px;
}
.head {
  margin: 20px;
  width: 80px;
  height: 80px;
  background-color: #ccc;
  color: #fff;
  border-radius: 50%;
  font-size: 16px;
  text-align: center;
  line-height: 80px;
}
.green {
  background-color: green;
}
.red {
  background-color: red;
}
.info {
  flex: 1;
  padding: 30px 30px 20px 5px;
}
.line {
  height: 15px;
  background-color: #eee;
  margin-bottom: 10px;
}
</style>
