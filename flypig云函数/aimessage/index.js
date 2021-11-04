// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'donghualigongdaxue-7drb78b870209'
})
var AipNlpClient = require("baidu-aip-sdk").nlp;

// 设置APPID/AK/SK
var APP_ID = "22954673";
var API_KEY = "kwsmyuqoO75YG3CM4QwarH4E";
var SECRET_KEY = "dQmwDGpejIF19Tnlnwc4l4hPSaB3P8in";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

// 云函数入口函数
exports.main = async (event, context) => {
  // 如果有可选参数
  var options = {};
  options["type"] = "5";

  let aimessage = await aiMessage()

  return{
    aimessage
  }

  function aiMessage() {
    return new Promise((resolve, reject) => {
      // 带参数调用评论观点抽取
      client.commentTag(event.message, options)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          // 如果发生网络错误
          reject(err)
        });
    })
  }


}