<template>
  <div class="cnt">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="head">{{index + 1}}</div>
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
    for (let i = 0; i < 50; i++) this.list.push(i)

    window.addEventListener('reachbottom', () => {
      for (let i = 0; i < 5; i++) this.list.push(i)
    })
  },
  methods: {},
}
</script>

<style>
html {
  background-color: #eee;
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
