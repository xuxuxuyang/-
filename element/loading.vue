<template>
	<view>
	<view class="loading">
		<view class="loader"></view>
	</view>
	</view>
</template>

<script></script>

<style scoped>
	.loading{
	display: flex;
	justify-content: center;
	padding: 30upx 0;}
.loader {
	display: inline-block;
	width: 40upx;
	height: 40upx;
	color: inherit;
	border: 7upx solid greenyellow;
	border-bottom-color: transparent;
	border-radius: 50%;
	-webkit-animation: 1s loader linear infinite;
	animation: 1s loader linear infinite;
}
@-webkit-keyframes loader {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes loader {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
</style>
