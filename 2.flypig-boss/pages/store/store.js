import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 是否登录成功
const logindata = {
	login:''
}

const state = {
	logindata
}

export default new Vuex.Store({
	state,
	mutations:{
	// 描点链接
		lognmuta(state,logion){
			console.log(logion)
			state.logindata = {
				login:logion
			}
		},
	}
})