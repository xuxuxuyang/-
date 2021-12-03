<template>
	<view>
		<view class="content" v-if="mycary">
			<view class="edit" @click="eDit()">{{editdata}}</view>
			<block v-for="(item,index) in shoplist" :key="index">
				<view class="mycatr-back">
					<view class="content-view">
						<!-- 选择器 -->
						<view class="mycatr-radio">
							<image src="../../static/tab/weixuanzhong.svg" v-if="item.Selection == 'hide' "  @click="radioLin(item.Selection,item._id,item.totalPrice)"></image>
							<image src="../../static/tab/xuanzhong.svg" v-else  @click="radioLin(item.Selection,item._id,item.totalPrice)"></image>
						</view>
						<view class="content-img">
							<image :src="item.Coverimg" mode="aspectFill"></image>
						</view>
						<view class="content-title">
							<text>{{item.title}}</text>
							<text>出发日期:{{item.datetime}}</text>
							<text>出发地:{{item.departure}}</text>
						</view>
					</view>
					<!-- 价格 -->
					<view class="mony-flex">
						<view class="mycatr-mony">￥{{item.price}}</view>
						<view class="cart-mony">
							<text @click="reDuce(item.price,item.many,item._id)">-</text>
							<text>{{item.many}}</text>
							<text @click="pLus(item.price,item.many,item._id)">+</text>
						</view>
					</view>
				</view>
			</block>
			
			<!-- 撑出被改的页面 -->
			<view style="height: 200upx;"></view>
			
			<!-- 去下单 -->
			<view class="shopping" v-if="shopbottom">
				<view class="shop-view">
					<view class="ridio-quan">
						<image src="../../static/tab/weixuanzhong.svg" v-if="alldats == 'hide' " @click="Allelection()"></image>
						<image src="../../static/tab/xuanzhong.svg" v-else-if="alldats == 'show' " @click="Allelection()"></image>
						<text>全选</text>
					</view>
					<view>合计:￥{{obtainprice}}</view>
					<view class="shopdata" @click="labfale && placEorder()">
						去下单
					</view>
				</view>
			</view>
			
			<!-- 删除 -->
			<view class="shopping" v-if="!shopbottom">
				<view class="shop-view">
					<view></view>
					<view class="shopdata" @click="labfale && deleShop()">
						删除
					</view>
				</view>
			</view>
			
			<!-- 提示组件 -->
			<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
			<!-- loading组件 -->
			<samll-load v-if="samllload"></samll-load>
		</view>
		
		<!-- 没有数据的提示 -->
		<order ref="orderlisty"></order>
		<home-load v-if="homeload"></home-load>
	</view>
</template>

