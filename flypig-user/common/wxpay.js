// 微信支付
var wxpay = function(wxData){
	return new Promise((resolve,reject)=>{
		wx.cloud.callFunction({
		    name: 'wxpay',
			data: wxData
		})
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
	
}

export{wxpay}