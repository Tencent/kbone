<template>
  <div>
    <div class="cnt">
      <el-radio v-model="radio1" label="1">备选项</el-radio>
      <el-radio v-model="radio1" label="2">备选项</el-radio>
    </div>
    <div class="cnt">
      <el-radio disabled v-model="radio2" label="禁用">备选项</el-radio>
      <el-radio disabled v-model="radio2" label="选中且禁用">备选项</el-radio>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio3">
        <el-radio :label="3">备选项</el-radio>
        <el-radio :label="6">备选项</el-radio>
        <el-radio :label="9">备选项</el-radio>
      </el-radio-group>
    </div>
    <!-- el-radio-button 不支持选中态，因为小程序不支持 input[type=radio]:checked -->
    <!-- <div class="cnt">
      <el-radio-group v-model="radio4">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio5" size="medium">
        <el-radio-button label="上海" ></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio6" size="small">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京" disabled ></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio7" disabled size="mini">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div> -->
    <div class="cnt">
      <el-radio v-model="radio8" label="1" border>备选项1</el-radio>
      <el-radio v-model="radio8" label="2" border>备选项2</el-radio>
    </div>
    <div class="cnt">
      <el-radio v-model="radio9" label="1" border size="medium">备选项1</el-radio>
      <el-radio v-model="radio9" label="2" border size="medium">备选项2</el-radio>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio10" size="small">
        <el-radio label="1" border>备选项1</el-radio>
        <el-radio label="2" border disabled>备选项2</el-radio>
      </el-radio-group>
    </div>
    <div class="cnt">
      <el-radio-group v-model="radio11" size="mini" disabled>
        <el-radio label="1" border>备选项1</el-radio>
        <el-radio label="2" border>备选项2</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      radio1: '1',
      radio2: '选中且禁用',
      radio3: 3,
      radio4: '上海',
      radio5: '上海',
      radio6: '上海',
      radio7: '上海',
      radio8: '1',
      radio9: '1',
      radio10: '1',
      radio11: '1',
    }
  },
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

.cnt > .el-radio, .cnt > .el-radio-group {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 10px;
}
</style>
