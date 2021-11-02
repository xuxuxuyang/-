<template>
	<view>
		<view class="navs">
			<block v-for="(item, index) in navalue" :key="index">
			<text :class="{ navactivetext: index == num }" @click="navbtn(index)">{{item.name}}</text>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		name:'navs',
		data() {
			return {
				num:0,
				navalue:[
					{
						'name':'宝贝'
					},
					{
						'name':'详情'
					},
					{
						'name':'评价'
					}
				]
			}
		},
		methods:{
			navbtn(index){
				this.num = index //控制是否加上样式
				if(index === 0){ //点击第一位
					this.backTop()
				}
				if(index != 0){
					this.$store.dispatch('navdata', index)// vuex传值到banner页面
				}
			},
			// 点击回到顶部
			backTop(){
				wx.pageScrollTo({
					scrollTop:0
				})
			},
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
