<template>
	<view class="content">
		<block v-for="(item,index) in shop" :key="index">
			<view class="content-view">
				<view class="content-img">
					<image :src="item.wholedata.Coverimg" mode="aspectFill"></image>
				</view>
				<view class="content-title">
					<text>{{item.wholedata.title}}</text>
					<text>{{item.wholedata.describe}}</text>
				</view>
			</view>
		</block>
		<!-- 审核状态 -->
		<stateing ref="mon" v-if="shopif"></stateing>
	</view>
</template>
<script> 
	// 引入审核组件
	import stateing from '../../element/stateing.vue'
	export default {
		components:{
			stateing
		},
		data() {
			return {
				shopif:true,
				shop:[]
			}
		},
		onShow() {
			this.shopdata()
		},
		methods: {
			shopdata(){
				wx.cloud.callFunction({
				  name:'shopdata',  //调用云函数 云函数里获取数据库数据
				})
				.then((res)=>{
					let shopDatas = res.result.result.data
					if(shopDatas.length == 0){
						let staimg = '../static/img/noimage.png'
						let title = '你还没有发布商品'
						this.compstate(staimg,title)
					}else{
						this.shop = shopDatas
						this.shopif = false
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 被调用的审核组件
			compstate(staimg,title){
				this.$nextTick(()=>{  //dom更新循环结束之后的延迟回调
					this.$refs.mon.init(staimg,title)
				})
			}
		}
	}
</script>

<style scoped>
	.content{margin: 10upx;}
	text{display: block;}
	.content-view{display: flex; justify-content: space-between;
	height: 200upx !important; overflow: hidden;
	border-bottom: 1rpx solid #E4E8EB; padding-bottom: 5upx;
	margin-bottom: 20upx;
	}
	.content-img{width: 300upx !important; height: 200upx !important;
	}
	.content-img image{width: 100%; height: 100%; border-radius: 10upx;}
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
	}
	.content-title text:nth-child(2){
		font-size: 28upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-top: 20upx;
	}
</style>
