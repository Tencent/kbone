import Base from '../components/base'

export default class WeuiBase extends Base {
    static get observedAttributes() {
        return ['ext-class', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get extClass() {
        return this.getAttribute('ext-class') || ''
    }
}
