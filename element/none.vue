<template>
	<view class="nonedata">
		<image src="../static/tab/noimage.png" mode="widthFix"></image>
		<text>这里什么都没有</text>
	</view>
</template>

<script>
	export default{
		name:'nonedata'
	}
</script>

<style scoped>
	.nonedata image{width: 200upx; height: 200upx;}
	.nonedata text{display: block; font-size: 30upx;
	color: rgb(153, 153, 153);}
	.nonedata{text-align: center;}
</style>
