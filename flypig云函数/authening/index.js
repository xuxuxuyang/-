// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'yuncloud-k0dms'
}
)
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await db.collection("Authentication").where({
    _openid: wxContext.OPENID
  }).get()
  console.log(result)
  if (result.data.length > 0) {
    return await db.collection("Authentication").doc(result.data[0]._id).update({
      data: {
        userDetail: event.userDetail,
        examine: event.examine
      }
    })
  }
}