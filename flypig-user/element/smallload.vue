<template>
	<view class="loadmin">
		<view class="home-load">
			<image src="../static/tab/samload.svg" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
	.home-load image{width: 90upx; height: 90upx;
					background: rgba(0,0,0,.2);
					border-radius: 10upx;
				 }
	.home-load{display: flex;
				 justify-content: center;
				 align-items: center;
				 width: 100%; height: 100%;}
	.loadmin{
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 9999;
			overflow: hidden;
			background: rgba(255, 255, 255,0.2);
			}			 
</style>
