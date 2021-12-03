<template>
	<view>
		<login-list v-if="!wxlogin"></login-list>
		<users v-if="wxlogin" :username="username" :nothave="nothave"></users>
	</view>
</template>

<script>
	import Users from './components/users.vue'
	import {mapState} from 'vuex'
	var db = wx.cloud.database()
	var users = db.collection('Authentication')
	export default{
		components:{
			Users
		},
		data() {
			return {
				wxlogin:true,
				sussdata:'',
				username:{},
				nothave:"未认证",
			}
		},
		methods:{
			// 用户是否登录
			ifUser(){
				users.get()
				.then((res)=>{
					if(res.data.length == 0){ // length == 0说明没有用户信息，没有登录，发起登录
						this.wxlogin = false
					}else{
						this.wxlogin = true
						var username = res.data[0]
						//已认证
						if(username.examine && username.examine == 'success'){
							let Detail = username.userDetail
							let Detailobject = {
								nickName:Detail.enterprise,
								avatarUrl:Detail.logoimg
							}
							this.username = Detailobject
							this.nothave = '已认证'
						}else{
							this.username = username
							this.nothave = '未认证'
						}
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			}
		},
		//进入查询登录信息
		onShow() {
			this.ifUser()
		},
		computed:{
			...mapState(['logindata']),
			cont(){
				this.sussdata = this.logindata.login
			}
		},
		watch:{
			sussdata(newValue, oldValue){
				if(newValue == 'success'){
					this.ifUser()
				}
			}
		}
	}
</script>

<style> 
</style>
