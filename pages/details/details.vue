<template>
	<view>
		<view class="header-fixed" v-show="!showAbs" :style="{opacity:styleObject}">
			<Navs></Navs>
		</view>
		<!-- 轮播 -->
		<Banner :detaildata="detaildata"
		:leaveword="leaveword"
		></Banner>	
		<!-- 图文视频 -->
		<view class="matter-page">
			<Matter :detaildata="detaildata"></Matter>
		</view>
		<!-- 评论 -->
		<view class="message-page">
			<Message :leaveword="leaveword"
			:messageword="messageword"
			:detaid = "detaid"
			></Message>
		</view>
		<!-- 留言为空的提示 -->
		<view style="margin-bottom: 90upx;"  v-if="nonedata">
		<none-data></none-data>	
		</view>
		<!-- 进入页面执行的loading -->
		<home-load v-if="homeload"></home-load>
	</view>
</template>

<script>
	import Navs from './components/navs.vue'
	import Banner from './components/banner.vue'
	import Matter from './components/matter.vue'
	import Message from './components/message.vue'
	import {mapState} from 'vuex'

	var db = wx.cloud.database() // 引入数据库
	var listdata = db.collection('userdata')//用户发表数据库
	var messdatabase = db.collection('message')// 留言数据库
	export default{
		components:{
			Navs,
			Banner,
			Matter,
			Message
		},
		data() {
			return {
				showAbs:true, //控制nav是否显示
				styleObject:0, //动态控制nav样式
				detaildata:{},//用户分享数据
				leaveword:[], //具体留言数据数组
				messageword:[],// ai留言分类数组
				nonedata:false,//控制没有留言的提示是否显示
				detaid:'',  //列表页传过来的id
				homeload:true //控制进入页面执行的loading
			}
		},
		methods:{
			// 动态改变nav样式opacity属性方法
			handleScroll(top){
				if(top > 90){
					let opacity = top / 170
					opacity = opacity > 1 ? 1 : opacity
					this.styleObject = opacity
					this.showAbs = false
				} else{
					this.showAbs = true
				}
			},
			// 精准请求数据库数据
			detailreq(id){
				listdata.where({
				  _id:id
				})
				.get()
				.then((res)=>{
					this.detaildata = res.data[0].datainfo// 赋值筛选到的数据
					this.homeload = false	
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 精准请求留言数据
			messagedata(id){
				messdatabase.where({
				  id:id
				})
				.orderBy('messagedata.time','desc')
				.get()
				.then((res)=>{
					let resdata = res.data
					this.classData(resdata)// 把数据拿去做ai分类处理
					this.publicMess(resdata)// 处理留言数据和赋值
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 子组件ai 点击tab分类查询分类留言的数据
			querymessage(ceshi,item){
				messdatabase.where({
				  id:ceshi,
				  classmessage:item
				})
				.orderBy('messagedata.time','desc')
				.get()
				.then((res)=>{
					let resdata = res.data
					this.publicMess(resdata)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 处理拿到的留言数据
			publicMess(resdata){
				var leaveword = resdata.map((item)=>{
					return item.messagedata
				})
				this.leaveword = leaveword
				if(leaveword.length === 0){
					this.nonedata = true // 如果留言列表为空，给予提示
				}else{
					this.nonedata = false
				}
			},
			// 处理数据所属的ai分类
			classData(resdata){
				var messageword = resdata.map((item)=>{
					return item.classmessage
				})
				let newarr = Array.from(new Set(messageword))// 数组去重
				var newArr = newarr.filter(item => item)// 数组去空值
				this.messageword = newArr
			},
			// 描点链接精准滚动方法
			pageScroll(deta){
				const query = this.createSelectorQuery();
				query.select(deta).boundingClientRect()
				query.selectViewport().scrollOffset();
				query.exec((res)=>{
					if(res[0] && res[1]){
						uni.pageScrollTo({
							scrollTop:res[0].top + res[1].scrollTop - 35,
							duration:300
						})
					}
				})
			},
			// 被子组件调用，请求分类留言数据
			fatherMethod(item){
				if(item == "全部"){
					this.messagedata(this.detaid)// 请求留言
				}else{
					this.querymessage(this.detaid,item)// ai分类tab数据
				}
			}
		},
		// 监听页面滚动距离scrollTop->实时更新动态样式
		onPageScroll (e){
			let top = e.scrollTop
			this.handleScroll(top)
		},
		// 接收列表页的参数
		onLoad(e) {
			this.detaid = e.id
			this.detailreq(this.detaid)// 精准请求数据库数据
			this.messagedata(this.detaid)// 精准请求留言
		},
		computed:{
			...mapState(['navindex']),
			bannervuex(){ // 实时监听VueX保存的点击状态->描点链接精准滚动
				if(this.navindex.index === 1){
					let details = '.matter-page'
					this.pageScroll(details)
				}else if(this.navindex.index === 2){
					let message = '.message-page'
					this.pageScroll(message)
				}
			},
		},
	}
</script>

<style>
	page{
		background: #f8f8f8;
	}
	.header-fixed{
		position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background: #ffd00c;
			z-index: 2;
	}
</style>
