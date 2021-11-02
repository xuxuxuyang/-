<template>
	<view>
		<!--搜索城市 -->
		<view class="margin-search">
			<view class="search-cont">
				<view class="city-search">
					<image src="../../static/tab/sousuo.svg" mode="widthFix"  class="search-img"></image>
					<input type="text" placeholder="发现你感兴趣的目的地" v-model="keywords" @focus="searchCity"
					@input="searchInput"/>
				</view>
				<view class="search-code" @click="canCel" v-if="!citynone">
					<image src="../../static/tab/chaa.svg" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 点击搜索隐藏 -->
		<view v-if="citynone">
			<!-- 定位城市 -->
			<view class="city-view">
				<view class="city-text">当前定位城市</view>
				<view class="posit-city">
					<image src="../../static/tab/gonglveb.png" mode="widthFix"></image>
					<text class="city-text" @click="clickCicy()">{{address}}</text>
				</view>
			</view>
			<!-- 热门城市 -->
			<view class="hot-city">热门城市</view>
			<view class="menu-block">
				<block v-for="(item,index) in city" :key="index">
					<view  @click="hotCity(item.name)">{{item.name}}</view>
				</block>
			</view>
		</view>
		<!-- 显示搜索的城市 -->
		<view class="results" v-if="!citynone">
			<block v-for="(item,index) in citydata" :key='index'>
				<view class="results-city" @click="seekCity(item)">
				<image src="../../static/tab/gonglveb.png" mode="widthFix"></image>
				<text>{{item}}</text>	
				</view>	
			</block>
		</view>
		
	</view>
</template>

<script>
	// 引入定位js
	var QQMapWX = require('../../common/qqmap-wx-jssdk.min.js');
	// 实例化API核心类
	var qqmapsdk = new QQMapWX({
	    key: 'RIKBZ-CCMLS-6KEOA-6EVQ4-5U3BV-VNFA5' // 必填
	});
	// 引入定位
	import { addressdata } from '../../common/list.js'
	export default{
		data() {
			return {
				citynone:true,
				keywords:'',
				// 搜索的城市
				citydata:[],
				// 定位的城市
				address:'',
				// 取到从某个页面过来的
				pageroute:'',
				city: [
					{
						"name":'丰城市'
					},
					{
						"name":'南昌市'
					},
					{
						"name":'广州市'
					},
					{
						"name":'九江市'
					},
					{
						"name":'贵州市'
					},
					{
						"name":'刘佳美市'
					},
					{
						"name":'杭州市'
					}
				],
			}
		},
		methods:{
			// 隐藏城市
			searchCity(e){
				this.citynone = false
				this.citydata = ''
			},
			// 关闭搜索
			canCel(){
				this.citynone = true
				this.keywords = ''
			},
			// 输入城市获取地点
			searchInput(e){
				this.keywords = e.detail.value
				    //调用关键词提示接口
				    qqmapsdk.getSuggestion({
				      //获取输入框值并设置keyword参数
				      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
				      success: (res)=> {//搜索成功后的回调
				        let city = res.data
						// 取出城市名
						let thecity = res.data[0].city
						var citydata = city.map(function(item){
							return item.title;
						})
						let allcity = [thecity,...citydata]
						this.citydata = allcity
				        
				      },
				      fail: (error)=> {
				        console.error(error);
				      }
				    });
			},
			// 定位
			addRess(){
				// 定位
				addressdata()
				.then((res)=>{
					let city = res.result.ad_info.city
					this.address = city
				})
				.catch((err)=>{
					this.address = '丰城市'
				})
			},
			// 点击当前定位取到城市
			clickCicy(){
				let cityion = this.address
				this.rouTes(cityion)
			},
			// 取到热门城市
			hotCity(item){
				this.rouTes(item)
			},
			// 用户搜索的城市
			seekCity(item){
				this.rouTes(item)
			},
			// 返回上一个页面
			rouTes(cityion){
				// 判断用户是否从发帖页面进入
				if(this.pageroute == "pages/travels/travels"){
					// 传值到vuex,这是传给发帖页面的
					this.$store.commit('travemuta', cityion)
				}else{
				// 传值到vuex,这是传给攻略页面的
				this.$store.commit('citymuta', cityion)	
				}
				wx.navigateBack({
					delta: 1
				})
			}
		},
		// 进入页面 开始定位
		mounted() {
			this.addRess()
		},
		// 获取用户从哪个页面进入该页面
		onLoad() {
			let pages = getCurrentPages();
			let prevpage = pages[pages.length - 2];
			this.pageroute = prevpage.route
		},
	}
</script>

<style scoped>
	page{background: #ffffff;}
	/* 搜索城市 */
	.margin-search{margin-bottom: 40upx;}
	.city-search{
	    height: 70upx;
		line-height: 70upx;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
		background:#f8f8f8;
		border-radius: 50upx;
		}
	.search-img{margin: auto 0 auto 20upx; width: 40upx; height: 40upx;} 	
	.city-search input{
			height: 70upx;
			line-height: 70upx;
	        width: 100%;
	        font-size: 30upx;
			color: #666666; 
			  } 
	.search-cont{display: flex; justify-content: space-between; height: 70upx; align-items: center;
				background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
				padding: 30upx 20upx;
				}	
	.search-code image{width: 50upx; height: 50upx;}
	.search-code{width: 50upx; height: 50upx; padding: 0 15upx;}		  
	/* 定位城市 */
	.city-view image{width: 40upx; height: 40upx; padding-right: 20upx;}
	.city-text{font-size: 30upx; color: #3f3f3f;}
	.posit-city{display: flex; align-items: center; padding-left: 35upx;}
	.city-view{display: flex; align-items: center;
	background: #f7f7f7;
	padding: 20upx 10upx;
	margin: 0 20upx;
	border-radius: 6upx;}
	/* 热门城市 */
	.hot-city{font-size: 30upx; color: #999999; margin: 50upx 20upx 0 20upx;}
	.menu-block view {
		background: #f7f7f7;
		border-radius: 6upx;
		font-size: 27upx;
		color: #333333;
		text-align: center;
		padding: 15upx;
		margin: 20upx;
	}
	
	.menu-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	/* 搜索的结果 */
	.results text{display: block; font-size: 30upx; color: #ee9900;}
	.results-city image{width: 40upx; height: 40upx; padding-right: 20upx;}
	.results-city{display: flex; align-items: center; border-bottom: 1rpx solid #e5e5e5;
	padding: 20upx 0;
	margin: 0 20upx;}
</style>