<script>
	// 引入数据库
	var db = wx.cloud.database()
	var shopdatabase = db.collection('Shopping')
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入没有数据的提示
	import order from '../../element/order.vue'
	export default{
		components:{
			HMmessages,
			order
		},
		data() {
			return {
				mycary:false, //控制数据是否显示
				homeload:true,//页面loding
				samllload:false, //选中切换的小loading
				alldats:'hide', //默认商品不选中
				labfale:false, //控制是否可以点击删除和去下单
				editdata:'编辑',//默认显示可编辑
				shopbottom:true, //控制是否显示 去下单
				current:'', //是否选中标识
				indexArray:[],// 选中的数据的id数组
				shoplist:[], //商品数据
				select:'',// 监听全选和取消全选
				obtainprice:0,  //点击单个得到的总价
				arrtotalPrice:[],//点击得到的总价数组
				fandsdata:{},  //全选push进的id和价格
				Duplicate:[],//全部选中时数组id去重接收
			}
		},
		methods:{
			// 请求购物车数据库数据
			finalchange(){
				shopdatabase.get()
				.then((res)=>{
					if(res.data.length === 0){ // 是否有数据，没有显示提示
						this.homeload = false
						this.mycary = false
						let value = true
						let orderdata = '购物车空空如也！'
						this.nohint(value,orderdata)
					}else{
						let shopDatas = res.data
						this.setUp(shopDatas)
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 进入页面把选中的字段变未选中
			async setUp(shopDatas){
				let Result = await this.forchange(shopDatas)
				await this.shopdatas()
			},
			// 循环更改所有字段为hide
			forchange(shopDatas){
				return new Promise((resolve,reject)=>{
					var frequency = 0
					shopDatas.forEach((item)=>{
						shopdatabase.doc(item._id).update({
							data: {
							    Selection:'hide'
							  }
						})
						.then((res)=>{
							frequency++
							if(frequency === shopDatas.length){
								resolve('success')
							}
						})
						.catch((err)=>{
							reject(err)
						})
					})
				})
			},
			// 得到最终结果
			shopdatas(){
				shopdatabase.get()
				 .then((res)=>{
					 if(res.data.length != 0){
						 this.shoplist = res.data
						 this.mycary = true
						 let value = false
						 let orderdata = ''
						 this.nohint(value,orderdata)// 弹出提示
						 this.homeload = false
						 return
					 }else{
						 this.mycary = false
						 let value = true
						 let orderdata = '购物车空空如也！'
						 this.nohint(value,orderdata)// 弹出提示
						 this.homeload = false
					 }
				 })
				 .catch((err)=>{
					 console.log(err)
				 })
			},
			// 编辑删除购物车商品
			eDit(){
				this.editdata = this.editdata == '完成' ? '编辑' : '完成'
				if(this.editdata == '完成'){
					this.shopbottom = false
				}else if(this.editdata == '编辑'){
					this.shopbottom = true
				}
			},
			// 选中商品
			radioLin(current,id,totalPrice){
				this.samllload = true // 选中图标显示loading
				if(current == 'hide'){
					let ldlist = 'show'
					this.selecTion(ldlist,id)	//调用改变数据库是否选中标识方法
					this.indexArray.push(id)// 把选中的数据的id放在数组里
					let fands = {// 创建一个数组对象，把得到的总价和当前id放到数组里，每点击一个依次遍历相加，【数组求和】
						id,
						totalPrice
					}
					this.arrtotalPrice.push(fands)
				}else{
					let ldlist = 'hide'// 选中变未选中
					this.selecTion(ldlist,id) //调用改变数据库是否选中标识方法
					var indexkml = this.indexArray.indexOf(id);// 找到数组里具体某项
					this.indexArray.splice(indexkml, 1) //删除指定项
					
					var arrid = [id] //把id放在数组里 ->["9e7190f161834b080398b95475381201"]
					// filter用于对数组进行过滤。 它创建一个新数组,新数组中的元素是通过检查指定数组中符合条件的所有元素。 注意:filter()不会对空数组进行检测、不会改变原始数组
					let findarr = this.arrtotalPrice.filter((val)=>{// 取消单个选中找到对应id数组删掉[计算总价]
						return !arrid.includes(val.id)  // includes() 方法用于判断字符串是否包含指定的子字符串
					})
					this.arrtotalPrice = findarr 
				}
			},
			// 单个选中和未选中操作数据库改变数据库标识方法
			selecTion(ldlist,id){
				shopdatabase.doc(id).update({
					data: {
					    Selection:ldlist
					  }
				})
				.then((res)=>{
					this.shopdatas()
					this.samllload = false
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 删除选中的商品
			deleShop(){
				this.samllload = true // 正在操作的loading
				this.indexArray.forEach((item)=>{
					shopdatabase.doc(item).remove()
					.then((res)=>{
						this.indexArray = []
						this.shopdatas()
						let findarr = this.arrtotalPrice.filter((val)=>{
							return !item.includes(val.id)
						})
						this.arrtotalPrice = findarr
						this.samllload = false
					})
					.catch((err)=>{
						console.log(err)
					})
				})
			},
			// 全选和取消全选
			Allelection(){
				this.samllload = true
				if(this.alldats == 'hide'){
					let show = 'show'
					this.publicAll(show)//全选
					this.shoplist.forEach((item)=>{// 全选计算总价
							let fandsdata = {
								id:item._id,
								totalPrice:item.totalPrice
							}
							this.arrtotalPrice.push(fandsdata)
							this.Duplicate.push(item._id)// 把id添加进数组
							this.indexArray = Array.from(new Set(this.Duplicate))//方便全体删除，添加时数组去重
					})	
				}else{
					let show = 'hide'
					this.publicAll(show)
					this.obtainprice = 0// 取消全选计算总价
					this.arrtotalPrice = []
					this.indexArray = []// 清空装有id值的数组
				}
			},
			// 全选和取消全选的操作方法
			publicAll(show){
				var frequency = 0
				this.shoplist.forEach((item)=>{
					shopdatabase.doc(item._id).update({
						data: {
						    Selection:show
						  }
					})
					.then((res)=>{
						frequency++
						if(frequency === this.shoplist.length){
							this.shopdatas()
							this.samllload = false
						}
					})
					.catch((err)=>{
						console.log(err)
					})
				})
			},
			// 加价
			pLus(price,many,id){
				// 加价加loading
				this.samllload = true
				many++
				var totalPrice = price * many
				this.publicPrice(id,many,totalPrice)
				
			},
			// 减价
			reDuce(price,many,id){
				if(many === 1){
					// 给予提示
					let tip = '购买数量最少为1'
					let icon = 'danger'
					this.tips(tip,icon)
				}else{
					// 减价加loading
					this.samllload = true
					many--
					var totalPrice = price * many
					this.publicPrice(id,many,totalPrice)	
				}
			},
			// 加减价公用函数
			publicPrice(id,many,totalPrice){
				shopdatabase.doc(id).update({
					data: {
					    many,
						totalPrice
					  }
				})
				.then((res)=>{
					// 数据库更新成功取到当前点击的总价
					shopdatabase.where({
						_id:id
					})
					.get()
					.then((res)=>{
						let totalPrice = res.data[0].totalPrice
						let fands = {
							id,
							totalPrice
						}
						// 查询已点击的数组id，匹配上，替换总价
						let findarr = this.arrtotalPrice.map((item)=>{
								return item.id == id ? fands : item
						})
						this.arrtotalPrice = findarr
						// 取消loading
						this.samllload = false
						
					})
					.catch((err)=>{
						console.log(err)
					})
					this.shopdatas()
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 下单
			placEorder(){
				let ids = {// 携带总价和这是购物页面跳转的
					obtainprice:this.obtainprice,
					page:'Shopping'
				}
				let objids = JSON.stringify(ids)
				uni.navigateTo({
					url: '../order/order?ids=' + objids
				});
			},
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			},
			// 提示没有数据的
			nohint(value,orderdata){
				this.$nextTick(()=>{   //dom更新循环结束之后的延迟回调
					this.$refs.orderlisty.init(value,orderdata)
				})
			}
		},
		mounted() {
			this.finalchange()// 调用购物车数据库
		},
		computed:{
			// 监听如果未选中任何一个禁用删除按钮和下单按钮
			deleBtn(){
				if(this.indexArray.length == 0){
					this.labfale = false
				}else{
					this.labfale = true
				}
			},
			// 监听是否全选
			allList(){
				let select = this.shoplist.map((cars)=>{
					return cars.Selection;
				})
				this.select = select
			},
			// 监听总价计算
			Calculation(){
				let hash = {};
				const hashdata = this.arrtotalPrice.reduce((preVal, curVal) => {// 数组对象去重
				    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
				    return preVal 
				}, [])
				let numdata = 0
				hashdata.forEach((item)=>{// 总价计算
					numdata += item.totalPrice
				})
				this.obtainprice = parseFloat((numdata).toFixed(10))
			}
		},
		watch:{
			select(newValue, oldValue){
				var identical = newValue.every((item)=>{
					return item === 'show' // 判断数组里的Selection值是否都为同一个值
				})
				if(identical === true){
					this.alldats = 'show'
				}else{
					this.alldats = 'hide'
				}
			}
		}
	}
</script>

<style scoped>
	text{display: block;}
	.content-view{display: flex; justify-content: space-between;
	height: 130upx !important; overflow: hidden;
	}
	.mycatr-back{margin-bottom: 20upx;
	background: #fafafa;
	padding: 20upx;}
	.content-img{width: 250upx !important; height: 130upx !important;
	}
	.content-img image{width: 100%; height: 100%;}
	.content-title{
	width: 100%;
	padding-left: 10upx;
	}
	.content-title text:nth-child(1){
		font-size: 30upx;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
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
	.edit{font-size: 30upx; display: flex; justify-content: flex-end;
	height: 70upx;
	line-height: 70upx;
	padding-right: 20upx;}
	/* 选择器 */
	.mycatr-radio{background: #fafafa; height: 130upx;
	line-height: 130upx;
	text-align: center;
	width: 50upx !important;
	padding-right: 20upx;
	}
	.mycatr-radio image{width: 50upx !important; height: 50upx !important; border-radius: 50%;}
	radio{width: 50upx !important;}
	/* 价格 */
	.cart-mony{display: flex; align-items: center;
	justify-content: space-around;
	text-align: center;}
	.cart-mony text{background: #ededed; padding: 0 25upx; height: 60upx;
	line-height: 60upx;
	border-radius: 6upx;}
	.cart-mony text:nth-child(2){background: none; padding: 0 10upx; flex-grow: 2;}
	.mony-flex{display: flex; justify-content: space-between;
	background: #fafafa;
	height: 70upx;
	align-items: center;}
	.mycatr-mony{padding-left: 100upx; color: #ff5000;}
	/* 加入购物车 */
	.shopping{width: 100%; background: #fafafa;
	border-top: 1rpx solid #e5e5e5;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	}
	.shopdata{background: #ff5000;
	height: 90upx; line-height: 90upx; width: 250upx;
	color: #ffffff;
	font-weight: 100;
	}
	
	.shop-view{display: flex; justify-content: space-between; align-items: center;
	text-align: center;
	font-size: 30upx;
	padding-left: 20upx;
	color: #ff5000;
	font-weight: bold;}
	.ridio-quan{display: flex; align-items: center;}
	.ridio-quan image{width: 50upx !important; height: 50upx !important; border-radius: 50%;}
	.ridio-quan text{padding-left: 6upx;}
</style>
