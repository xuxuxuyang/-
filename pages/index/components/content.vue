<template>
			<view class="theme">
				<scroll-view scroll-x="true" class="scroll" scroll-with-animation="true">
					<view>
					<block v-for="(item, index) in tab" :key="index">
						<view @click="tabs(index,item.name)" class="list-cont" :class="{ active: index == num }">
							<view>
								<text :class="{ activea: index == num }" class="con-text-a">{{ item.name }}</text>
							</view>
							<view>
								<text :class="{ activeb: index == num }" class="con-text-b">{{ item.title }}</text>
							</view>
						</view>
					</block>
					</view>
				</scroll-view>
			</view>
</template>
<script>
	import {homelist} from "../../../common/cloudfun.js"
export default {
	name: 'cont',
	props:{
		tab:Array
	},
	data() {
		return {
			num: ''
		};
	},
	methods: {
		tabs(index,nav) {
			this.num = index;
			let loading = true// tab切换改变tab切换loading状态
			let pageid = 0// tab切换把上拉加载的pageid值置为0
			let uniload = false// 隐藏上拉加载的loading
			let nonedata = false// tab切换隐藏没有数据的提示
			let stateload = 'loading'// 把上拉加载的状态设为正在加载中
			//  传nav值到index页面执行上拉加载 以对象形式传值 把所有的状态都存到vueX中
			let pullobj = {
				loading:loading,
				pageid:pageid,
				nav:nav,
				uniload:uniload,
				nonedata:nonedata,
				stateload:stateload
			}
			this.$store.commit('navmuta', pullobj)
			// 请求数据库数据
			let listing = 'Commodity'//进入页面展示的列表数据
			let typedatas = nav
			let listid = 0
			homelist(listing,typedatas,listid)
			.then((res)=>{ 
				if(res.data.length === 0){
					let nonedata = true//没有数据显示无数据提示
					this.$store.commit('nonemuta',nonedata)// 更新VueX管理的数据状态
				}else{
					let nonedata = false
					this.$store.commit('nonemuta',nonedata)
				}
				let listdata = res.data
				this.$store.commit('listmuta',listdata)//更新VueX管理的数据状态
				let loading = false
				this.$store.commit('loadmuta', loading)// 改变tab切换loading状态
			})
			.catch((err)=>{
				console.log(err)
			})
		}
	}
};
</script>

<style scoped>
.activea {
	color: #292c33 !important;
	font-size: 31upx !important;
}
.activeb {
	color: #292c33 !important;
	font-size: 23upx !important;
}
.active {
	background-image: linear-gradient(to right, #ccffff 0%, #ffcc00 100%);
	border-top-right-radius: 50upx;
}

.scroll{ white-space: nowrap;
	width: 100%;
	position: absolute; left: 0; right: 0;
	background: #FFFFFF;
	padding: 20upx 0;
	}
	
.con-text-a {
	color: #292c33;
	font-size: 30upx;
	font-weight: bold;
}
.con-text-b {
	color: #9ea0a5;
	font-size: 23upx;
}
.list-cont {
	width: 180upx;
	display: inline-block;
	text-align: center;
}

</style>
