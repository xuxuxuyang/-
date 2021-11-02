<template>
		<view class="order-view">
			<!-- 提示 -->
			<view class="order-conter">
				<!-- 遍历 -->
				<block v-for="(item,index) in orderdata" :key="index">
				<view class="order-data">
					<view class="order-title">
						<image :src="item.logoimg" mode="widthFix"></image>
						<text>{{item.enterprise}}</text>
					</view>
					<view class="order-text">
					{{item.title}}
					</view>
					<view class="detailed">
						<text>出游人</text>
						<text>刘佳美</text>
					</view>
					<view class="detailed">
						<text>购买数量</text>
						<text>{{item.many}}</text>
					</view>
					<view class="detailed">
						<text>出发地</text>
						<text>{{item.departure}}</text>
					</view>
					<view class="detailed">
						<text>出行日期</text>
						<text>{{item.datetime}}</text>
					</view>
				</view>
				</block>
			</view>
			<!-- 联系人 -->
			<view class="Contacts">
				<view class="order-pople">出行人</view>
				<view class="cart-go">
					<text>姓名</text>
					<input type="text" placeholder="请输入姓名" placeholder-class="place" v-model="name"/>
				</view>
				<view class="cart-go">
					<text>手机号</text>
					<input type="number" placeholder="请输入手机号" placeholder-class="place" v-model="phone"/>
				</view>
				<view class="cart-go">
					<text>身份证</text>
					<input type="number" placeholder="请输入身份证号码" placeholder-class="place" v-model="carded"/>
				</view>
			</view>
			<!-- 高度撑开 -->
			<view style="height: 200upx;"></view>
			<!-- 去付款 -->
			<view class="shopping">
				<view class="shop-view">
					<view>￥{{obtainprice}}</view>
					<view class="shopdata" @click="btnShopping(btndata)">
						去付款
					</view>
				</view>
			</view>
			<!-- 提示组件 -->
			<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
			<!-- 进入页面的loading -->
			<home-load v-if="homeload"></home-load>
		</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引进错误提示
	import {erring} from '../../common/erring.js'
	// 引入数据库
	var db = wx.cloud.database()
	var shopdatabase = db.collection('Shopping')
	var orderCollection = db.collection('Order')
	// 引入微信支付云函数请求
	import {wxpay} from '../../common/wxpay.js'
	export default{
		name:'orderdata',
		components:{
			HMmessages
		},
		data() {
			return {
				homeload:true,
				orderdata:[],
				obtainprice:'',
				name:'',
				phone:'',
				carded:'',
				// 微信支付相关
				Placeorder:''
			}
		},
		methods:{
			// 从购物车查询拉下选中的订单数据
			orDerdata(){
				shopdatabase.where({
					Selection:'show'
				})
				.get()
				.then((res)=>{
					this.orderdata = res.data
					this.homeload = false
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 去付款生成订单前解决必填项
			btnShopping(){
				erring(this.name,this.phone,this.carded)
				.then((res)=>{
					if(res == 'SUCCESS'){
						this.weChatorder()
					}else{
						let icon = 'danger'
						this.tips(res,icon)
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 开始下单
			async weChatorder(){
				// 提示下单，反馈
				wx.showToast({
					title:'正在下单',
					icon:'loading',
					mask:true,
				})
				// 出行人对象
				let peopleobj = {
					name:this.name,
					phone:this.phone,
					carded:this.carded
				}
				// 把付款的旅游信息和出行人生成已付款的订单[以对象形式存储]
				let Paymentinfor = {
					peopleobj,
					arrinfo:this.orderdata
				}
				let ids = this.orderdata[0].shopid 
				let ide = ids.slice(0,7)
				let commod = this.orderdata[0].title
				// 调用云函数统一下单
				let Placeorder = await this.placeOrder(ide,commod,Paymentinfor)
				// console.log(Placeorder)
				// // 获取订单信息
				let Orderinfo = await this.orderInfo(Placeorder)
				// // 调用接口发起支付
				let wxpay = await this.wxPay(Orderinfo,Placeorder)
				// // 查询时候支付成功
				let paysucc = await this.paySucc(Orderinfo,Placeorder)
			},
			// 统一下单生成订单
			placeOrder(ide,commod,Paymentinfor){
				return new Promise((resolve,reject)=>{
					let wxData = {
									type:'placeOrder',
						            goodId: ide,
									commodity:commod,
									Price:this.obtainprice,
									Paymentinfor:Paymentinfor
						        }
					wxpay(wxData)
					.then((res)=>{
						let ides = res.result.orderdata._id
						resolve(ides)
					})
					.catch((err)=>{
						console.log(err)
					})
				})
			},
			// 获取订单信息
			orderInfo(Placeorder){
				return new Promise((resolve,reject)=>{
					let wxData = {
									type:'queryorder',
						            Placeorder:Placeorder
						        }
					wxpay(wxData)
					.then((res)=>{			
						let objorder = res.result.result.data[0]
						resolve(objorder)
						// 取消下单提示
						wx.hideToast()
					})
					.catch((err)=>{
						console.log(err)
						// 给予提示
						let tip = '支付出现错误'
						let icon = 'danger'
						this.tips(tip,icon)
						// 取消下单提示
						wx.hideToast()
					})
				})
			},
			// 发起微信支付
			wxPay(Orderinfo,Placeorder){
				return new Promise((reslove,reject)=>{
					wx.requestPayment({
						timeStamp: Orderinfo.time_stamp,
						nonceStr: Orderinfo.nonceStr,
						package: `prepay_id=${Orderinfo.prepayId}`,
						signType: 'MD5',
						paySign: Orderinfo.payauto,
						success: (res) => {
							console.log(res)
							reslove(res)
						},
						fail: (err) => {
							console.log(err)
							// 给予提示
							let tip = '支付错误'
							let icon = 'success'
							this.tips(tip,icon)
							// 用户取消支付删掉数据库订单
							orderCollection.doc(Placeorder).remove()
							.then((res)=>{
								console.log(res)
							})
							.catch((err)=>{
								console.log(err)
							})
						}
					})
				})
			},
			// 查询是否支付成功
			paySucc(Orderinfo,Placeorder){
				return new Promise((reslove,reject)=>{
					let wxData = {
								type:'paysucc',
								Placeorder:Placeorder,
					            out_trade_no:Orderinfo.out_trade_no
								}
					wxpay(wxData)
					.then((res)=>{
						console.log(res.result.tips)
						reslove(res)
						if(res.result.tips == '支付成功'){
							// 给予提示
							let tip = '购买成功'
							let icon = 'success'
							this.tips(tip,icon)
							// 支付成功关闭当前页面跳转到订单页面
							uni.redirectTo({
								url: '../Myorder/myorder'
							});
						}
					})
					.catch((err)=>{
						console.log(err)
					})
				})
			},
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			},
		},
		onLoad(e) {
			// 取到总价和是从哪个页面跳转来的
			let ids = JSON.parse(e.ids)
			// 判断是购物车还是直接下单
			if(ids.page == 'Shopping'){
				// 购物车
				// 从购物车拉下选中的订单数据
				// 取到总价
				this.obtainprice = ids.obtainprice
				this.orDerdata()
			}else{
				this.obtainprice = ids.orderdata[0].totalPrice
				this.orderdata = ids.orderdata
				this.homeload = false
			}
		}
	}
</script>

<style>
	page{background: #f4f4f4;}
	.listmen{color: red;}
	.order-conter{
	margin: 15upx;
	background: #FFFFFF; border-radius: 10upx;
	font-size: 30upx;
	padding: 10upx;}
	/* 内容 */
	.order-title{display: flex; align-items: center;}
	.order-title image{width: 50upx; height: 50upx; border-radius: 6upx;}
	.order-title text{font-weight: bold; padding-left: 8upx;}
	.order-text{font-weight: bold; padding: 10upx 0;}
	.detailed{display: flex; height: 50upx;
	align-items: center;
	padding: 7upx 0;}
	.detailed text:nth-child(1){ width: 170upx;}
	.order-data{border-bottom: 1px dashed #e0e0e0;
	margin-bottom: 10upx;
	}
	/* 联系人 */
	.Contacts{margin: 20upx 15upx; background: #FFFFFF; border-radius: 10upx;
	font-size: 30upx;
	padding: 10upx;}
	.order-pople{font-weight: bold; padding: 20upx 0 30upx 0;}
	.cart-go{ display: flex;
	 align-items: center;
	 height: 80upx;
	 border-top: 1rpx solid #F8F8F8;}
	.cart-go text{width: 200upx; height: 50upx;
	line-height: 50upx;}
	.cart-go input{width: 100%;height: 50upx;
	line-height: 50upx;
	}
	.place{color: #d4d4d4;}
	/* 去付款 */
	.shopping{width: 100%; background: #ffffff;
	border-top: 1rpx solid #e5e5e5;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	}
	.shopdata{background: linear-gradient(to right, #ffc800 10%, #ff9602 80%);
	height: 80upx; line-height: 80upx; width: 300upx;
	color: #ffffff;
	border-radius: 50upx;
	font-weight: 100;
	}
	
	.shop-view{display: flex; justify-content: space-between; align-items: center;
	text-align: center;
	padding: 10upx 20upx;
	font-size: 30upx;
	color: #ff5000;
	font-weight: bold;}
	</style>
