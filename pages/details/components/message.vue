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
				btnlist:true,// 禁掉发表按钮
				num:0, //控制分类的样式
				Comment:'',//评价内容
				newmessage:[],  //重组的的分类数组
				box:false,  //隐藏评论框
				avatarUrl:'',//用户头像
				nickName:'',//用户昵称
				ids:'',  //列表页的id
			}
		},
		methods:{
			// 弹出评论框
			popup(){
				users.get()// 弹出评论框前查看是否登录
				.then((res)=>{
				  if(res.data.length == 0){// length == 0说明没有用户信息，没有登录，提示登录
					  this.$nextTick(()=>{
					  	this.$refs.mon.init()
					  })
				  }else{
					let usermen = res.data[0]
					this.avatarUrl = usermen.avatarUrl
					this.nickName = usermen.nickName
					this.box = true// 弹出评论框
				  }
				})
				.catch((err)=>{
					console.log(err)
				})
				
			},
			// 取消评论隐藏评论框
			messcancel(){
				this.box = false
				this.Comment = ''//清空留言框
			},
			// 发表评论
			bTn(){
				if(this.Comment == ''){
					let tip = '评论不能为空'
					let icon = 'error'
					this.tips(tip,icon)
				}else{
					this.btnlist = false
					this.submit()// 先提交到百度ai进行评论分类，成功后，在提交到数据库
				}
			},
			async submit(){
				// 先提交到百度ai
				let stamess = await this.aiMessage()
				if(stamess.length === 0){
					let classif = ''// 返回空就提交空的上去
					await this.messbase(classif)// 提交到数据库
				}else{
					let ali = stamess[stamess.length-1]
					let [prop,adj] = [ali.prop,ali.adj]
					let classif = prop + adj
					await this.messbase(classif)// 提交到数据库
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
						let tip = '留言成功'
						let icon = 'success'
						this.tips(tip,icon)
						this.Comment = ''// 留言成功清空留言框
						this.btnlist = true
						let item = '全部'
						this.$parent.fatherMethod(item);// 子组件调用父组件方法
					})
					.catch((err)=>{
						console.log('提交出错')
					})
				})
			},
			// 请求分类数据
			menubtn(index,item){
				this.num = index
				this.$parent.fatherMethod(item);// 子组件调用父组件方法
			},
			// 提示框
			tips(tip,icon){
				this.HMmessages.show(tip,{icon:icon,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		watch:{
			messageword(newValue, oldValue){
				this.newmessage = ['全部',...newValue]
				this.num = 0
			},
			detaid(newValue, oldValue){
				this.ids = newValue // 列表页的id，将上传到数据库
			}
		}
	}
</script>

<style scoped>
	@import "../../../common/public.css";
</style>
