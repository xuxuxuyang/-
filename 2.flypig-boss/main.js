import Vue from 'vue'
import App from './App'

// 引入tab切换loading组件
import login from './element/logins.vue'
Vue.component('login-list',login)

//引入vuex文件
import store from './pages/store/store.js'
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
