Page({
  data: {
    route: '',
  },
  onPageScroll(options) {
    if (!this.kbonePage) {
      this.kbonePage = this.selectComponent('#kbone-page')
    }

    if (this.kbonePage) {
      this.kbonePage.onPageScroll(options)
    }
  },
  onTap() {
    this.setData({
      route: this.route,
    })
  },
})
