<template>
	<view class="active">
		<view class="conteng">
			<block v-for="(item,index) in Articleend" :key="index">
			<view class="conteng-article" @click="localCont(item._id)">
				<view  class="conteng-img">
				<image :src="item.wholedata.Coverimg" mode="aspectFill" class="animated fadeIn"></image>	
				</view>
				<!-- 文字介绍 -->
				<view class="active-introduce">
					<view class="active-name">{{item.wholedata.title}}</view>
					<view class="active-title">{{item.wholedata.describe}}</view>
					<view class="active-label">{{item.wholedata.label}}</view>
					<view class="purchase">
						<text class="active-price">￥{{item.wholedata.price}}</text>
						<text class="active-purchase">999+人已购</text>
					</view>
				</view>
			</view>
			</block>
		</view>
	</view> 
</template>

<script>
	export default{
		name:'Article',
		props:{
			Articleend:Array
		},
		methods:{
			localCont(id){
				uni.navigateTo({
					url:'../business/business?id=' + id // 点击带id进入详情页
				})
			}
		}
	}
</script>

<style scoped="scoped">
	@import "../../../common/uni.css";
</style>
