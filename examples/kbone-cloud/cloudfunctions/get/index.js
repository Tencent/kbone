/**
 * 云函数 get
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let  res = []
  res = await db.collection('test').get()
  console.log(res)
  return res.data
}