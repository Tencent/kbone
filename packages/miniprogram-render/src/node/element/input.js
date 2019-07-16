const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()
const DEFAULT_MAX_LENGTH = '140'

class HTMLInputElement extends Element {
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

    return new HTMLInputElement(options, tree)
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

  /**
   * 调用 $_generateHtml 接口时用于处理额外的属性，
   */
  $$dealWithAttrsForGenerateHtml(html, node) {
    const type = node.type
    if (type) html += ` type="${type}"`

    const value = node.value
    if (value) html += ` type="${value}"`

    const disabled = node.disabled
    if (disabled) html += ' disabled'

    const maxlength = node.maxlength
    if (maxlength) html += ` maxlength="${maxlength}"`

    const placeholder = node.placeholder
    if (placeholder) html += ` placeholder="${placeholder.replace(/"/g, '\\"')}"`

    return html
  }

  /**
   * 调用 outerHTML 的 setter 时用于处理额外的属性
   */
  $$dealWithAttrsForOuterHTML(node) {
    this.type = node.type || ''
    this.value = node.value || ''
    this.disabled = node.disabled || ''
    this.maxlength = node.maxlength || DEFAULT_MAX_LENGTH
    this.placeholder = node.placeholder || ''

    // 特殊字段
    this.mpplaceholderclass = node.mpplaceholderclass || ''
  }

  /**
   * 调用 cloneNode 接口时用于处理额外的属性
   */
  $$dealWithAttrsForCloneNode() {
    return {
      type: this.type,
      value: this.value,
      disabled: this.disabled,
      maxlength: this.maxlength,
      placeholder: this.placeholder,

      // 特殊字段
      mpplaceholderclass: this.mpplaceholderclass,
    }
  }

  get $$focus() {
    return this.$_attrs.get('$$focus')
  }

  /**
   * 特殊对外字段，用于小程序内置组件的特有属性
   */
  get placeholderClass() {
    return this.$_attrs.get('placeholder-class')
  }

  set placeholderClass(value) {
    value = '' + value
    this.$_attrs.set('placeholder-class', value)
  }

  get cursorSpacing() {
    return this.$_attrs.get('cursor-spacing')
  }

  set cursorSpacing(value) {
    value = '' + value
    this.$_attrs.set('cursor-spacing', value)
  }

  /**
   * 对外属性和方法
   */
  get type() {
    return this.$_attrs.get('type')
  }

  set type(value) {
    value = '' + value
    this.$_attrs.set('type', value)
  }

  get value() {
    return this.$_attrs.get('value')
  }

  set value(value) {
    value = '' + value
    this.$_attrs.set('value', value)
  }

  get disabled() {
    return !!this.$_attrs.get('disabled')
  }

  set disabled(value) {
    value = !!value
    this.$_attrs.set('disabled', value)
  }

  get maxlength() {
    return this.$_attrs.get('maxlength') || DEFAULT_MAX_LENGTH
  }

  set maxlength(value) {
    value = '' + value
    this.$_attrs.set('maxlength', value)
  }

  get placeholder() {
    return this.$_attrs.get('placeholder')
  }

  set placeholder(value) {
    value = '' + value
    this.$_attrs.set('placeholder', value)
  }

  focus() {
    this.$_attrs.set('$$focus', true)
  }
}

module.exports = HTMLInputElement
