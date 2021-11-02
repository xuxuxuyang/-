<template>
	<view>
		<!-- 评论 -->
			<view class="cont-message cont-back" id="message">
				<view class="img-video" >宝贝评价({{leaveword.length}})</view>
				<!-- 分类 -->
				<view class="menu-block">
					<block v-for="(item,index) in newmessage" :key="index">
						<view :class="{ activetext: index == num }" @click="menubtn(index,item)">{{item}}</view>
					</block>
				</view>
				<!-- 评价 -->
				<block v-for="(item,index) in leaveword" :key="index">
				<view class="message-dist">
					<view class="users-message">
						<view class="cont-name">
							<image :src="item.avatarUrl" mode="widthFix"></image>	
							<text>{{item.nickName}}</text>
						</view>
						<!-- 时间 -->
						<view class="message-time">
							{{item.time.substr(0,10)}}
						</view>
					</view>	
					<view class="cont-name-text">
						<text>{{item.usermess}}</text>
					</view>
				</view>
				</block>
			</view>
			
			<!-- 评论按钮 -->
			<view class="evaluation" @click="popup()">
				<input type="text" placeholder="我来说两句" disabled="disabled"/>
			</view>
		
			<!-- 评论框 -->
			<view class="Comment-box" v-if="box" :catchtouchmove="true">
				<view class="Comment-text">
					<textarea  placeholder="写下你对这篇游记的评价"  v-model="Comment" show-confirm-bar="false" focus="true"/>
				</view>
				<!-- 发表按钮 -->
				<view class="published">
					<view @click="messcancel()">取消</view>
					<view @click="btnlist && bTn()">发表</view>
				</view>
			</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		
		<!-- 引入模态框 -->
		<motal ref="mon"></motal>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入模态组件
	import motal from '../../../element/modal.vue'
	var util = require('../../../common/util.js');
	var time = util.formatTime(new Date());
	// 引入数据库
	var db = wx.cloud.database()
	var users = db.collection('user')
	export default{
		name:'messages',
		components:{
			HMmessages,
			motal
		},
		props:{
			leaveword:Array,
			messageword:Array,
			detaid:String
		},
		data() {
			return {
				// 禁掉发表按钮
				btnlist:true,
				num:0,
				Comment:'',
				newmessage:[],  //重组的的分类数组
				box:false,  //隐藏评论框
				avatarUrl:'',	//用户头像昵称
				nickName:'',
				ids:'',  //列表页的id，将上传到数据库
				usermessage:[
					{
						'head':'http://h.thexxdd.cn/video/postimg.jpg',
						'name':'星星点灯',
						'message':'一路体验很好 虽说是拼车只有一天时间 可是遇到都是很好说话的伙伴 司机兼摄影师小磊小哥哥又帅又负责，拍照技术还杠杠的，顶着大理能烤人的太阳一个个给我们拍照！五星好评没话说！附上美照嘿嘿 ps:运气好碰上了好天气，怎么拍都是大片范儿！'
					},
					{
						'head':'http://h.thexxdd.cn/video/postimg.jpg',
						'name':'星星点灯',
						'message':'一路体验很好 虽说是拼车只有一天时间 可是遇到都是很好说话的伙伴 司机兼摄影师小磊小哥哥又帅又负责，拍照技术还杠杠的，顶着大理能烤人的太阳一个个给我们拍照！五星好评没话说！附上美照嘿嘿 ps:运气好碰上了好天气，怎么拍都是大片范儿！'
					},
					{
						'head':'http://h.thexxdd.cn/video/postimg.jpg',
						'name':'星星点灯',
						'message':'一路体验很好 虽说是拼车只有一天时间 可是遇到都是很好说话的伙伴 司机兼摄影师小磊小哥哥又帅又负责，拍照技术还杠杠的，顶着大理能烤人的太阳一个个给我们拍照！五星好评没话说！附上美照嘿嘿 ps:运气好碰上了好天气，怎么拍都是大片范儿！'
					}
				]
			}
		},
		methods:{
			// 弹出评论框
			popup(){
				// 登录在评论
				users.get()
				.then((res)=>{
				    console.log(res)
					// length == 0说明没有用户信息，没有登录，提示登录
				  if(res.data.length == 0){
					  this.$nextTick(()=>{
					  	this.$refs.mon.init()
					  })
				  }else{
					  // 已经登录
					console.log('已经登录')
					  // 取到用户头像，昵称，oppenid暂存
					let usermen = res.data[0]
					this.avatarUrl = usermen.avatarUrl
					this.nickName = usermen.nickName
					// 弹出评论框
					this.box = true
				  }
				})
				.catch((err)=>{
					console.log(err)
				})
				
			},
			
			// 隐藏评论框
			messcancel(){
				this.box = false
				// 取消留言清空留言框
				this.Comment = ''
			},
			
			// 发表评论
			bTn(){
				if(this.Comment == ''){
					let tip = '评论不能为空'
					let icon = 'error'
					this.tips(tip,icon)
				}else{
					console.log('可以提交')
					this.btnlist = false
					// 先提交到百度ai进行评论分类，成功后，在提交到数据库，
					this.submit()
				}
			},
			
			async submit(){
				// 先提交到百度ai
				let stamess = await this.aiMessage()
				console.log(stamess)
				if(stamess.length === 0){
					console.log('不提交')
					// 返回空就提交空的上去
					let classif = ''
					// 提交到数据库
					await this.messbase(classif)
				}else{
					console.log(stamess[stamess.length-1])
					let ali = stamess[stamess.length-1]
					let [prop,adj] = [ali.prop,ali.adj]
					console.log(prop + adj)
					let classif = prop + adj
					// 提交到数据库
					await this.messbase(classif)
				}
			},
			
			// 调用云函数，评论分类
			aiMessage(){
				return new Promise((resolve,reject)=>{
					wx.cloud.callFunction({
					      name:'aimessage',
					      data:{
					        message: this.Comment
					      }
					})
					.then((res)=>{
						console.log(res)
						let aidata = res.result.aimessage.items
						resolve(aidata)
					})
					.catch((err)=>{
						reject('出错了')
					})
				})
				
			},
			
			
			// 提交到数据库
			messbase(classif){
				return new Promise((resolve,reject)=>{
					// 以对象形式提交
					var messarray ={
						usermess:this.Comment,
						time:time,
						avatarUrl:this.avatarUrl,
						nickName:this.nickName
					}
					
					let mess = db.collection('message')
					mess.add({
						data:{
							id:this.ids,
							classmessage:classif,
							messagedata:messarray
						}
					})
					.then((res)=>{
						console.log(res)
						let tip = '留言成功'
						let icon = 'success'
						this.tips(tip,icon)
						// 留言成功清空留言框
						this.Comment = ''
						this.btnlist = true
						// 子组件调用父组件方法
						let item = '全部'
						this.$parent.fatherMethod(item);
					})
					.catch((err)=>{
						console.log('提交出错')
					})
				})
			},
			
			// 请求分类数据
			menubtn(index,item){
				console.log(item)
				this.num = index
				// 子组件调用父组件方法
				this.$parent.fatherMethod(item);
			},
			
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		
		watch:{
			messageword(newValue, oldValue){
				console.log(newValue)
				this.newmessage = ['全部',...newValue]
				this.num = 0
				console.log(this.newmessage)
			},
			// 列表页的id，将上传到数据库
			detaid(newValue, oldValue){
				console.log(newValue)
				this.ids = newValue
			}
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
