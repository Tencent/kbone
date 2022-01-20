Page({
  data: {
    route: '',
  },
  onLoad() {
    this.setData({
      route: this.route,
    })
  },
  onPageScroll(options) {
    if (!this.kbonePage) {
      this.kbonePage = this.selectComponent('#kbone-page')
    }

    if (this.kbonePage) {
      this.kbonePage.onPageScroll(options)
    }
  },
})
