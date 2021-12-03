<template>
	<view>
		<!-- 搜索+轮播图 -->
		<Search :banner="banner"></Search>
		<!-- 图标分类 -->
		<Ticket></Ticket>
		<!-- 表格分类 -->
		<Classify></Classify>
		<!-- tab选项 -->
		<Content id="boxFixed" :class="{'is_fixed' : isFixed}" :tab="tab"></Content>	
		<!-- 因为tab做过定位会浮空,需要固定拉开距离 -->
		<view style="height: 140upx;"></view>
		<!-- 卡片流商品 -->
		<Article :Articleend="Articleend" v-if="!loadinglist"></Article>
		
		<!--********************************页面提示组件******************************* -->
		<!-- tab切换的loading -->
		<loader-list v-if="loadinglist"></loader-list>
		<!-- 单页面的loading -->
		<home-load v-if="homeload"></home-load>
		<!-- 没有数据的提示 -->
		<none-data v-if="nonedata"></none-data>
		<!-- 上拉加载的loading -->
		<view class="load-more" v-if="loadmore">
		<uni-load-more  :status="uniload" color="#ffcc99"></uni-load-more>
		</view>
	</view>
</template>
 
<script>
	import Search from './components/search'
	import Ticket from './components/ticket'
	import Classify from './components/classify'
	import Content from './components/content'
	import Article from './components/article'
	// 引入上拉加载插件
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	
	// 引入并发请求
	import {home,homelist} from '../../common/cloudfun.js'
	
	//引入VueX计算属性映射
	import {mapState} from 'vuex'

	
	export default {
		components:{
			Search,
			Ticket,
			Classify,
			Content,
			Article,
			uniLoadMore
		},
		data() {
			return {
				isFixed: false, //控制tab样式是否生效
				rect:'',//页面滚动距离
				menuTop:'',//tab距离顶部距离
				banner:[],// 轮播
				tab:[],// 请求下来的tab数据
				Articleend:[],//卡片流商品数据
				loadinglist:false,// 控制tab切换的loding提示
				homeload:true,// 控制单页面的loading提示
				nonedata:false, //tab分类下没有数据的提示
				pageid:0,//上拉加载初始化数据获取数量起始值
				nav:'',//tab分类
				uniload:'loding',//控制上拉加载时显示的图标
				loadmore:false
			}
		},
		methods:{
			//请求数据的方法
			listend(){
				let banner = 'banner';//轮播数据库
				let tab = 'tab'//tab数据库
				let listing = 'Commodity'//商品数据库
				let typedatas = '江西' //默认请求的tab分类
				Promise.all([home(banner),home(tab),homelist(listing,typedatas,this.pageid)])
				.then((res)=>{ 
					this.banner = res[0].data// 轮播图
					this.tab = res[1].data// tab切换
					this.Articleend = res[2].data// 列表的第一条数据
					this.homeload = false// 所有数据出来消除loading
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 上拉加载更多数据
			pullon(){
				let listing = 'Commodity'//商品数据库
				let typedatas = this.nav //查询分类数据
				homelist(listing,typedatas,this.pageid)
				.then((res)=>{
					// 如果没有数据了，改变loading状态
					if(res.data.length == 0){
						this.uniload = 'noMore'
					}else{
						//数据添加使用数组结构
					this.Articleend = [...this.Articleend,...res.data]	
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			}
		},
		computed: {
			...mapState(['list','load','navmin','nonemin']),
			// 响应列表值
			count(){
				return this.Articleend = this.list.listing
			},
			// 响应loading值
			countload(){
				return this.loadinglist = this.load.loading
			},
			// 响应nav值
			navdata(){
				this.loadinglist = this.navmin.loading
				this.nav = this.navmin.naving
				this.pageid = this.navmin.pageid
				this.loadmore = this.navmin.uniload
				this.nonedata = this.navmin.nonedata
				this.uniload = this.navmin.stateload
			},
			// 如果tab切换没有数据，显示提示
			noneted(){
				return this.nonedata = this.nonemin.nonedata
			},
			//监听距离顶部的距离 实现tab吸顶效果
			fix() {
				if (this.rect > this.menuTop){
					this.isFixed = true
				}else{
					this.isFixed = false
				}
			}
		},
		// tab吸顶 监听距离顶部距离
		onLoad () {
			var that = this;
			var query = wx.createSelectorQuery()
			query.select('#boxFixed').boundingClientRect()
			query.exec( (res)=> {
				 this.menuTop = res[0].top
			});
			// 进入页面,请求数据
			this.listend()
		},
		// 监听页面滚动距离scrollTop
		onPageScroll (e) {
			this.rect = e.scrollTop
		},
		// 触发上拉加载api
		onReachBottom() {
			// 出现loading加载
			this.loadmore = true
			this.uniload = 'loading'
			this.pageid++
			this.pullon()
		},
		// 分享配置
		onShareAppMessage(res) {
		    return {
		      title: '飞猪旅游',
		      path: '/pages/index/index'
		    }
		},
	}
</script>

<style scoped>
	page {
		height:100%;overflow:auto;margin: 0;
	}
	/* // 导航 */
	.is_fixed{position: fixed; top: 0;
			left: 0; right: 0; z-index: 99;
			transform: translateZ(0);
			}	
	/* 上拉加载的样式 */
	.load-more{height: 160upx;
	display: flex;
	align-items: center;
	justify-content: center;}
</style>
