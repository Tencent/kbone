Component({
  data: {
    selected: 0,
    color: '#000000',
    selectedColor: '#07c160',
    list: [{
      pagePath: '/pages/page1/index',
      text: 'page1',
      iconPath: '/images/145b82b8ad1b96ec9935ef71dd82fa28.png',
      selectedIconPath: '/images/c803704bee65cb9024a3b5b898ce376b.png',
    }, {
      pagePath: '/pages/page2/index',
      text: 'page2',
      iconPath: '/images/90086e8f8fbd30adf8e5ff4f7ee293c0.png',
      selectedIconPath: '/images/23be89c5ce5665d08a304663360b27c3.png',
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path

      wx.switchTab({url})

      this.setData({
        selected: data.index
      })
    }
  }
})