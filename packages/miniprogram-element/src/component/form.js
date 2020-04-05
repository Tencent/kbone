/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/form.html
 *
 * 可以认为下述 form 组件的属性和事件是没有用的，因为 button 组件会被封装到自定义组件内
 */
module.exports = {
    properties: [{
        name: 'reportSubmit',
        get(domNode) {
            return !!domNode.getAttribute('report-submit')
        },
    }, {
        name: 'reportSubmitTimeout',
        get(domNode) {
            return +domNode.getAttribute('report-submit-timeout') || 0
        },
    }],
    handles: {
        onFormSubmit(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode._formId = evt.detail.formId
            // submit 事件由 kbone 模拟，不需要原生 submit 事件
        },

        onFormReset() {
            // reset 事件由 kbone 模拟，不需要原生 reset 事件
        },
    },
}
