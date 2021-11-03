<template>
	<view>
		<Address :address="address"></Address>
		<Locality></Locality>
		<Content :localdata="localdata" v-if="!loadinglist"></Content>
		<!-- 发表 -->
		<view class="publish animated fadeInUp" v-if="!Whether">
			<image src="../../static/tab/fab.png" mode="widthFix" @click="travels()"></image>
		</view>
		<!-- tab切换的loading -->
		<loader-list v-if="loadinglist"></loader-list>
		<!-- 没有数据的提示 -->
		<none-data v-if="nonedata"></none-data>
		<!-- 单页面的loading -->
		<home-load v-if="homeload"></home-load>
		<!-- 上拉加载的loading -->
		<view class="load-more" v-if="loadmore">
		<uni-load-more  :status="uniload" color="#ffcc99"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import Address from './components/address.vue'
	import Locality from './components/locality.vue'
	import Content from './components/content.vue'
	import {mapState} from 'vuex'
	// 引入定位
	import { addressdata } from '../../common/list.js'
	// 引入上拉加载插件
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	// 引入数据库
	var db = wx.cloud.database()
	var listdata = db.collection('userdata')
	export default{
		components:{
			Address,
			Locality,
			Content,
			uniLoadMore
		},
		data() {
			return { 
				address:'丰城市', //默认显示定位城市
				localdata:[],// 筛选到的数据
				homeload:true,// loading加载
				loadmore:false,  //上拉加载是否显示
				uniload:'loading',//控制上拉加载样式
				pageid:0,//上拉加载的值
				loadinglist:false, //控制tab切换的loading
				nonedata:false,//控制没有数据的loading
				addressData:'',// watch监听选择城市的页面
				Whether:false,  //隐藏发表按钮
			}
		},
		methods:{
			// 被子组件调用
			fatherMethod(name) {
			   this.loadinglist = true  // 点击tab显示tab loading
			   this.nonedata = false //隐藏没有数据的loding
			   if(name == '全部'){ //点击全部就拿所有数据
				   let name = this.address
				   this.cityData(name)
			   }else{
				   let city = this.address //根据tab按需数拿据
				   this.tabCity(city,name)
			   }
			},
			// 定位方法
			addRess(){
				addressdata()
				.then((res)=>{
					let city = res.result.ad_info.city //拿到定位的城市
					this.address = city //赋值定位到的城市给页面数据
					this.cityData(this.address)// 定位成功查询数据库取出该城市的数据
				})
				.catch((err)=>{
					this.address = '丰城市' //拒绝定位给个默认值
					let city = '丰城市'
					this.cityData(this.address) //使用默认值查询数据
				})
			},
			// 查询当前定位城市的数据
			cityData(city){
				listdata.where({
				  datainfo:{ 
					address:city
				  }
				})
				.orderBy('datainfo.time','desc')
				.get()
				.then((res)=>{ 
					let citydata = res.data// 赋值筛选到的数据
					this.resultCity(citydata)			
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 点击tab切换重新筛选数据
			tabCity(city,name){
				listdata.where({
				  datainfo:{
					address:city,  
					classdata:name
				  }
				})
				.get()
				.then((res)=>{
					// 赋值筛选到的数据
					let citydata = res.data
					this.resultCity(citydata)			
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 处理定位筛选到的数据方法
			resultCity(citydata){
				var adddata = citydata.map((item)=>{
					let id = item._id
					let datainfo = item.datainfo
					//return的是新数组的每一个值
					return{
						id,
						datainfo
					}
				})
				if(adddata.length === 0){
					this.nonedata = true// 如果没有数据，给予用户提示
				}else{
					this.nonedata = false// 有数据，隐藏没有数据的提示
				}
				this.localdata = adddata //处理完的数据赋值给数据数组
				this.homeload = false // 取消页面loading加载
				this.loadinglist = false// 取到数据,tab的loading消失
			},
			// 点击发表进入发表页面
			travels(){
				uni.navigateTo({
					url:'../travels/travels'
				})
			},
		},
		created() {
			this.addRess()// 进入页面开始定位
		}, 
		computed:{
			...mapState(['city','roturn']),
			citychange(){
				var address = this.city.citying // 实时监听 VueX中定位城市数据的变化
				this.addressData = address //赋值给当前页面数据
			},
			// 如果接收值为ture，表示用户发表游记成功，此刻刷新页面
			routing(){	// 实时监听roturn 只要调用过VueX的方法更新过roturn就触发
				if(this.roturn.pagesid == true){ 
					this.addRess() //重新定位请求数据 更新页面
				}
			}
		},
		watch: {	// watch只会执行一次
			addressData(newValue, oldValue) { //监听关联数据->VueX中定位数据
				this.address = newValue   //赋值给页面显示定位数据
				this.cityData(newValue) // 重新查询新改变的定位城市的数据
			}
		},
		onShareAppMessage(res) {
		    return {
		      title: '飞猪旅游',
		      path: '/pages/index/index'
		    }
		  },
	}
</script>

<style scoped>
	.publish image{width: 120upx !important; height: 100upx !important;
	border-radius: 40upx;
	} 
	.publish{position: fixed; bottom: 20upx; left: 0; right: 0;
	display: flex; justify-content: center;}
	/* 上拉加载的样式 */
	.load-more{margin-bottom: 120upx;
	display: flex;
	align-items: center;
	justify-content: center;}
</style>
