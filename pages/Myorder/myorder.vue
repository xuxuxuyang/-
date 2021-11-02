<template>
	<view>
		<block v-for="(item,index) in orderData" :key="index">
		<block v-for="(iteming,index) in item.orderdtata" :key="index" v-if="index == 0">
		<view class="myorder-view">
		<!-- 旅行社 -->
		<view class="Agency">
			<view class="Agency-img">
				<image :src="iteming.logoimg"></image>
				<text>{{iteming.enterprise}}</text>
			</view>
			<view class="Agency-text">
				已完成交易
			</view>
		</view>	
		
		<view class="content-view">
			<view class="content-img">
				<image :src="iteming.Coverimg" mode="aspectFill"></image>
			</view>
			<view class="content-title">
				<text>{{iteming.title}}</text>
				<text>出发日期:{{iteming.datetime}}</text>
				<text>出发地:{{iteming.departure}}</text>
			</view>
		</view> 
		<!-- 商品价格 -->
		<view class="Price-view">
			<text>共{{item.orderdtata.length}}件商品   合计:</text>
			<text>￥{{item.total}}</text>
		</view>
		</view>
		</block>
		</block>
		<!-- 没有数据的提示 -->
		<order ref="orderlisty"></order>
		<home-load v-if="homeload"></home-load>
	</view>
</template>

<script>
	// 引入微信支付云函数请求
	import {wxpay} from '../../common/wxpay.js'
	// 引入没有数据的提示
	import order from '../../element/order.vue'
	export default{
		name:'Myorder',
		components:{
			order
		},
		data() {
			return {
				homeload:true,
				orderData:[]
			}
		},
		methods:{
			myOrder(){
				let wxData = {type:'myorder'}
				wxpay(wxData)
				.then((res)=>{
					let myorderdata = res.result.result.data
					// 取消loading
					this.homeload = false
					if(myorderdata.length === 0){
						let value = true
						let orderdata = '订单空空如也！'
						this.nohint(value,orderdata)
					}else{
						// 取出要展示的数据
						var ordering = myorderdata.map((item)=>{
							let orderdtata = item.Paymentinfor.arrinfo
							let total = item.total_fee
							return {
								orderdtata,
								total
							}
						})
						this.orderData = ordering
					}
					
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 提示没有数据的
			nohint(value,orderdata){
				this.$nextTick(()=>{   //dom更新循环结束之后的延迟回调
					this.$refs.orderlisty.init(value,orderdata)
				})
			}
		},
		mounted() {
			this.myOrder()
		}
	}
</script>

<style scoped>
	.myorder-view{padding: 10upx; margin: 10upx; background: rgb(255, 255, 255);
	border-radius: 20upx;}
	/* 旅行社 */
	.Agency{height: 90upx; display: flex; justify-content: space-between;
	align-items: center;
	font-size: 30upx;
	}
	.Agency image{width: 40upx !important; height: 40upx !important; border-radius: 50%;}
	.Agency-img{display: flex; align-items: center;}
	.Agency-img text{padding-left: 10upx;}
	.Agency-text{color: red;}
	.Price-view{display: flex; justify-content: flex-end;
	 align-items: center;
	 font-size:28upx;
	height: 90upx;}
	
	.content-view{display: flex; justify-content: space-between;
	height: 200upx !important; overflow: hidden;
	padding:5upx;
	}
	.content-img{width: 300upx !important; height: 200upx !important;
	}
	.content-img image{width: 100%; height: 100%; border-radius: 6upx;}
	.content-title{
	width: 100%;
	padding-left: 10upx;
	}
	.content-title text:nth-child(1){
		font-size: 30upx;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-top: 0;
		color: #333333;
	}
	.content-title text{
		font-size: 28upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-top: 9upx;
		color: #a5a5a5;
	}
	
</style>
