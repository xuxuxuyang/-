<template>
	<view>
		<!-- banner -->
		<view class="banner-posi">
			<view>
				<swiper :indicator-dots="true"  :interval="3000" :duration="1000" :circular="true" 
				indicator-color="rgba(255, 255, 255)" indicator-active-color="#00ff00"
				@change="bannerfun">
					<block v-for="(item,index) in imgArray" :key="index">
					<swiper-item>
						<view class="swiper-item">
							<image :src="item" mode="aspectFill" class="imageurl" @click="previmg(index)"></image>
						</view>
					</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 轮播数字 -->
			<view class="banner-num">
				<text>{{bannerindex + 1}}</text>
				<text>/{{imgArray.length}}</text>
			</view>
		</view>
			<!-- 标题 -->
			<view class="cont-back">
				<view class="title-con">{{detaildata.tipsdata}}</view>
				<!-- 销量之类 -->
				<view class="volume">
					<text>5分 超出预期</text>
					<text>评论{{leaveword.length}}条</text>
					<text>特别推荐</text>
				</view>
			</view>
			
	</view>
</template>

<script>
	// 引入公用预览图片
	import { preview} from '../../../common/list.js'
	export default{
		name:'details',
		props:{
			detaildata:Object,
			leaveword:Array
		},
		data() {
			return {
				imgArray:[],//轮播图数据
				navDatas:'',
				bannerindex:0,//轮播图滚动对应图片数字
			}
		},
		methods:{
			// 滚动到第几张图片
			bannerfun(e){
				this.bannerindex = e.detail.current
			},
			// 预览图片
			previmg(index){
				let imglist = this.imgArray
				preview(index,imglist)
				.then((res)=>{})
				.catch((err)=>{
					console.log(err)
				})
			},
		},
		watch:{
			detaildata(newValue, oldValue){
				// slice(start,end)：方法可从已有数组中返回选定的元素，返回一个新数组，包含从start到end（不包含该元素）的数组元素。(不会改变原数组)
				let imgArray = newValue.staticimg.slice(0,3) 
				this.imgArray = imgArray
			},
			
		}
	}
</script>

<style scoped>
	
	@import "../../../common/public.css";
	 
</style>
