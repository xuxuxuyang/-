// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'donghualigongdaxue-7drb78b870209'
})

const {
  WXPay,
  WXPayUtil,
  WXPayConstants
} = require('wx-js-utils');
const ip = require('ip');
// 这里看微信支付文档，填写你自己的商户配置{小程序appId，商户号：mchId，商户k：key}
const appId = 'wxd6bf110575444ac9'
const mchId = '1604007351'
const key = 'xuyang1203xuyang1203xuyang1203xu'
const timeout = 10000 // 毫秒
const sign_type = WXPayConstants.SIGN_TYPE_MD5

let wxpay = new WXPay({
  appId,
  mchId,
  key,
  timeout,
  signType: sign_type,  // 使用 HMAC-SHA256 签名，小程序默认WXPayConstants.SIGN_TYPE_MD
  useSandbox: false   // 不使用沙箱环境
});

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  // appid: wxContext.APPID,
  const db = cloud.database()
  const orderCollection = db.collection('Order')
  // 判断前端传来的值是否是统一下单
  if (event.type == 'placeOrder') {
    // 统一下单
    // 拼凑微信支付统一下单的参数
    const curTime = Date.now()
    // 商品id拼接
    const out_trade_no = event.goodId + '-' + curTime
    // 商品描述
    const body = event.commodity
    // 商品价格
    // 存到数据库的价格为前端传来的价格，
    const total_fee = event.Price
    // 传给微信服务器的价格需要做如下处理
    const pricedata = event.Price * 100
    const pricemony = parseFloat((pricedata).toFixed(10))
    // 用户的详细订单
    const Paymentinfor = event.Paymentinfor
    const time_stamp = '' + Math.ceil(Date.now() / 1000);
    var reqObj = {
      body: body,
      out_trade_no: out_trade_no,
      total_fee: pricemony,
      spbill_create_ip: ip.address() || '127.0.0.1',
      notify_url: 'http://www.qq.com/',
      trade_type: 'JSAPI',
      openid: openid,
      timeStamp: time_stamp
    };

    // 第一步：统一下单
    let paydata = await promiseA()
    console.log(paydata)
    let nonceStr = paydata.nonce_str
    let prepayId = paydata.prepay_id
    // 第二步：再次签名，小程序调起支付API
    let payauto = await promiseB(nonceStr, prepayId)
    console.log(payauto)
    // 第三步：存储订单到数据库
    let orderdata = await promiseC(nonceStr, prepayId, payauto)
    return {
      orderdata
    }

    // 统一下单
    function promiseA() {
      return new Promise((resolve, reject) => {
        wxpay.unifiedOrder(reqObj)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }

    // 第二步：再次签名，小程序调起支付API
    function promiseB(nonceStr, prepayId) {
      return new Promise((resolve, reject) => {
        const sign = WXPayUtil.generateSignature({
          appId: appId,
          nonceStr: nonceStr,
          package: `prepay_id=${prepayId}`,
          signType: 'MD5',
          timeStamp: time_stamp // 时间戳
        }, key);
        resolve(sign)
        reject(sign)
      })
    }


    // 第三步：存储订单到数据库
    function promiseC(nonceStr, prepayId, payauto) {
      return new Promise((resolve, reject) => {
        // 作为对象存储到数据库
        let orderData = {
          out_trade_no,
          time_stamp,
          nonceStr,
          payauto,
          sign_type,
          // 用户的详细订单数据
          Paymentinfor,
          body,
          total_fee,
          prepayId,
          status: 0, // 订单文档的status 0 未支付 1 已支付 2 已关闭
          _openid: openid,
        }

        orderCollection.add({
          data: orderData
        })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })

      })
    }
  } else if (event.type == 'queryorder') {
    // 查询订单
    const result = await orderCollection.where({
      _openid: openid,
      _id: event.Placeorder
    }).get()
    console.log(result)
    return { result }
  } else if (event.type == 'paysucc') {
    // 查询是否支付成功
    // 到微信支付侧查询是否存在该订单，并查询订单状态，看看是否已经支付成功了。
    const out_trade_no = event.out_trade_no
    const return_code = await wxpay.orderQuery({
      out_trade_no
    })
    console.log(return_code)
    // 支付成功
    if (return_code.trade_state === 'SUCCESS') {
      const result = await orderCollection.where({
        _openid: openid,
        _id: event.Placeorder
      }).get()
      console.log(result)
      const mindata = await orderCollection.doc(result.data[0]._id).update({
        data: {
          status: 1,
        }
      })
      console.log(mindata)
      const tips = '支付成功'
      return { tips }
    } else {
      console.log('取消支付')
      const tips = '支付取消'
      return { tips }
    }
  } else if (event.type == 'myorder') {
    // 查询已经支付的订单，拉取下来
    const result = await orderCollection.where({
      _openid: openid,
      status: 1
    }).get()
    console.log(result)
    return { result }
  }


}