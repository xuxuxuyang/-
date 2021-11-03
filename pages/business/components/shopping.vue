<template>
	<view>
	<view class="shopping">
		<view class="shop-view">
			<view>
				<image src="../../../static/tab/dianpu.svg" mode="widthFix"></image>
				<text>店铺</text>
			</view>
			<view>
				<image src="../../../static/tab/kefu.svg" mode="widthFix"></image>
				<text>客服</text>
			</view>
			<view @click="shopUrl()">
				<image src="../../../static/tab/gouwuchetubiao.svg" mode="widthFix"></image>
				<text>购物车</text>
			</view> 
			<view class="shopdata">
				<view @click="ShoppingCart()">加入购物车</view>
				<view @click="purChase()">立即购买</view>
			</view>
		</view>
	</view>
	<!-- 提示组件 -->
	<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	
	<!-- 引入登录模态框 -->
	<motal ref="mon"></motal>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入模态组件
	import motal from '../../../element/modal.vue'
	// 登录引入数据库
	var db = wx.cloud.database()
	var users = db.collection('user')
	export default{
		components:{
			HMmessages,
			motal
		},
		props:{
			detaildata:{}
		},
		data() {
			return {
				Whether:false,  //隐藏发表按钮
				Shoppdata:{}
			}
		},
		methods:{
			// 加入购物车，需要登录
			ShoppingCart(){
				let shopping = 'shopping'
				this.userlogin(shopping)
			},
			// 立即购买，需要登录
			purChase(){
				let puring = 'puring'
				this.userlogin(puring)
			},
			// 登录数据库
			userlogin(listing){
				users.get()
				.then((res)=>{
				  if(res.data.length == 0){// length == 0说明没有用户信息，没有登录，提示登录
					  this.$nextTick(()=>{
					  	this.$refs.mon.init()
					  })
				  }else{
					let ids = {
						Shoppdata:this.Shoppdata,// 跳转到商品确认页面带上用户选择购物车还是直接购买以及api数据
						listing
					}
					let objids = JSON.stringify(ids)
					uni.navigateTo({
						url:'../cart/cart?ids=' + objids
					})
				  }
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 去到购物车页面
			shopUrl(){
				uni.navigateTo({
					url:'../MyCart/mycart'
				})
			}	
		},
		watch:{
			detaildata(newValue, oldValue){
				this.Shoppdata = newValue
			}	
		}
		
	}
</script>

<style scoped>
	.shopping{width: 100%; background: #ffffff;
	border-top: 1rpx solid #f8f8f8;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	}
	.shopping image{width: 40upx !important; height: 40upx !important;}
	.shopping text{display: block; color: #6d6d6d; font-size: 20upx;
	}
	.shopdata view:nth-child(1){background: linear-gradient(to right, #ffc800 10%, #ff9602 80%);
	border-top-left-radius: 50upx;
	border-bottom-left-radius: 50upx;}
	.shopdata view:nth-child(2){background: linear-gradient(to right, #ff7500 10%, #ff4b00 80%);
	border-top-right-radius: 50upx;
	border-bottom-right-radius: 50upx;}
	.shopdata{color: #ffffff; font-size: 25upx;  display: flex;
	justify-content: space-between;}
	.shopdata view{height: 80upx; line-height: 80upx; width: 200upx;
	}
	.shop-view{display: flex; justify-content: space-between; align-items: center;
	text-align: center;
	padding: 10upx 20upx;}
</style>
