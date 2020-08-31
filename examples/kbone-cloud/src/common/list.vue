<template>
  <div>
    <!-- 列表模块 -->
    <div class="list-box">
      <div v-for="(item, index) in list" :key="index" class="list-item">
        <div class="text">
          <h3>{{ item.title }}</h3>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </div>
    <!-- 添加模块 -->
    <div class="edit-box">
      <input placeholder="标题" v-model="title" />
      <textarea placeholder="描述" v-model="desc"></textarea>
      <button @click="add">新增</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wxcloud: {}, // 统一的云开发实例
      list: [], // 列表
      title: '', // 新增标题
      desc: '' // 新增描述
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      if (process.env.isMiniprogram) {
        // 小程序
        this.wxcloud = wx.cloud
      } else {
        // web
        this.wxcloud = cloud
      }
      await this.wxcloud.init({
        appid: 'your appid',
        env: 'your env'
      })
      this.get()
    },
    /**
     * 拉取列表信息
     * 调用云函数 get
     */
    get() {
      this.wxcloud.callFunction({
        name: 'get'
      }).then(res => {
        this.list = res.result || []
      })
    },
    /**
     * 添加一条记录
     * 调用云函数 add
     */
    add() {
      this.wxcloud.callFunction({
        name: 'add',
        data: {
          title: this.title,
          desc: this.desc
        }
      }).then(res => {
        console.log(res)
        if (res.errMsg == 'cloud.callFunction:ok') {
          this.title = ''
          this.desc = ''
          this.get()
        } else {
          // error
        }
      })
    }
  }
}
</script>

<style>
.list-box, .edit-box {
  background-color: #FFF;
  margin: 16px;
  padding: 20px;
  border-radius: 10px;
}
.list-item {
  padding: 8px 0;
  border-bottom: #CCC 1px solid;
}
.image {
  vertical-align: top;
  width: 30%;
  height: 30%;
}
.text {
  /* width: 65%; */
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
}
.text h3 {
  line-height: 1.8rem;
  margin: 0;
}
.text span {
  color: #888888;
}
/* edit样式 */
.edit-box input, .edit-box textarea {
  font-size: 0.6rem;
  line-height: 1.5rem;
  width: calc(100% - 20px);
  border: #ccc 1px solid;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 0 10px;
}
.edit-box button {
  font-size: 0.8rem;
  width: 100%;
  border: none;
  color: #fff;
  background-color: #07c160;
  border-radius: 4px;
  padding: 6px 0;
  text-align: center;
}
</style>
