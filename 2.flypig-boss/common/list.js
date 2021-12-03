// 上传图片
var uploadimage = function(many){
	return new Promise((resolve,reject)=>{
		uni.chooseImage({
			count: many, //默认9
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: (res) => {
				resolve(res.tempFilePaths)
			},
			fail: (err) => {
				reject('上传错误')
			}
		})	
	})
}

// 公用登录
var login = function(user){
	return new Promise((resolve,reject)=>{
			console.log(user)
			var db = wx.cloud.database()
			var users = db.collection('Authentication')
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

export {uploadimage,login}