let navigator

if (process.env.isMiniprogram) {
  navigator = {
    to (url) {
      window.location.href = url
    },
    open (url) {
      window.open(url)
    },
    back () {
      wx.navigateBack()
    }
  }
} else {
  navigator = {
    to (url) {
      window.location.href = `${url}.html`
    },
    open (url) {
      window.open(`${url}.html`)
    },
    back () {
      const userAgent = window.navigator.userAgent
      if ((userAgent.indexOf('MSIE') >= 0) && (userAgent.indexOf('Opera') < 0)) { // IE
        if (history.length > 0) {
          window.history.go(-1)
        } else {
          window.opener = null; window.close()
        }
      } else { // 非IE浏览器
        if (userAgent.indexOf('Firefox') >= 0 ||
          userAgent.indexOf('Opera') >= 0 ||
          userAgent.indexOf('Safari') >= 0 ||
          userAgent.indexOf('Chrome') >= 0 ||
          userAgent.indexOf('WebKit') >= 0) {

          if (window.history.length > 1) {
            window.history.go(-1)
          } else {
            window.opener = null; window.close()
          }
        } else { // 未知的浏览器
          window.history.go(-1)
        }
      }
    }
  }
}

export default navigator
