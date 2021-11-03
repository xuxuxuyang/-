<template>
	<view>
	<view class="swiper-srar">
		<view class="search-posi">
		<view class="search-cont">
			<view class="search-code">
				<image src="../../../static/tab/saoma.svg" mode="widthFix"></image>
			</view>
			<view class="search" @click="searchPage()">
				<image src="../../../static/tab/sousuo.svg" mode="widthFix"  class="search-img"></image>
				<input type="text" value="请输入关键字" placeholder-class="inputclass" disabled/>
			</view>
			<view class="search-code">
				<image src="../../../static/tab/xiaoxi.svg" mode="widthFix"></image>
			</view>
		</view>
		</view>
		<!-- 轮播 -->
		<view>
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true"
			indicator-color="rgba(255, 255, 255)" indicator-active-color="#00ff00">
				<block v-for="(item,index) in banner" :key="index">
				<swiper-item>
					<view class="swiper-item" id="swiper-item">
						<image :src="item.image" mode="aspectFill" class="imageurl animated fadeIn"></image>
					</view>
				</swiper-item>
				</block>
			</swiper>
		</view>
	</view>
	</view>
</template>

<script>
	export default{
		name:'searchlist',
		props:{
			banner:Array
		},
		data(){
			return{
			}
		},
		methods:{
			//跳转到搜索页面
			searchPage(){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.search{
	    height: 70upx;
		line-height: 70upx;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
		background:#fff7d4;
		border-top-left-radius: 50upx;
		border-bottom-left-radius: 50upx;
		border-bottom-right-radius:50upx;
		}
	.search-img{margin: auto 0 auto 20upx; width: 40upx; height: 40upx;} 	
	.search input{
			height: 70upx;
			line-height: 70upx;
	        width: 100%;
	        font-size: 30upx;
			color: #666666; 
			  } 
	.search-cont{display: flex; justify-content: space-between; height: 70upx; align-items: center;
				background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
				padding: 30upx 0;
				}	
	.search-code image{width: 50upx; height: 50upx;}
	.search-code{width: 50upx; height: 50upx; padding: 0 15upx;}
	/* 轮播 */
	.imageurl{width: 100%; height: 300upx !important;}
	swiper{height: 300upx !important;}
	/* 定位 */
	/* .swiper-srar{position: relative; height: 350upx;}
	.search-posi{position: absolute; top: 15upx; left: 0; right: 0; z-index: 99999;} */
</style>
