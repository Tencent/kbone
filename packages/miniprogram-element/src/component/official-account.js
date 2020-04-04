/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
 */
module.exports = {
    properties: [],
    handles: {
        onOfficialAccountLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onOfficialAccountError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}
