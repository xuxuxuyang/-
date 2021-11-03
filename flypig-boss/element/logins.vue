<template>
	<view class="wx-button">
		<view class="wx-button-view">
			<image src="../static/img/tou.png" mode="widthFix"></image>
		</view>
		<view><button plain="true" open-type="getUserInfo" @click="getUserInfo()">登录商家版</button></view>
	</view>
</template>

<script>
	import {login} from '../common/list.js'
	export default{
		data() {
			return {
				
			}
		},
		
		methods:{
			// 发起登录
			getUserInfo(){
				//新的登录接口：wx.getUserProfile
				wx.getUserProfile({
					desc: '登录'
				})
				.then(res=>{
					this.wxusEr(res.userInfo)
				})
				.catch(err=>{
					console.log('拒绝登录或登录失败')
				})
			},
			
			// 调用登录
			wxusEr(user){
				login(user)
				.then((res)=>{
					console.log(res)
					// 传值到vuex,这是传给发帖页面的
					let logion = 'success'
					this.$store.commit('lognmuta', logion)
					
				})
				.catch((err)=>{
					console.log(err)
				})
			}
			
		},
		
		
	}
</script>

<style scoped>
/* 登录 */
.wx-button button {
	border: none;
	font-size: 30upx;
	background: linear-gradient(to right, #ffe566 10%, #ffd300 80%);
	border-radius: 50upx;
	color: #ffffff;
	width: 400upx;
}
.wx-button-view image{
	width: 180upx;
	height: 180upx;
}
.wx-button-view{
	text-align: center;
}
.wx-button {
	margin: 0 auto;
	padding-top: 300upx;
}
</style>
