Page({
  page2() {
    wx.switchTab({
      url: '/pages/index2/index',
    })
  },

  page3() {
    wx.switchTab({
      url: '/pages/index3/index',
    })
  },

  page4() {
    wx.navigateTo({
      url: `/pages/index4/index?type=open&targeturl=${encodeURIComponent('/spa')}`,
    })
  },
})
