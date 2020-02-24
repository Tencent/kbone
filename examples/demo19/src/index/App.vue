<template>
  <div class="container">
    <!-- 用户 openid -->
    <div class="userinfo">
      <wx-button 
        open-type="getUserInfo" 
        @getuserinfo="onGetUserInfo"
        class="userinfo-avatar"
        :style="{backgroundImage: `url(${avatarUrl})`}"
        size="default"
      ></wx-button>
      <div class="userinfo-nickname-wrapper">
        <wx-button class="userinfo-nickname" @click="onGetOpenid">点击获取 openid</wx-button>
      </div>
    </div>

    <!-- 上传图片 -->
    <div class="uploader">
      <div class="uploader-text" @click="doUpload">
        <span>上传图片</span>
      </div>
      <div class="uploader-container" v-if="imgUrl">
        <img class="uploader-image" :src="imgUrl" mode="aspectFit" />
      </div>
    </div>

    <!-- 操作数据库 -->
    <div class="uploader">
      <a href="/databaseguide" target="_blank" class="uploader-text">
        <span>前端操作数据库</span>
      </a>
    </div>
  </div>
</template>

<script>
const app = getApp()

export default {
  name: 'App',
  data() {
    return {
      avatarUrl: require('../images/user-unlogin.png'),
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: '',
    }
  },
  mounted() {
    if (!wx.cloud) {
      location.href = '/chooselib'
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.avatarUrl = res.userInfo.avatarUrl
              this.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  methods: {
    onGetUserInfo(evt) {
      if (!this.logged && evt.detail.userInfo) {
        this.logged = true
        this.avatarUrl = evt.detail.userInfo.avatarUrl
        this.userInfo = evt.detail.userInfo
      }
    },

    onGetOpenid() {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          window.open('/userconsole')
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          window.open('/deployfunctions')
        }
      })
    },

    /**
     * 上传图片
     */
    doUpload() {
      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          wx.showLoading({
            title: '上传中',
          })

          const filePath = res.tempFilePaths[0]
          
          // 上传图片
          const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)

              app.globalData.fileID = res.fileID
              app.globalData.cloudPath = cloudPath
              app.globalData.imagePath = filePath
              
              window.open('/storageconsole')
            },
            fail: err => {
              console.error('[上传文件] 失败：', err)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })

        },
        fail: e => {
          console.error(e)
        }
      })
    },
  },
}
</script>

<style lang="less">
html {
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.userinfo, .uploader, .tunnel {
  margin-top: 40rpx;
  height: 140rpx;
  width: 100%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-left: none;
  border-right: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 300ms ease;
}

.userinfo {
  padding-left: 120rpx;
}

wx-button.userinfo-avatar {
  width: 100rpx;
  height: 100rpx;
  margin: 20rpx;
  padding: 0;
  border-radius: 50%;
  background-size: cover;
  background-color: white;
}

.userinfo-avatar[size] {
  width: 100rpx;
}


.userinfo-avatar:after {
  border: none;
}

wx-button.userinfo-nickname {
  font-size: 32rpx;
  color: #007aff;
  background-color: white;
  background-size: cover;
  text-align: left;
  padding-left: 0;
  margin-left: 10px;
}

.userinfo-nickname::after {
  border: none;
}

.userinfo-nickname-wrapper {
  flex: 1;
}

.uploader, .tunnel {
  height: auto;
  padding: 0 0 0 40rpx;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
}

.uploader-text, .tunnel-text {
  width: 100%;
  line-height: 52px;
  font-size: 34rpx;
  color: #007aff;
}

.uploader-container {
  width: 100%;
  height: 400rpx;
  padding: 20rpx 20rpx 20rpx 0;
  display: flex;
  align-content: center;
  justify-content: center;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.uploader-image {
  width: 100%;
  height: 360rpx;
}

.tunnel {
  padding: 0 0 0 40rpx;
}

.tunnel-text {
  position: relative;
  color: #222;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.tunnel-text:first-child {
  border-top: none;
}

.tunnel-switch {
  position: absolute;
  right: 20rpx;
  top: -2rpx;
}

.disable {
  color: #888;
}

.service {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(#007aff, #0063ce);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-content: center;
  justify-content: center;
  transition: all 300ms ease;
}

.service-button {
  position: absolute;
  top: 40rpx;
}

.service:active {
  box-shadow: none;
}

.request-text {
  padding: 20rpx 0;
  font-size: 24rpx;
  line-height: 36rpx;
  word-break: break-all;
}
</style>
