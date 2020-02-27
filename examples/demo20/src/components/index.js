import MHeader from './src/MHeader'
import MFooter from './src/MFooter'
import MLink from './src/MLink'
export default {
  install (Vue) {
    Vue.component(MHeader.name, MHeader)
    Vue.component(MFooter.name, MFooter)
    Vue.component(MLink.name, MLink)
  }
}
