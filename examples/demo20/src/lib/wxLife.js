import { onUnmounted } from 'vue'

export const onWxLoad = (callback) => {
  window.addEventListener('wxload', callback)
  onUnmounted(() => {
    window.removeEventListener('wxload', callback)
  })
}

export const onWxShow = (callback) => {
  window.addEventListener('wxshow', callback)
  onUnmounted(() => {
    window.removeEventListener('wxshow', callback)
  })
}

export const onWxReady = (callback) => {
  window.addEventListener('wxready', callback)
  onUnmounted(() => {
    window.removeEventListener('wxready', callback)
  })
}

export const onWxHide = (callback) => {
  window.addEventListener('wxhide', callback)
  onUnmounted(() => {
    window.removeEventListener('wxhide', callback)
  })
}

export const onWxUnload = (callback) => {
  window.addEventListener('wxunload', callback)
  onUnmounted(() => {
    window.removeEventListener('wxunload', callback)
  })
}
