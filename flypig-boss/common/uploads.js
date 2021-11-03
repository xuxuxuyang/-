let uploads = function(imgdata,resou){
	var imgfileID = []
	return new Promise((resolve,reject)=>{
		imgdata.forEach((img)=>{
			const imgion = img.lastIndexOf('.');
			const eximg = img.slice(imgion);
			const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${eximg}`;
			wx.cloud.uploadFile({
				cloudPath: resou + '/' + cloudPath, // 上传至云端的路径
				filePath: img // 要上传的文件
			})
			.then((res)=>{
				imgfileID.push(res.fileID)
				if(imgdata.length == imgfileID.length){
					resolve(imgfileID)
				}
				
			})
			.catch((err)=>{
				reject('上传错误')
			})
		})
	})
}

export{uploads}