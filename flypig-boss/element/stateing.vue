<template>
	<view v-if="modaishow">
		<view class="stateing">
			<image :src="staimg" mode="widthFix"></image>
			<text>{{title}}</text>
		</view>
	</view>
	
</template>

<script>
	export default{
		data() {
			return {
				title: '',
				staimg:'',
				modaishow:false
			}
		},
		methods:{
			init(staimg,title){
				this.modaishow = true
				this.staimg = staimg
				this.title = title
			},
		}
	}
</script>

<style scoped>
	.stateing image{width: 200upx; height: 200upx;}
	.stateing text{font-size: 35upx; display: block; padding-top: 30upx;}
	.stateing{text-align: center; padding-top: 150upx;}
</style>
