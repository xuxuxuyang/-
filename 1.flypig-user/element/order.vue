<template>
	<view class="nonedata" v-if="odermin">
		<image src="../static/tab/gouwuche.png" mode="widthFix"></image>
		<text>{{orderdata}}</text>
	</view>
</template>

<script>
	export default{
		name:'oederdata',
		data() {
			return {
				odermin:false,
				orderdata: ''
			}
		},
		methods:{
			init(value,orderdata){
				this.odermin = value
				this.orderdata = orderdata
			},
		}
	}
</script>

<style scoped>
	.nonedata image{width: 300upx; height: 200upx;}
	.nonedata text{display: block; font-size: 30upx;
	color: rgb(153, 153, 153);}
	.nonedata{text-align: center; padding-top: 70upx;}
</style>
