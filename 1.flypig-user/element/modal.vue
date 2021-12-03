<template>
	<view>
	<view class="warp" v-show="modaishow">
		<view class="warp-view">
			<view class="warp-text">请登陆后再操作</view>
			<view class="warp-flex">
				<button @click="messcancel()" plain="true">取消</button>
				<button plain="true" open-type="getUserInfo" @click="getUserInfo()">去登录</button>
			</view>
		</view>
	</view>
	<!-- 提示组件 -->
	<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入公用登录js
	import {login} from '../common/list.js'
	export default{
		name:'modal',
		components:{
			HMmessages
		},
		data() {
			return {
				modaishow: false
			}
		},
		methods:{
			init(){
			    this.modaishow = true
				return '登录'
			},
			messcancel(){
				this.modaishow = false
				return '取消'
			},
			// 发起登录
			getUserInfo(){
				this.modaishow = false
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
				  	this.HMmessages.show('登陆成功',{icon:'success',iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
				  })
				  .catch((err)=>{
				  	console.log(err)
				  })
			  }
		}
	}
</script>

<style scoped>
	/* 模态弹窗布局 */
	.warp{position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
	z-index: 9999;}
	.warp-view{width: 500upx;
			height: 200upx;
			background: #FFFFFF;
			margin: auto;
			position: absolute;
			-webkit-position:absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			border-radius: 8upx;
			overflow: hidden;
			}
	.warp-text{text-align: center;
			margin-top: 30upx;
			font-size: 34upx;
			color: #666666;}		
	.warp-flex{ display: flex;
		justify-content: space-around;
		border-top: 1upx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80upx;
		line-height: 80upx;
		-webkit-transform: translateZ(0);}
	.warp-flex button{border: none;
	font-size: 30upx;}						
</style>
