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
				citynone:true,//控制显示定位城市
				keywords:'',//输入的搜索数据
				citydata:[],// 搜索的城市名+部分具体地名
				address:'',// 定位的城市
				pageroute:'',// 取到从某个页面过来的
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
					}
				],
			}
		},
		methods:{
			// 点击获取焦点后触发的方法
			searchCity(e){
				this.citynone = false //隐藏当前定位和可选城市
				this.citydata = ''
			},
			// 取消搜索触发的方法
			canCel(){
				this.citynone = true//显示当前定位和可选城市
				this.keywords = '' //清空输入框
			},
			// 输入搜索触发的获取定位方法
			searchInput(e){
				this.keywords = e.detail.value //实时拿到输入的数据
				    qqmapsdk.getSuggestion({ //调用关键词提示接口
				      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
				      success: (res)=> {//搜索成功后的回调
				        let city = res.data
						let thecity = res.data[0].city// 拿到定位的城市名
						var citydata = city.map((item)=>{ 
							return item.title;   //筛选出定位的具体地名
						})
						let allcity = [thecity,...citydata] //数组设置为 城市名+部分具体地名
						this.citydata = allcity  //赋值筛选定位数组
				      },
				      fail: (error)=> {
				        console.error(error);
				      }
				    });
			},
			// 定位方法
			addRess(){
				addressdata()
				.then((res)=>{
					let city = res.result.ad_info.city
					this.address = city
				})
				.catch((err)=>{
					this.address = '丰城市'
				})
			},
			// 点击当前定位取到的城市
			clickCicy(){
				let cityion = this.address
				this.rouTes(cityion)
			},
			// 点击定位热门城市
			hotCity(item){
				this.rouTes(item)
			},
			// 点击用户搜索的筛选出的城市+部分具体地名
			seekCity(item){
				this.rouTes(item)
			},
			// 返回上一个页面
			rouTes(cityion){
				if(this.pageroute == "pages/travels/travels"){// 判断用户是否从发帖页面进入
					this.$store.commit('travemuta', cityion)	// 传值到vuex,这是传给发帖页面的
				}else{
				this.$store.commit('citymuta', cityion)	// 传值到vuex,这是传给攻略页面的
				}
				wx.navigateBack({
					delta: 1
				})
			}
		},
		mounted() {
			this.addRess() // 进入页面 开始定位
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
