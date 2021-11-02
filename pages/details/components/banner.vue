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
				<text>{{bannerindex + num}}</text>
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
				imgArray:[],
				navDatas:'',
				bannerindex:0,
				num:1,
				len:'',
				top:'',
				images:[
					{
						'img':'https://img.alicdn.com/bao/uploaded/i2/3820299323/O1CN01PEqaH82Ijz1ZsaLxH_!!3820299323.jpg_640x640q30.jpg_.webp'
					},
					{
						'img':'https://img.alicdn.com/bao/uploaded/i2/3820299323/O1CN01PHdAEV2Ijz1YzsqS0_!!3820299323.jpg_640x640q30.jpg_.webp'
					},
					{
						'img':'https://img.alicdn.com/bao/uploaded/i3/3820299323/O1CN01s0kRQM2Ijz3SHKs3F_!!3820299323.jpg_640x640q30.jpg_.webp'
					}
				],
				imgvideo:[
					{
						'video':'http://h.thexxdd.cn/list/yuanfang.mp4',
						img:[
							{
								'image':'http://gw.alicdn.com/imgextra/i3/3820299323/TB2ZoDEfXkoBKNjSZFkXXb4tFXa_!!3820299323.jpg_q60.jpg_.webp',
							},
							{
								'image':'http://gw.alicdn.com/imgextra/i3/3820299323/TB2ZoDEfXkoBKNjSZFkXXb4tFXa_!!3820299323.jpg_q60.jpg_.webp',
							},
							{
								'image':'http://gw.alicdn.com/imgextra/i3/3820299323/TB2ZoDEfXkoBKNjSZFkXXb4tFXa_!!3820299323.jpg_q60.jpg_.webp',
							}
						]
					}
				],

			}
		},
		created() {
			console.log(this.imgvideo)
			this.len = this.images.length
		},
		mounted() {
			// 取到节点距离顶部的距离
			// this.scTop()
		},
		methods:{
			// 滚动到第几张图片
			bannerfun(e){
				this.bannerindex = e.detail.current
			},
			// 预览图片
			previmg(index){
				// console.log(index)
				let imglist = this.imgArray
				// var imglist = img.map((item)=>{
				// 	return item
				// })
				// console.log(imglist)
				preview(index,imglist)
				.then((res)=>{
					console.log(res)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			
		},
		
		watch:{
			detaildata(newValue, oldValue){
				console.log(newValue.staticimg.slice(0,3))
				let imgArray = newValue.staticimg.slice(0,3)
				this.imgArray = imgArray
			},
			
		}
	}
</script>

<style scoped>
	
	@import "../../../common/public.css";
	 
</style>
