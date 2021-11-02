<template>
	<view>
		<view class="search-cont">
			<view class="search">
				<input type="text"  placeholder-class="inputclass" confirm-type ="search" 
				focus="true"
				placeholder="请输入关键字" 
				v-model="searchdata"
				@confirm="onKeyInput"/>
			</view>
			<view class="search-code" @click="seArch()">
				搜索
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-if="ifhistory">
			<view class="search-title">
				<view>搜索历史</view>
				<view @click="removeStorage()"><image src="../../static/tab/searchend.svg" mode="widthFix"></image></view>
			</view>
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item,index) in setdata" :key="index">
					<view :class="{ activetext: index == num }" @click="menubtn(item)">{{item}}</view>
				</block>
			</view>
		</view>
		
		<!-- 内容展示 -->
		<view class="active">
			<view class="conteng">
				<block v-for="(item,index) in localdata" :key="index">
				<view class="conteng-article newing" @click="localCont(item._id)">
					<view  class="conteng-img">
					<block v-for="(itemimg,index) in item.datainfo.staticimg" :key="index" v-if="index==0">
					<image :src="itemimg" mode="aspectFill"  class="animated fadeIn"></image>	
					</block>
					</view>
					<!-- 文字介绍 -->
					<view class="active-introduce">
						<view class="active-name">{{item.datainfo.titledata}}</view>
						<view class="active-title">{{item.datainfo.tipsdata}}</view>
					</view>
					<view class="purchase userinfo">
						<image :src="item.datainfo.avatarUrl" mode="widthFix"></image>
						<text class="active-purchase" v-if="item.datainfo.nickName != '' ">{{item.datainfo.nickName}}</text>
					</view>
				</view> 
				</block>
			</view>
		</view>
		<!-- 没有数据的提示 -->
		<none-data v-if="nonedata"></none-data>
	</view>
</template>

<script>
	export default{
		name:'searched',
		data() {
			return {
				searchdata:'',
				setdata:[],// 搜索历史
				ifhistory:false,  // 控制搜索历史是否显示
				localdata:[],  //搜索结果
				nonedata:false,  //控制没有数据的提示
			}
		},
		methods:{
			// 点击搜索过的历史
			menubtn(name){
				this.ifhistory = false// 发起搜索隐藏搜索历史
				this.searchData(name)// 调用数据库搜索
			},
			// 键盘的搜索
			onKeyInput(e){
					let searchkey = e.detail.value//获取键盘输入的值
				if(searchkey != ""){
					this.getStorage(searchkey)//把搜索历史存入本地储存数组
					this.searchData(searchkey)// 调用数据库搜索
					this.ifhistory = false	// 发起搜索隐藏搜索历史
				}
			},
			// 发起搜索
			seArch(){
				if(this.searchdata != ''){
					this.ifhistory = false // 发起搜索 隐藏搜索历史
					let searchkey = this.searchdata //获取输入的搜索
					this.getStorage(searchkey)	//存储搜索到本地缓存
					this.searchData(searchkey)// 请求搜索数据
				}
			},
			// 存入本地缓存数组方法
			getStorage(searchkey){
				let seararray = uni.getStorageSync('search_key') || [] //有历史值就取出 没有就设置一个默认值
				seararray.unshift(searchkey) //将新数据添加到数组的开头：
				uni.setStorageSync('search_key', seararray); //本地储存
			},
			// 取出本地缓存方法
			setStorage(){
				let setdata = uni.getStorageSync('search_key')
				//Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组 
				let setdataarr = Array.from(new Set(setdata)) //Set 对象存储的值总是唯一的
				if(setdataarr == ''){  
					this.ifhistory = false  //隐藏搜索历史
				}else{
					this.setdata = setdataarr //赋值给搜索历史
					this.ifhistory = true //显示搜索历史
				}
			},
			// 清除缓存方法
			removeStorage(){
				uni.removeStorageSync('search_key'); 
				this.setStorage() //再次调用取出本地缓存方法 更新界面
			},
			// 请求数据库
			searchData(searchkey){
				const db = wx.cloud.database()
				const seardata = db.collection('userdata')
				seardata.where({
					datainfo:{
					tipsdata: db.RegExp({
						    regexp: searchkey,
						    options: 'm',
						  })
					} 
				})
				.get()
				.then((res)=>{
					if(res.data.length === 0){
						this.nonedata = true
						this.localdata = ''
					}else{
						this.nonedata = false
						this.localdata = res.data
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			localCont(id){
				uni.navigateTo({
					url:'../details/details?id=' + id// 跳转到详情页
				})
			}
		},
		created() {
			this.setStorage()//进入页面 获取历史搜素
		},
	}
</script>

<style scoped>
	@import "../../common/uni.css";
	.search{
	    height: 70upx;
		line-height: 70upx;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
		background:#f8f8f8;
		border-top-left-radius: 50upx;
		border-bottom-left-radius: 50upx;
		border-bottom-right-radius:50upx;
		margin-left: 20upx;
		}
	.search input{
			height: 70upx;
			line-height: 70upx;
	        width: 100%;
	        font-size: 30upx;
			color: #666666; 
			padding-left: 30upx;
			  } 
	.search-cont{display: flex; justify-content: space-between; height: 70upx; align-items: center;
				padding: 30upx 0;
				}
	.search-code{width: 150upx; height: 50upx; text-align: center; font-size: 30upx;}
	/* 搜索历史 */
	.search-history{margin: 20upx;}
	.search-title{font-size: 30upx; font-weight: bold;
				display: flex;
				justify-content:space-between;
				align-items: center;
				height: 60upx;
				line-height: 60upx;}
	.search-title image{width: 36upx; height: 36upx; display: block;}
	.menu-block view {
		background: #f7f8fa;
		border-radius: 6upx;
		font-size: 27upx;
		color: #292c33;
		text-align: center;
		padding: 10upx;
		margin: 20upx 20upx 0 0;
	}
	
	.menu-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.newing{padding-bottom: 30upx;}
	/* 用户头像 */
	.userinfo image{width: 50upx; height: 50upx; border-radius: 50upx;}
	.userinfo text{padding-left: 20upx;}
	.userinfo{padding-top: 20upx;}
</style>
