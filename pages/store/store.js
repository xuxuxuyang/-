import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 存储描点链接的值
const navindex = {
	index:''
}
// 攻略页面选择城市的值
const city = {
	citying : ''
}
// 发帖页面选择城市的值
const travecity = {
	traveing:''
}
// tab点击切换的值
const list = {
	listing:[]
}
// tab切换的loading加载值
const load = {
	loading:''
}
// 传nav值到index页面执行上拉加载
const navmin = {
	loading:'',
	pageid:0,
	naving:'推荐',
	uniload:'',
	nonedata:'',
	stateload:''
}
const nonemin = {
	nonedata:''
}
 // 传值给攻略页面，发表成功刷新页面
const roturn = {
	pagesid:false
}
const state = {
	navindex,
	city,
	travecity,
	list,
	load,
	navmin,
	nonemin,
	roturn
}
export default new Vuex.Store({
	state,
	actions:{
		// 描点链接
		navdata(navact,index){
			navact.commit('indexmuta',index)
		},
	},
	mutations:{
		// 描点链接
		indexmuta(state,index){
			state.navindex = {
				index:index
			}
		},
		// 攻略页面选择城市的值
		citymuta(state,cityion){
			state.city = {
				citying:cityion
			}
		},
		// 发帖页面选择城市的值
		travemuta(state,traveion){
			state.travecity = {
				traveing:traveion
			}
		},
		// tab点击切换的值
		listmuta(state,listion){
			state.list = {
				listing:listion
			}
		},
		// tab切换的loading值
		loadmuta(state,loadion){
			state.load = {
				loading:loadion
			}
		},
		// 传nav值到index页面执行上拉加载
		navmuta(state,pullobj){
			state.navmin = {
				loading:pullobj.loading,
				pageid:pullobj.pageid,
				naving:pullobj.nav,
				uniload:pullobj.uniload,
				nonedata:pullobj.nonedata,
				stateload:pullobj.stateload
			}
		},
		// 首页tab切换如果没有数据给予提示
		nonemuta(state,noneion){
			state.nonemin = {
				nonedata:noneion
			}
		},
		// 传值给攻略页面，发表成功刷新页面
		roturnmuta(state,pagesid){
			state.roturn = {
				pagesid:pagesid
			}
		}
	}
})