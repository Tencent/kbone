class Store {


  id = 1

  data = {
    todo: [{ text: '学习 Kbone', id: 0, done: false }, { text: '学习 Omi', id: 1, done: false }],
    left: 2,
    type: 'all',
    done: 0,
    inputText: ''
  }


  textInput = (evt) => {
    this.data.inputText = evt.currentTarget.value
  }

  gotoAbout() {
    wx.navigateTo({
      url: '../about/index'
    })
  }

  toggle = (evt) => {
    for (let i = 0, len = this.data.todo.length; i < len; i++) {
      const item = this.data.todo[i]
      if (item.id === Number(evt.currentTarget.dataset.id)) {
        item.done = !item.done
        this.computeCount()
        break
      }
    }
  }

  computeCount = () => {
    this.data.left = 0
    this.data.done = 0
    for (let i = 0, len = this.data.todo.length; i < len; i++) {
      this.data.todo[i].done ? this.data.done++ : this.data.left++
    }
  }

  deleteItem = (evt) => {
    for (let i = 0, len = this.data.todo.length; i < len; i++) {
      const item = this.data.todo[i]
      if (item.id === Number(evt.currentTarget.dataset.id)) {
        this.data.todo.splice(i, 1)
        this.computeCount()
        break
      }
    }
  }

  newTodo = () => {
    if (this.data.inputText.trim() === '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })

      return
    }

    this.data.todo.unshift({
      text: this.data.inputText,
      id: ++this.id,
      done: false,
      createTime: new Date()
    })
    this.computeCount()
    this.data.inputText = ''

  }

  installed() {

  }

  filter = (evt) => {
    this.data.type = evt.currentTarget.dataset.filter
  }

  clear = () => {
    //因为是自定义事件
    //注意这里的 this 指向

    wx.showModal({
      title: '提示',
      content: '确定清空已完成任务？',
      success: (res) => {
        if (res.confirm) {
          for (let i = 0, len = this.data.todo.length; i < len; i++) {
            const item = this.data.todo[i]
            if (item.done) {
              this.data.todo.splice(i, 1)
              len--
              i--
            }
          }
          this.data.done = 0

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

  gotoAbout() {
    wx.navigateTo({
      url: '../about/index'
    })
  }

  clickHandle() {
    if ("undefined" != typeof wx && wx.getSystemInfoSync) {
      wx.navigateTo({
        url: '../log/index?id=1'
      })
    } else {
      location.href = 'log.html'
    }
  }
}

export default Store