Page({
  data: {
    route: '',
    params: {
      type: 'open',
      targeturl: encodeURIComponent('/spa'),
    },
  },
  onLoad(args) {
    this.setData({
      route: this.route,
      params: {
        type: args.type || 'open',
        targeturl: args.targeturl || encodeURIComponent('/spa'),
      },
    })
  },
})
