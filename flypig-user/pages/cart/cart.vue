<template>
	<view>
		<!-- 出发日期 -->
		<view class="cart-view">
			<view class="cart-date">出发日期</view>
			<view class="cart-flex">
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
				datetime: '点击选择日期', //出发时间
				departure:'',  //出发地
				commodity:{},//所有商品数据
				btndata:'',//控制显示加入购物车按钮 还是 立即购买按钮
				unitPrice:'',// 商品单价
				totalPrice:'',// 商品总价
				many:1,// 下单数
			}
		},
		methods:{
			// 选择日期方法
			bindDateChange(e) {
				this.datetime = e.target.value //赋值选择的日期
			},
			// 选择出发地
			menubtn(item,index){
				this.num = index
				this.departure = item
			},
			// 点击增加购买数量
			plus(){
				// 计算总价,首先购买几件数量要变
				this.many++
				let numdata = this.unitPrice * this.many
				this.totalPrice = parseFloat((numdata).toFixed(10))
			},
			// 点击减少购买数量
			reduce(){ 
				if(this.many === 1){ // 购买数量不能为零
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
				if(this.departure == ''){  //提交前校验
					// 给予提示
					let tip = '请选择出发地'
					let icon = 'danger'
					this.tips(tip,icon)
				}else{
					if(datas == '加入购物车'){ //点击加入购物车
						this.carTdata()// 调用加入购物车的商品 存入云数据库方法
					}else{
						let ids = {
							orderdata:[this.pubilcData()], //使用[]号解出数据
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
					if(res.data.length == 0){// 1.查询数据库如果为空直接添加进去
						this.forMaldata()
						return
					}
					if(res.data.length != 0){// 2.数据库里有数据并且用户提交的数据和数据库数据相同，不添加
						shopdatabase.where({// 查询数据库时候存在相同的数据，如果出现某一个相同则不提交，
							shopid:this.commodity.shopid,
							datetime:this.datetime,
							departure: this.departure,
							many: this.many,
							totalPrice: this.totalPrice,
						})
						.get()
						.then((res)=>{
							if(res.data.length != 0){ // 出现相同数据不提交
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
			// 出发时间和出发地一致的数据 处理方法
			timeing(){
				shopdatabase.where({
					shopid:this.commodity.shopid,
					datetime:this.datetime,
					departure:this.departure
				})
				.get()
				.then((res)=>{
					if(res.data.length != 0){
						this.toUpdate(res.data[0]._id)// 存在出发日期和出发地相同的数据
					}else{
						this.forMaldata()
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 存在出发日期和出发地相同的数据 处理方法
			toUpdate(id){
				shopdatabase.doc(id).update({// 出发时间和出发地一致更新该条数据的购买数量和总价即可
					data: {
					    many:this.many,
						totalPrice:this.totalPrice
					  }
				})
				.then((res)=>{
					let tip = '加入购物车成功'
					let icon = 'success'
					this.tips(tip,icon)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 数据全部校验完成 正式提交数据到数据库的方法
			forMaldata(){
				shopdatabase.add({
					data:this.pubilcData()
				})
				.then((res)=>{
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
			let ids = JSON.parse(e.ids) //该商品所有的数据
			this.commodity = ids.Shoppdata// 赋值商品数据
			this.unitPrice = Number(this.commodity.price)// 商品单价
			this.totalPrice = Number(this.commodity.price)// 初次进入页面商品总价等于单价
			if(ids.listing == "shopping"){// 判断点击那个按钮
				this.btndata = '加入购物车'// 按钮显示加入购物车
			}else{
				this.btndata = '立即下单'// 按钮显示立即下单
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
