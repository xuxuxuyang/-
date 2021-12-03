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
				this.num = index
				if(index === 0){
					this.backTop()
				}
				if(index != 0){
					this.$store.dispatch('navdata', index) // 把状态传到VueX 父组件实时监听 实现瞄点链接精准滚动
				}
			},
			// 点击滚动到顶部
			backTop(){
				if(wx.pageScrollTo){
					wx.pageScrollTo({
						scrollTop:0
					})
				}
			},
			
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
