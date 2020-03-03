<template>
  <div class="cnt">
    <el-link href="/" target="_blank">默认链接</el-link>
    <el-link type="primary">主要链接</el-link>
    <el-link type="success">成功链接</el-link>
    <el-link type="warning">警告链接</el-link>
    <el-link type="danger">危险链接</el-link>
    <el-link type="info">信息链接</el-link>
    <el-link disabled>默认链接</el-link>
    <el-link type="primary" disabled>主要链接</el-link>
    <el-link type="success" disabled>成功链接</el-link>
    <el-link type="warning" disabled>警告链接</el-link>
    <el-link type="danger" disabled>危险链接</el-link>
    <el-link type="info" disabled>信息链接</el-link>
    <el-link :underline="false">无下划线</el-link>
    <el-link>有下划线</el-link>
    <el-link icon="el-icon-edit">编辑</el-link>
    <el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link>
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

.cnt > .el-link {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
}
</style>
