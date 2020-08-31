/**
 * web 端入口文件
 */
import Vue from 'vue'
import App from './App.vue'

// rem 和页面样式修改
window.onload = function() {
  document.documentElement.style.fontSize = document.documentElement.getBoundingClientRect().width / 16 + 'px'
  document.documentElement.style.backgroundColor = '#EEE'
}
window.onerror = (message, source, lineno, colno, error) => {
  console.log('window.onerror => ', message, source, lineno, colno, error)
};
window.addEventListener('error', evt => console.log('window.addEventListener(\'error\') =>', evt))

new Vue({
  el: '#app',
  render: h => h(App)
})
