// 引入定位js
var QQMapWX = require('../common/qqmap-wx-jssdk.min.js');
var qqmapsdk;


// 封装公用预览图片
var preview = function(index,imglist){
	return new Promise((resolve,reject)=>{
		uni.previewImage({
			current:index,
			urls: imglist,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏']
			}
		})
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
};


// 公用定位
var addressdata = function(){
	return new Promise((resolve,reject)=>{
		// 实例化API核心类
		qqmapsdk = new QQMapWX({
			key: 'RIKBZ-CCMLS-6KEOA-6EVQ4-5U3BV-VNFA5'
		});
		// 调用接口
		qqmapsdk.reverseGeocoder({
			success: (res)=> {
				resolve(res)
			},
			fail: (err)=> {
				reject(err)
			},
		})
	})
}


// 公用登录
var login = function(user){
	return new Promise((resolve,reject)=>{
			console.log(user)
			var db = wx.cloud.database()
			var users = db.collection('user')
			users.add({
			      data: user
			    })
			    .then((res)=>{
			      resolve(res)
			    })
			    .catch((Error)=>{
			      reject(Error)
			    })
	})
}

export {preview,addressdata,login}
