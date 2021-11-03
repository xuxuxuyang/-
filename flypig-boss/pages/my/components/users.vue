<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
				<view class="wx-name">
					<view><image :src="username.avatarUrl"></image></view>
					<view class="wx-text">
						<text>{{ username.nickName }}</text>
						<text>{{nothave}}</text>
					</view>
				</view>
		</view>
		<!-- 列表 -->
		<view class="user-list">
			<block v-for="(item,index) in busindata" :key="index">
			<view @click="auTH(item.url)">
				<image :src="item.image" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		username:Object,
		nothave:String
	},
	data() {
		return {
			busindata:[
				{
					"image":"../../../static/img/renzheng.svg",
					"name":"入驻认证",
					"url":"../authentication/authentication"
				},
				// {
				// 	"image":"../../../static/img/dingdan.svg",
				// 	"name":"用户订单",
				// 	"url":"../authentication/authentication"
				// },
				// {
				// 	"image":"../../../static/img/shuangshiyi.svg",
				// 	"name":"商家",
				// 	"url":"../authentication/authentication"
				// },
				// {
				// 	"image":"../../../static/img/chujing.svg",
				// 	"name":"出境游",
				// 	"url":"../authentication/authentication"
				// }
			]
		};
	},
	methods:{
		auTH(url){
			uni.navigateTo({
				url: url,
			});
		}
	}
};
</script>

<style scoped>
.myhome {
	background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
	height: 350upx;
	display: flex;
	align-items: center;
}
.wx-name image {
	width: 120upx !important;
	height: 120upx !important;
	border-radius: 50%;
	margin-right: 20upx;
	border: 10rpx solid #999999;
}
.wx-text text {
	display: block;
	margin: 10upx 0;
	color: #999999;
}
.wx-name {
	display: flex;
	align-items: center;
	padding: 0 30upx;
	align-content: center;
	height: 200upx;
}
.wx-text text:nth-child(1) {
	font-size: 35upx;
}
.wx-text text:nth-child(2) {
	font-size: 20upx;
	border: 1px solid #ffffff;
	padding: 7upx;
	border-radius: 50upx;
	text-align: center;
}
.user-list{background: #ffffff; display: flex; justify-content: space-around; text-align: center;
margin: 20upx; border-radius: 20upx;
height: 200upx;
align-items: center;}
.user-list image{width: 50upx; height: 50upx;}
.user-list text{font-size: 25upx; display: block; color: #777777;}
</style>
