<template>
  <div class="cnt">
    <i class="el-icon-edit"></i>
    <i class="el-icon-share"></i>
    <i class="el-icon-delete"></i>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {},
}
</script>

<style>
.cnt {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.cnt > i, .cnt > .el-button {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
}
</style>
