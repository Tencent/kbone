/**
 * 小程序端入口文件
 */
import Vue from 'vue'
import App from './App.vue'

export default function createApp() {
  // 创建一个节点 #app
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  // rem 和页面样式修改
  window.onload = function() {
    document.documentElement.style.fontSize = wx.getSystemInfoSync().screenWidth / 16 + 'px'
    document.documentElement.style.backgroundColor = '#EEE'
  }
  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error)
  };
  window.addEventListener('error', evt => console.log('window.addEventListener(\'error\') =>', evt))


  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
