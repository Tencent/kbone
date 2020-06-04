<template>
  <div>
    <ul class="tabbar">
      <li><router-link class="link" to="/spa">normal</router-link></li>
      <li><router-link class="link" to="/spa/a">aaa</router-link></li>
      <li><router-link class="link" to="/spa/b">bbb</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<style>
.tabbar {
  margin-top: 20px;
  padding: 0;
  width: 100%;
  display: flex;
  list-style: none;
  justify-content: center;
}
.tabbar li {
  position: relative;
  display: block;
  height: 50px;
  width: 80px;
  text-align: center;
  line-height: 50px;
  background: #dff1e7;
  margin: 5px;
}
.tabbar li .link {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
