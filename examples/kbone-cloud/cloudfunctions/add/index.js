/**
 * 云函数 add
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event.title, event.desc)
    return await db.collection('test').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: event.title,
        desc: event.desc
      }
    })
  } catch(e) {
    console.error(e)
  }
}