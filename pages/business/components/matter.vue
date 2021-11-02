<template>
	<view>
		<!-- 图片视频介绍 -->
		<view class="cont-introduce cont-back">
			<view class="img-video imageText">图文介绍</view>
			<view>
				<view>
				<block v-for="(items,index) in detaildata.Details" :key="index">
				<image :src="items" mode="widthFix"></image>
				</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'matter',
		props:{
			detaildata:Object
		},
		data() {
			return {
				videoing:false,
				staticvideo:''
			}
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
