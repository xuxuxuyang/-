<template>
	<view>
		<view class="header-fixed" v-show="!showAbs" :style="{opacity:styleObject}">
			<Navs></Navs>
		</view>
		<!-- 轮播图 -->
		<Banner :detaildata="detaildata"
		:leaveword="leaveword"
		></Banner>
		<!-- 商家介绍 -->
		<Businessing :detaildata="detaildata"></Businessing>
		<!-- 图文视频 -->
		<view class="matter-page">
			<Matter :detaildata="detaildata"></Matter>
		</view>
		<!-- 宝贝评价 -->
		<view class="message-page">
			<Message :leaveword="leaveword"
			:messageword="messageword"
			:detaid = "detaid"
			></Message>
		</view>
		<!-- 购买 --> 
		<Shopping :detaildata="detaildata"></Shopping>
		<!-- 留言为空的提示 -->
		<view style="margin-bottom: 110upx;"  v-if="nonedata">
		<none-data></none-data>	
		</view>
		<!-- 进入页面执行的loading -->
		<home-load v-if="homeload"></home-load>
	</view>
</template>

<script>
	import Navs from './components/navs.vue'
	import Banner from './components/banner.vue'
	import Businessing from './components/businessing.vue'
	import Matter from './components/matter.vue'
	import Message from './components/message.vue'
	import Shopping from './components/shopping.vue'
	import {mapState} from 'vuex'
	// 引入数据库
	var db = wx.cloud.database()
	var listdata = db.collection('Commodity')
	// 留言数据库
	var messdatabase = db.collection('message')
	export default{
		components:{
			Navs,
			Banner,
			Businessing,
			Matter,
			Message,
			Shopping
		},
		data() {
			return {
				showAbs:true, //控制nav导航栏的显示
				styleObject:0, //实时控制动态样式 透明度
				detaildata:{}, //具体留言数据
				leaveword:[], //留言数据数组
				messageword:[],// 百度ai留言分类数组
				nonedata:false,//控制留言数据为空提示
				detaid:'',  //列表页传过来的id
				homeload:true //控制进入页面等待的loding
			}
		},
		methods:{
			// 改变样式方法
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
			// 请求数据库数据{图文列表，轮播图}
			detailreq(id){
				listdata.where({
				  _id:id
				})
				.get()
				.then((res)=>{
					let shopid = {shopid:res.data[0]._id} //拿到数据id
					//Object.assign()接口可以接收多个参数，第一个参数是目标对象，后面的都是源对象，assign方法将多个原对象的属性和方法都合并到了目标对象上面，
					//如果在这个过程中出现同名的属性（方法），后合并的属性（方法）会覆盖之前的同名属性（方法）
					let obgdata = Object.assign(res.data[0].wholedata ,shopid);
					this.detaildata = obgdata //具体留言数据赋值新对象
					this.homeload = false //获取到数据后 隐藏页面loding
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 请求留言数据
			messagedata(id){
				messdatabase.where({
				  id:id
				})
				.orderBy('messagedata.time','desc')
				.get()
				.then((res)=>{
					let resdata = res.data
					this.classData(resdata)// 调用处理数组ai分类方法
					this.publicMess(resdata)// 调用请求具体留言方法
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// ai tab分类精准查询留言数据方法
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
			// 获取分类留言数据
			publicMess(resdata){
				var leaveword = resdata.map((item)=>{
					return item.messagedata
				})
				this.leaveword = leaveword //赋值具体留言数据数组
				if(leaveword.length === 0){
					this.nonedata = true	// 如果留言列表为空，给予提示
				}else{
					this.nonedata = false
				}
			},
			// 取出ai分类留言数据
			classData(resdata){
				var messageword = resdata.map((item)=>{ //map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
					return item.classmessage
				})
				let newarr = Array.from(new Set(messageword))// 数组去重
				var newArr = newarr.filter(item => item) // 数组去空值
				this.messageword = newArr //数组全部处理后赋值
			},
			// 描点链接滚动方法
			pageScroll(deta){
				const query = this.createSelectorQuery();
				query.select(deta).boundingClientRect()
				query.selectViewport().scrollOffset();
				query.exec((res)=>{
					if(res[0] && res[1]){ // res[0].top       // 绑定节点距离上边界坐标 // res[1].scrollTop // 显示区域的竖直滚动位置
						uni.pageScrollTo({
							scrollTop:res[0].top + res[1].scrollTop - 35,
							duration:300 //过渡时间
						})
					}
				})
			},
			// 被子组件调用，请求分类留言数据
			fatherMethod(item){
				if(item == "全部"){
					this.messagedata(this.detaid)// 请求所有留言
				}else{
					this.querymessage(this.detaid,item)// 点击ai分类tab精准请求数据
				}
			}
		},
		// 监听页面滚动距离scrollTop
		onPageScroll (e){
			let top = e.scrollTop //取到实时滚动距离
			this.handleScroll(top)//滚动实时调用控制class实现渐变效果
		},
		// 接收列表页的参数
		onLoad(e) {
			this.detaid = e.id
			this.detailreq(this.detaid)// 携带id精准请求数据库数据
			this.messagedata(this.detaid)// 携带id精准请求请求此商品的留言
		},
		// 描点链接
		computed:{
			...mapState(['navindex']),
			bannervuex(){
				if(this.navindex.index === 1){
					let details = '.matter-page'
					this.pageScroll(details) //调用描点链接滚动方法
				}else if(this.navindex.index === 2){
					let message = '.message-page'
					this.pageScroll(message)//调用描点链接滚动方法
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
