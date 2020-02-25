const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)

  const { OPENID } = cloud.getWXContext()

  const result = await cloud.openapi.customerServiceMessage.send({
    touser: OPENID,
    msgtype: 'text',
    text: {
      content: '收到：' + event.Content,
    }
  })

  console.log(result)

  return result
}
