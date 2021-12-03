<template>
	<view>
		<!-- 标题 -->
		<view class="cont-back businflex">
			<view class="businessing">
				<view>
					<image :src="detaildata.logoimg" mode="widthFix"></image>
				</view>
				<view class="businessing-text">
					<text>{{detaildata.enterprise}}</text>
					<text>认证商家</text>
				</view>
			</view>
			<view class="baby">全部宝贝</view>
			<view class="shop">进店逛逛</view>
		</view>
		<!-- 产品说明 -->
		<view class="cont-back" style="margin-top: 20upx;">
			<view class="business-product">产品说明</view>
			<view class="business-city">
				<view>出发地</view>
				<view>{{strdata}}</view>
			</view>
			<view class="business-city">
				<view>目的地</view>
				<view>{{detaildata.destination}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			detaildata:Object
		},
		data() {
			return {
				strdata:''
			}
		},
		watch:{
			detaildata(newValue, oldValue){
				let setdata = newValue.setdata
				var str = "";
				setdata.forEach((item)=>{
					str += item + ','
				})
				// 去掉最后一个逗号
				if(str.length > 0){
					this.strdata = str.substr(0,str.length - 1)
				}
			}
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
	.businessing image{width: 80upx !important; height: 80upx !important; border-radius: 10upx;}
	.businessing text{display: block;}
	.businessing{display: flex; align-items: center;}
	.businessing-text text:nth-child(1){color: #333333; font-size: 30upx;
	font-weight: bold; padding-bottom: 8upx;}
	.businessing-text text:nth-child(2){color: #333333; font-size: 20upx;
	border: 1rpx solid #ffe11d; border-radius: 50upx;
	text-align: center;
	width: 120upx;
	height: 33upx;
	line-height: 33upx;
	}
	.businessing-text{padding-left: 20upx;}
	/* 2 */
	.baby{font-size: 28upx; color: #fca705;
	border: 1rpx solid #fca705;
	border-radius: 50upx;
	text-align: center;
	width: 150upx;
	height: 60upx;
	line-height: 60upx;}
	.shop{font-size: 28upx; color: #333333;
	background: linear-gradient(to right, #ffe11d 10%, #ffd00f 80%);
	text-align: center;
	border-radius: 50upx;
	width: 150upx;
	height: 60upx;
	line-height: 60upx;}
	/* 3 */
	.businflex{display: flex; justify-content: space-between;
	align-items: center;
	margin-top: 20upx;
	}
	/* 产品说明 */
	.business-product{color: #333333;
		font-size: 30rpx;
		font-weight: bold;
		padding-bottom: 20upx;
		}
	.business-city{display: flex; font-size: 28upx;
	height: 100upx;
	border-top: 1rpx solid #f8f8f8;
	align-items: center;}
	.business-city view:nth-child(1){
		width: 200upx;
		color: #999999;
	}	
	.business-city view:nth-child(2){
		color: #333333;
	}	
</style>
