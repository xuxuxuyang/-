<template>
	<view>
		<!-- 出发日期 -->
		<view class="cart-view">
			<view class="cart-date">出发日期</view>
			<view class="cart-flex">
				<view>当前日期</view>
				<view>
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{datetime}}</view>
					</picker>
				</view>
			</view>
		</view>
		<!-- 出发地 -->
		<view class="cart-view">
			<view class="cart-date">出发地</view>
			<view class="menu-block-data">
				<block v-for="(item,index) in commodity.setdata" :key="index">
					<view :class="{ activetextdata: index == num }" @click="menubtn(item,index)">{{item}}</view>
				</block>
			</view>
		</view>
		<!-- 购买数量 -->
		<view class="cart-view">
			<view class="cart-date">购买数量</view>
			<view class="mony-flex">
				<view>成人</view>
				<view>
					<view class="cart-mony">
						<text @click="reduce()">-</text>
						<text>{{many}}</text>
						<text @click="plus()">+</text>
					</view>
					<view>单价: ￥{{unitPrice}}</view>
				</view>
			</view>
		</view>	
		<!-- 加入购物车 -->
		<view class="shopping">
			<view class="shop-view">
				<view>￥{{totalPrice}}</view>
				<view class="shopdata" @click="btnShopping(btndata)">
					{{btndata}}
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
	// 引入数据库
	var db = wx.cloud.database()
	var shopdatabase = db.collection('Shopping')
	export default{
		components:{
			HMmessages
		},
		data() {
			return {
				num:-1,
				// 取到要提交的数据到数据库
				datetime: '2021-11-11',
				departure:'',  //出发地
				commodity:{},
				btndata:'',
				// 商品单价
				unitPrice:'',
				// 商品总价
				totalPrice:'',
				// 购买几个
				many:1,
			}
		},
		methods:{
			bindDateChange(e) {
				this.datetime = e.target.value
			},
			// 选择出发地
			menubtn(item,index){
				this.num = index
				this.departure = item
			},
			// 加价格
			plus(){
				// 计算总价,首先购买几件数量要变
				this.many++
				let numdata = this.unitPrice * this.many
				this.totalPrice = parseFloat((numdata).toFixed(10))
			},
			// 减价格
			reduce(){ 
				// 不能为零
				if(this.many === 1){ 
					// 给予提示
					let tip = '购买数量最少为1'
					let icon = 'danger'
					this.tips(tip,icon)
				}else{
					this.many--
					let numdata = this.unitPrice * this.many
					this.totalPrice = parseFloat((numdata).toFixed(10))
				}
			},
			// 公用提交数据【点击下点和购物车】
			pubilcData(){
				let obgcart = {
					shopid:this.commodity.shopid,
					title:this.commodity.title,
					describe:this.commodity.describe,
					destination:this.commodity.destination,
					Coverimg:this.commodity.Coverimg,
					price:Number(this.commodity.price),
					enterprise:this.commodity.enterprise,
					logoimg:this.commodity.logoimg,
					datetime:this.datetime,
					departure:this.departure,
					many:this.many,
					totalPrice:this.totalPrice,
					Selection:'hide'
			}
			return obgcart
			},
			// 提交按钮
			btnShopping(datas){
				// 要提交的是否为空
				if(this.departure == ''){
					// 给予提示
					let tip = '请选择出发地'
					let icon = 'danger'
					this.tips(tip,icon)
				}else{
					if(datas == '加入购物车'){
						// 加入云数据库
						this.carTdata()
					}else{
						let ids = {
							orderdata:[this.pubilcData()],
							page:'directorder'
						}
						let objids = JSON.stringify(ids)
						// 直接下单
						uni.navigateTo({
							url: '../order/order?ids=' + objids
						});
					}
				}
			},
			// 提交数据库加入购物车
			carTdata(){
				// 1.查询数据库如果为空直接添加进去
				// 2.数据库里有数据并且用户提交的数据和数据库数据相同，不添加
				// 3.用户修改了出发日期和出发地，再次提交数据到数据库
				// 4.用户只修改了购买数量，那么更新修改购买数量字段
				shopdatabase.where({
					shopid:this.commodity.shopid
				})
				.get()
				.then((res)=>{
					// 1.查询数据库如果为空直接添加进去
					if(res.data.length == 0){
						this.forMaldata()
						return
					}
					// 2.数据库里有数据并且用户提交的数据和数据库数据相同，不添加
					if(res.data.length != 0){
						// 查询数据库时候存在相同的数据，如果出现某一个相同则不提交，
						shopdatabase.where({
							shopid:this.commodity.shopid,
							datetime:this.datetime,
							departure: this.departure,
							many: this.many,
							totalPrice: this.totalPrice,
						})
						.get()
						.then((res)=>{
							// 出现相同数据不提交
							if(res.data.length != 0){
								// 给予提示
								let tip = '加入购物车成功'
								let icon = 'success'
								this.tips(tip,icon)
								return false
							}else{
								// 出发时间和出发地一致
								this.timeing()
							}
						})
						.catch((err)=>{
							console.log(err)
						})
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 出发时间和出发地一致
			timeing(){
				shopdatabase.where({
					shopid:this.commodity.shopid,
					datetime:this.datetime,
					departure:this.departure
				})
				.get()
				.then((res)=>{
					if(res.data.length != 0){
						// 存在出发日期和出发地相同的数据
						this.toUpdate(res.data[0]._id)
					}else{
						this.forMaldata()
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			toUpdate(id){
				// 出发时间和出发地一致更新该条数据的购买数量和总价即可
				shopdatabase.doc(id).update({
					data: {
					    many:this.many,
						totalPrice:this.totalPrice
					  }
				})
				.then((res)=>{
					// 给予提示
					let tip = '加入购物车成功'
					let icon = 'success'
					this.tips(tip,icon)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 正式提交数据到数据库
			forMaldata(){
				shopdatabase.add({
					data:this.pubilcData()
				})
				.then((res)=>{
					// 给予提示
					let tip = '加入购物车成功'
					let icon = 'success'
					this.tips(tip,icon)
				})
				.catch((err)=>{
					console.log('err')
				})
			},
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		// 接收值
		onLoad(e) {
			let ids = JSON.parse(e.ids)
			// 商品数据
			this.commodity = ids.Shoppdata
			// 商品单价
			this.unitPrice = Number(this.commodity.price)
			// 初次进入页面商品总价等于单价
			this.totalPrice = Number(this.commodity.price)
			// 是购物车还是立即下单
			if(ids.listing == "shopping"){
				// 加入购物车
				this.btndata = '加入购物车'
			}else{
				// 立即下单
				this.btndata = '立即下单'
			}
		}
	}
</script>

<style>
	@import "../../common/public.css";
	page{background: #F8F8F8 !important;}
	.cart-view{background: #FFFFFF; font-size: 30upx;
	padding: 20upx;
	margin-bottom: 20upx;}
	.cart-date{font-weight: bold; padding-bottom: 20upx;}
	.cart-flex{display: flex;}
	.cart-flex view:nth-child(1){padding-right: 20upx;}
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
	/* 购买数量 */
	.cart-mony{display: flex; align-items: center;
	justify-content: space-around;
	border: 1upx solid #F8F8F8;
	text-align: center;
	height: 60upx;
	line-height: 60upx;
	margin-bottom: 10upx;}
	.cart-mony text{font-weight: bold;
	width: 70upx;}
	.cart-mony text:nth-child(2){border-left: 1upx solid #F8F8F8;
	border-right: 1upx solid #F8F8F8;
	}
	
	.mony-flex{display: flex; align-items: center;
	justify-content: space-between;
	border-top: 1rpx solid #F8F8F8;
	padding-top: 20upx;}
	/* 加入购物车 */
	.shopping{width: 100%; background: #ffffff;
	border-top: 1rpx solid #e5e5e5;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
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
	/* 修改出发地 */
	.menu-block-data view{
	background: #f7f7f7;
	border-radius: 6upx;
	font-size: 25upx;
	color: #292c33;
	font-weight: bold;
	text-align: center;
	padding: 15upx;
	margin: 10upx 15upx 5upx 0;}
	.menu-block-data {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-bottom: 20upx;
	}
	.activetextdata{color: #4CD964; background: #ffdd00 !important; 
	}
</style>
