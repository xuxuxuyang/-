<template>
	<view>
		<view v-if="pageauth">
			<!-- 商家入驻表单-->
			<view class="authent">
				<view class="title">店铺信息</view>
				<view>
					<text>店铺名称</text>
					<input type="text" placeholder="请输入店铺全称" v-model="enterprise"/>
				</view>
				<!-- 上传店铺logo -->
				<view>
					<text>上传店铺logo</text>
					<!-- 上传图片 -->
					<view class="travels-image">
						<view class="topimg">
							<image src="../../static/img/topimg.png" mode="widthFix" @click="uploadImg()"></image>
						</view>
						<!-- 上传的图片 -->
						<view class="conteng">
							<block v-for="(item,index) in logoimg" :key="index">
								<view  class="conteng-img">
								<image :src="item" mode="aspectFill" class="uploadimg"></image>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<!-- 距离 -->
			<view class="distance"></view>
			<!-- 提交 -->
			<view class="release" :class="{ active: isActive }" @click="flagg && suBmitd()">
			提交
			</view>
		</view>
		<!-- 提示用户上传成功与否 -->
		<view class="warp" v-if="relend">
			<view class="warp-view tipmin">
				<text>{{reldata}}</text>
			</view>
		</view>
		<!-- 审核状态组件 -->
		<stateing ref="mon"></stateing>
	</view>
</template>

<script>
	import {uploadimage} from '../../common/list.js'
	import {uploads} from '../../common/uploads.js'
	// 引入审核组件
	import stateing from '../../element/stateing.vue'
	var db = wx.cloud.database()
	var users = db.collection('Authentication')
	// 上传静态资源的云存储文件
	var resou = 'Authentication'
	export default{
		components:{
			stateing
		},
		data() {
			return {
				relend:false,
				reldata:'正在提交...请勿关闭该页面',
				// 整个页面
				pageauth:false,
				flagg:false,
				isActive:false,
				enterprise:'',
				logoimg:[],
				
			}
		},
		methods:{
			// 被调用的审核组件
			compstate(staimg,title){
				this.$nextTick(()=>{   //dom更新循环结束之后的延迟回调
					this.$refs.mon.init(staimg,title)
				})
			},
			// 上传logo图片
			uploadImg(){
				//设置上传几张图片
				let many = 1
				uploadimage(many)
				.then((res)=>{
					this.logoimg = res
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 提交
			suBmitd(){
				// 提交显示正在提交提示组件
				this.relend = true
				this.userdata()	
			},
			// 上传认证数据
			async userdata(){
				// 等待上传logon完成
				let logoticimg = await this.logoticImg()
				// 上传所有数据到数据库
				await this.cloudData(logoticimg)
			},
			// 上传logo图片
			logoticImg(){
				return new Promise((resolve,reject)=>{
					uploads(this.logoimg,resou)
					.then((res)=>{
						resolve(...res)
					})
					.catch((err)=>{
						console.log(err)
						reject(err)
					})
				})
			},
			//上传表单数据
			cloudData(logoticimg){
				let datas = {
					enterprise:this.enterprise,
					logoimg:logoticimg,
				}
				wx.cloud.callFunction({
				  name:'authening',
				  data:{
					userDetail: datas,
					//控制是否审核成功
					examine:'Being'
				  }
				})
				.then((res)=>{
					// 提交成功隐藏提示和整个页面，显示正在审核
					this.relend = false
					this.pageauth = false
					// 弹出模态框
					let staimg = '../static/img/zhengzai.svg'
					let title = '正在审核中'
					// 调用审核方法
					this.compstate(staimg,title)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 审核状态
			statedatas(){
				users.get()
				.then((res)=>{
					let examine = res.data[0].examine
					if(examine && examine == 'Being'){
						// 正在审核中
						this.pageauth = false
						let staimg = '../static/img/zhengzai.svg'
						let title = '正在审核中'
						this.compstate(staimg,title)
					}else if(examine && examine == 'success'){
						// 审核成功
						this.pageauth = false
						let staimg = '../static/img/success.svg'
						let title = '已认证'
						this.compstate(staimg,title)
					}else if(examine && examine == 'fail'){
						// 审核失败
						this.pageauth = false
						let staimg = '../static/img/fail.svg'
						let title = '认证失败'
						this.compstate(staimg,title)
					}else if(!examine){
						this.pageauth = true
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
		},
		
		// 进入就获取审核状态
		mounted() {
			this.statedatas()
		},
		// 计算属性 一直监听是否表单填写完整
		computed:{
			testdata(){
				if(this.enterprise !=''  && this.logoimg.length != 0 ){
					this.isActive = true
					this.flagg = true
				}else{
					this.isActive = false
					this.flagg = false
				}
			}
		}
	}
</script>

<style scoped>
	@import "../../common/uni.css";
</style>
