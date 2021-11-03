// 错误提示
// 身份证正则
var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

let erring = function(name,phone,carded){
	return new Promise((resolve,reject)=>{
		// 请填写姓名
		if(name == ''){
			console.log('请填写姓名')
			// 给予提示
			let tip = '请填写姓名'
			resolve(tip)
			return false
		}
		// 手机号码
		if(!(/^1[3456789]\d{9}$/.test(phone))){
			console.log('手机号码不正确')
			// 给予提示
			let tip = '请填写正确的手机号'
			resolve(tip)
			return false
		}
		// 身份证
		if(!idcardReg.test(carded)) {
		    console.log('身份证不正确')
			// 给予提示
			let tip = '请填写正确的身份证号码'
			resolve(tip)
			return false
		}
		// 提示全部正确
		let tip = 'SUCCESS'
		resolve(tip)
	})
}

export{ erring }