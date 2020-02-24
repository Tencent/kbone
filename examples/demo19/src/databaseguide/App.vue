<template>
  <div class="container">
    <!-- 导航 -->
    <div class="list">
      <div class="list-item">
        <span class="request-text">数据库指引</span>
      </div>
      <div class="list-item">
        <span class="request-text" v-for="(item, index) in 7" :key="item" :style="{color: step === index + 1 ? 'red': 'black'}">{{index + 1}}</span>
      </div>
      <div class="list-item" v-if="openid">
        <span class="request-text">openid：{{openid}}</span>
      </div>
      <div class="list-item" v-if="counterId">
        <span class="request-text">当前记录 ID：{{counterId}}</span>
      </div>
    </div>

    <!-- 快速操作数据库指引 -->

    <!-- 简介 -->
    <div class="guide" v-if="step === 1">
      <span class="headline">示例介绍</span>
      <span class="p">1. 以计数器为例，在此演示如何操作数据库</span>
      <span class="p">2. 数据库操作大多需要用户 openid，需先配置好 login 云函数，如已配置好，点击下一步，获取用户 openid 并开始我们的指引</span>
      <div class="nav">
        <wx-button class="next" size="mini" type="default" @click="nextStep">下一步</wx-button>
      </div>
    </div>

    <!-- 新建集合 -->
    <div class="guide" v-if="step === 2">
      <span class="headline">新建集合</span>
      <span class="p">1. 打开云开发控制台，进入到数据库管理页</span>
      <img class="image1" src="../images/console-entrance.png" mode="aspectFit" />
      <span class="p">2. 选择添加集合，集合名为 counters</span>
      <img class="flat-image" src="../images/create-collection.png" mode="aspectFit" />
      <span class="p">3. 可以看到 counters 集合出现在左侧集合列表中</span>
      <span class="p">注：集合必须在云开发控制台中创建</span>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="nextStep">下一步</wx-button>
      </div>
    </div>

    <!-- 新增记录 -->
    <div class="guide" v-if="step === 3">
      <span class="headline">新增记录</span>
      <span class="p">1. onAdd 方法会往 counters 集合新增一个记录，新增如下格式的一个 JSON 记录</span>
      <span class="code">
      {
        "_id": "数据库自动生成记录 ID 字段",
        "_openid": "数据库自动插入记录创建者的 openid",
        "count": 1
      }
      </span>
      <span class="p">2. 点击按钮</span>
      <wx-button size="mini" type="default" @click="onAdd">新增记录</wx-button>
      <span class="p" v-if="counterId">新增的记录 _id 为：{{counterId}}</span>
      <span class="p">3. 在云开发 -> 数据库 -> counters 集合中可以看到新增的记录</span>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="nextStep" v-if="counterId">下一步</wx-button>
      </div>
    </div>

    <!-- 查询记录 -->
    <div class="guide" v-if="step === 4">
      <span class="headline">查询记录</span>
      <span class="p">点击按钮</span>
      <wx-button size="mini" type="default" @click="onQuery">查询记录</wx-button>
      <span class="code" v-if="queryResult">{{queryResult}}</span>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="nextStep">下一步</wx-button>
      </div>
    </div>

    <!-- 更新记录 -->
    <div class="guide" v-if="step === 5">
      <span class="headline">更新记录</span>
      <span class="p">点击下方按钮更新计数器</span>
      <div class="counter">
        <wx-button class="minus" size="mini" type="default" @click="onCounterDec">-</wx-button>
        <span class="p">{{count}}</span>
        <wx-button class="plus" size="mini" type="default" @click="onCounterInc">+</wx-button>
      </div>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="nextStep">下一步</wx-button>
      </div>
    </div>

    <!-- 删除记录 -->
    <div class="guide" v-if="step === 6">
      <span class="headline">删除记录</span>
      <span class="p">点击下方按钮删除计数器</span>
      <wx-button size="mini" type="default" @click="onRemove">删除记录</wx-button>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep" v-if="counterId">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="nextStep">下一步</wx-button>
      </div>
    </div>

    <!-- 结语 -->
    <div class="guide" v-if="step === 7">
      <span class="headline">完成指引 !</span>
      <span class="p">恭喜你，至此已完成数据库操作入门基础，可以点击调试器中的链接，查看详尽的数据库文档</span>

      <div class="nav">
        <wx-button class="prev" size="mini" type="default" @click="prevStep">上一步</wx-button>
        <wx-button class="next" size="mini" type="default" @click="goHome">回到首页</wx-button>
      </div>
    </div>
  </div>
</template>

<script>
const app = getApp()

export default {
  name: 'App',
  data() {
    return {
      step: 1,
      counterId: '',
      openid: '',
      count: null,
      queryResult: '',
    }
  },
  mounted() {
    if (app.globalData.openid) {
      this.openid = app.globalData.openid
    }
  },
  methods: {
    onAdd() {
      const db = wx.cloud.database()
      db.collection('counters').add({
        data: {
          count: 1
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.counterId = res._id
          this.count = 1
          wx.showToast({
            title: '新增记录成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    },

    onQuery() {
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('counters').where({
        _openid: this.openid
      }).get({
        success: res => {
          this.queryResult = JSON.stringify(res.data, null, 2)
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    },

    onCounterInc() {
      const db = wx.cloud.database()
      const newCount = this.count + 1
      db.collection('counters').doc(this.counterId).update({
        data: {
          count: newCount
        },
        success: res => {
          this.count = newCount
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '更新记录失败'
          })
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    },

    onCounterDec() {
      const db = wx.cloud.database()
      const newCount = this.count - 1
      db.collection('counters').doc(this.counterId).update({
        data: {
          count: newCount
        },
        success: res => {
          this.count = newCount
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '更新记录失败'
          })
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    },

    onRemove() {
      if (this.counterId) {
        const db = wx.cloud.database()
        db.collection('counters').doc(this.counterId).remove({
          success: res => {
            wx.showToast({
              title: '删除成功',
            })
            this.counterId = ''
            this.count = null
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '删除失败',
            })
            console.error('[数据库] [删除记录] 失败：', err)
          }
        })
      } else {
        wx.showToast({
          title: '无记录可删，请见创建一个记录',
        })
      }
    },

    nextStep() {
      // 在第一步，需检查是否有 openid，如无需获取
      if (this.step === 1 && !this.openid) {
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            app.globalData.openid = res.result.openid
            this.step = 2
            this.openid = res.result.openid
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '获取 openid 失败，请检查是否有部署 login 云函数',
            })
            console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
          }
        })
      } else {
        const callback = this.step !== 6 ? function() {} : function() {
          console.group('数据库文档')
          console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
          console.groupEnd()
        }

        this.step = this.step + 1
        this.$nextTick(callback)
      }
    },

    prevStep() {
      this.step = this.step - 1
    },

    goHome() {
      const pages = getCurrentPages()
      if (pages.length === 2) {
        wx.navigateBack()
      } else if (pages.length === 1) {
        location.href = '/index'
      } else {
        wx.reLaunch({
          url: 'pages/index/index',
        })
      }
    },
  },
}
</script>

<style lang="less">
@import "../style/guide";

.guide .counter {
  margin-top: 50rpx;
  display: flex;
  flex-direction: row;
  align-content: space-between;
}
</style>
