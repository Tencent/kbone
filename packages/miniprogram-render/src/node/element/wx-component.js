const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class WxComponent extends Element {
  /**
   * 创建实例
   */
  static $$create(options, tree) {
    const config = cache.getConfig()

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      const instance = pool.get()

      if (instance) {
        instance.$$init(options, tree)
        return instance
      }
    }

    return new WxComponent(options, tree)
  }

  /**
   * 覆写父类的 $$init 方法
   */
  $$init(options, tree) {
    super.$$init(options, tree)
  }

  /**
   * 覆写父类的 $$destroy 方法
   */
  $$destroy() {
    super.$$destroy()
  }

  /**
   * 覆写父类的回收实例方法
   */
  $$recycle() {
    this.$$destroy()

    const config = cache.getConfig()

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      pool.add(this)
    }
  }

  get $$behavior() {
    return this.getAttribute('behavior') || ''
  }

  get $$content() {
    return this.textContent
  }

  /**
   * 对外属性和方法
   */

  // button、picker
  get disabled() {
    return !!this.$_attrs.get('disabled')
  }

  set disabled(value) {
    value = !!value
    this.$_attrs.set('disabled', value)
  }

  // button
  get openType() {
    return this.getAttribute('open-type') || ''
  }

  set openType(value) {
    value = '' + value
    this.$_attrs.set('open-type', value)
  }

  // picker
  get mode() {
    return this.$_attrs.get('mode') || 'selector'
  }

  set mode(value) {
    value = '' + value
    this.$_attrs.set('mode', value)
  }

  get range() {
    return this.$_attrs.get('range')
  }

  set range(value) {
    this.$_attrs.set('range', value)
  }

  get rangeKey() {
    return this.$_attrs.get('range-key') || ''
  }

  set rangeKey(value) {
    value = '' + value
    this.$_attrs.set('range-key', value)
  }

  get value() {
    return this.$_attrs.get('value')
  }

  set value(value) {
    this.$_attrs.set('value', value)
  }

  get start() {
    return this.$_attrs.get('start') || ''
  }

  set start(value) {
    value = '' + value
    this.$_attrs.set('start', value)
  }

  get end() {
    return this.$_attrs.get('end') || ''
  }

  set end(value) {
    value = '' + value
    this.$_attrs.set('end', value)
  }

  get fields() {
    return this.$_attrs.get('fields') || 'day'
  }

  set fields(value) {
    value = '' + value
    this.$_attrs.set('fields', value)
  }

  get customItem() {
    return this.$_attrs.get('custom-item') || ''
  }

  set customItem(value) {
    value = '' + value
    this.$_attrs.set('custom-item', value)
  }
}

module.exports = WxComponent
