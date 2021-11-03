const db = wx.cloud.database()

// 并发请求轮播，tab数据
var home = function(banner){
	return new Promise((resolve,reject)=>{
		const banners = db.collection(banner)
		banners.get()
		.then((res)=>{
			// console.log(res)
			resolve(res)
		})
		.catch((err)=>{
			// console.log(err)
			reject(err)
		})
	})
	
}

// 请求第一个tab的列表数据
var homelist = function(listing,typedatas,pageid){
	return new Promise((resolve,reject)=>{
		const listdata = db.collection(listing)
		listdata.where({
			wholedata:{
				typedata:typedatas
			}
			
		})
		.limit(6)
		.skip(pageid * 6)//25kaishi
		.get()
		.then((res)=>{
			// console.log(res)
			resolve(res)
		})
		.catch((err)=>{
			// console.log(err)
			reject(err)
		})
	})
	
}



export{ home,homelist }