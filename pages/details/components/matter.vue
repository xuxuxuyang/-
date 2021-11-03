<template>
	<view>
		<!-- 图片视频介绍 -->
		<view class="cont-introduce cont-back">
			<view class="img-video imageText">图片视频介绍</view>
			<view>
				<video objectFit="fill" @error="videoErrorCallback" @play="playcall"  v-if="videoing"  :src="staticvideo" controls poster="http://h.thexxdd.cn/video/postimg.jpg"></video>
				<view>
				<block v-for="(items,index) in detaildata.staticimg" :key="index">
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
		},
		methods:{
			videoErrorCallback(e){},
			playcall(e){}
		},
		watch:{
			detaildata(newValue, oldValue){
				if(newValue.staticvideo != ''){
					this.staticvideo = newValue.staticvideo
					this.videoing = true
				}else{
					this.videoing = false //没有视频就隐藏
				}
			}
		}
		
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
