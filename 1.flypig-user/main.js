import Vue from 'vue'
import App from './App'

// 引入css3动画
import animate from 'animate.css'
Vue.use(animate)

// 引入tab切换loading组件
import loader from './element/loading.vue'
Vue.component('loader-list',loader)

// 引入单页面loading组件
import homeload from './element/homeload.vue'
Vue.component('home-load',homeload)

// 引入没有数据提示的组件
import nonedata from './element/none.vue'
Vue.component('none-data',nonedata)

// 引入购物车loading组件
import samllload from './element/smallload.vue'
Vue.component('samll-load',samllload)


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
