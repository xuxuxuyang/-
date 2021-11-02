<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
			<view class="wx-name" v-if="wxlogin">
				<view>
					<image :src="username.avatarUrl"></image>	
				</view>
				<view class="wx-text">
					<text>{{username.nickName}}</text>
				</view>
			</view>
			<!-- 未登录 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="wx-button-view">登录飞猪旅游，开启旅程</view>
				<view>
					<button plain="true" open-type="getUserInfo" @click="getUserInfo()">去登录</button>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="user-list" v-if="wxlogin">
			<block v-for="(item,index) in busindata" :key="index">
			<view @click="auTH(item.url)">
				<image :src="item.image" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {login} from '../../common/list.js'
	var db = wx.cloud.database()
	var users = db.collection('user')
	export default{
		name:'my',
		data() {
			return {
				wxlogin: true,
				username:{},
				busindata:[
					{
						"image":"../../static/mys/gouwuche.svg",
						"name":"购物车",
						"url":"../MyCart/mycart"
					},
					{
						"image":"../../static/mys/dingdan.svg",
						"name":"我的订单",
						"url":"../Myorder/myorder"
					},
				]
			}
		},
		methods:{
			// 发起登录
			getUserInfo(){
				wx.getUserProfile({
					desc: '登录'
				})
				.then(res=>{
					this.wxLogin(res.userInfo)
				})
				.catch(err=>{
					console.log('拒绝登录或登录失败')
				})
			},
			// 调用登录
			wxLogin(user){
				login(user)
				.then((res)=>{
					this.ifUser()
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 用户是否登录
			ifUser(){
				users.get()
				.then((res)=>{
					// length == 0说明没有用户信息，没有登录，发起登录
					if(res.data.length == 0){
						this.wxlogin = false
					}else{
						this.wxlogin = true
						this.username = res.data[0]
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 跳转
			auTH(url){
				uni.navigateTo({
					url: url,
				});
			}
		},
		onShow() {
			// 请求用户信息数据库看看有没有存在用户信息
			this.ifUser()
		},
		onShareAppMessage(res) {
		    return {
		      title: '飞猪旅游',
		      path: '/pages/index/index'
		    }
		},
	}
</script>

<style scoped>
	.myhome{background: linear-gradient(to top, #ffe566 10%, #ffd300 100%); height: 350upx; display: flex; align-items: center;}
	.wx-name image{width: 120upx !important; height: 120upx !important; border-radius: 50%; margin-right: 20upx;
					border: 10rpx solid #999999;}
	text{display: block; margin: 10upx 0; color: #999999;}
	.wx-name{display: flex; align-items: center; padding: 0 30upx; align-content: center;
			height: 200upx;}
	.wx-text text:nth-child(1){font-size: 35upx;}
	.wx-text text:nth-child(2){font-size: 20upx; border: 1px solid #FFFFFF;
								padding: 7upx;
								border-radius: 50upx;
								text-align: center;}
	/* 登录 */
	.wx-button button{border: none;font-size: 30upx; background: linear-gradient(to right, #28a6f1 10%, #0e8dd7 80%);
	 border-radius: 50upx;
	color: #FFFFFF;}							
	.wx-button-view{font-size: 35upx; color: #FFFFFF; margin-bottom: 25upx;}
	.wx-button{margin: 0 auto;}
	/* 列表 */
	.user-list{background: #F8F8F8; display: flex; justify-content: space-around; text-align: center;
	margin: 20upx; border-radius: 20upx;
	height: 200upx;
	align-items: center;}
	.user-list image{width: 50upx; height: 50upx;}
	.user-list text{font-size: 25upx; display: block; color: #777777;}
	/* 感谢 */
	.Thankyou{font-size: 20upx; text-align: center;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 30upx;}
</style>
