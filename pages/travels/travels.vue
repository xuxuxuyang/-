<template>
	<view>
		<view  class="travels">
			<!-- 分类 -->
			<view class="classify-view">
				<view class="classify-text">分类</view>
				<block v-for="(item,index) in fication" :key="index">
				<view class="classify">
					<text :class="{ activetext: index == num }" @click="menubtn(index,item.name)">{{item.name}}</text>
				</view>
				</block>
			</view>
			<!-- 标题 -->
			<view class="travels-title">
				<input type="text" placeholder="给旅行日记起个标题吧" class="place-text" v-model="titledata"/>
			</view>
			<!-- 描述 -->
			<view class="travels-describe">
				<textarea  placeholder="描述下你的旅行心得,帮助更多旅行的人" v-model="tipsdata"/>
			</view>
		</view>
		<!-- 上传图片 -->
		<view class="travels-image">
			<view class="topimg">
				<image src="../../static/tab/topimg.png" mode="widthFix" @click="uploadImg()"></image>
			</view>
			<!-- 九宫格 -->
				<view class="conteng">
					<block v-for="(item,index) in topimg" :key="index">
						<view  class="conteng-img">
						<image :src="item" mode="aspectFill" @click="preImage(index)" class="uploadimg"></image>
						<image src="../../static/tab/deteimg.svg" mode="widthFix" class="deleteimg" @click="deleteImg(index)"></image>
						</view>
					</block>
				</view>
		</view>
		<!-- 上传视频 -->
		<view class="travels-video">
			<view class="topimg">
				<image src="../../static/tab/topvideo.png" mode="widthFix" @click="uploadVideo()"></image>
			</view>
			<view class="uploadvideo" v-if="uploadvideos">
				<video :src="videos" controls objectFit="cover" poster="http://h.thexxdd.cn/video/postimage.jpg"></video>
				<image class="pause" src="../../static/tab/delvideo.png" @click="deleteVideo()"></image>
			</view>
		</view>
	
		<!-- 定位 -->
		<view class="address">
			<view class="address-text">你在哪里</view>
			<view class="address-site">
				<image src="../../static/tab/addimg.svg" mode="widthFix"></image>
				<text @click="chooseCity()">{{address}}</text>
			</view>
		</view>
		
		<!-- 发布 -->
		<view class="release" @click="suBmitd()">
			发布
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		<!-- 提示框 -->
		<view class="warp tiplist" v-if="relend">
			<view class="warp-view tipmin">
				<text>{{reldata}}</text>
			</view>
		</view>
		<!-- 引入登录提示模态框 -->
		<motal ref="mon"></motal>
	</view>
</template>

<script>
	// 引入公用预览图片
	import { preview,addressdata } from '../../common/list.js'
	import {mapState} from 'vuex'
	// 引入当前时间js
	var util = require('../../common/util.js');
	var time = util.formatTime(new Date());
	// 引入弹窗组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// 引入登录提示模态组件
	import motal from '../../element/modal.vue'
	var db = wx.cloud.database()
	var users = db.collection('user')
	export default{
		name:'travels',
		components:{
			HMmessages,
			motal
		},
		data() {
			return {
				num:0,
				fication: [
					{
						"name":'景点'
					},
					{
						"name":'美食'
					},
					{
						"name":'网红打卡'
					}
				],
				// 上传的图片
				topimg:[],
				uploadvideos:false,
				videos:'',  //上传的视频
				address:'丰城市',
				// 以下是提交的暂存数据
				classdata:'景点',  //类型
				titledata:'',  //标题
				tipsdata:'', //心得
				modaishow:false,   //模态框显示状态
				// 用户信息
				avatarUrl:'',
				nickName:'',
				openid:'',
				// 发布提示
				reldata:'正在发布...请勿关闭该页面',
				relend:false,
				watchaddress:''   //监听用户选择的城市
			}
		},
		
		methods:{
			// 切换tab
			menubtn(index,name){
				this.num = index
				this.classdata = name 
			},
			// 上传图片
			uploadImg(){
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res.tempFilePaths[0])
						this.topimg.push(...res.tempFilePaths)
					},
					fail: (err) => {
						console.log(err)
					}
				})
				
			},
			// 预览图片
			preImage(index){
				let imglist = this.topimg
				console.log(imglist)
				console.log(index)
				preview(index,imglist)
				.then((res)=>{
					console.log(res)
				})
				.catch((err)=>{
					console.log(err)
				})
				
			},
			
			// 删除图片
			deleteImg(index){
				this.topimg.splice(index, 1)
			},
			
			// 上传视频
			uploadVideo(){
				uni.showLoading({
						title: '上传中'
				});
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					maxDuration:20
				})
				.then((res)=>{
					this.videos = res[1].tempFilePath
					this.uploadvideos = true
					uni.hideLoading();
				})
				.catch((err)=>{
					uni.hideLoading();
				})
			},
			// 删除视频
			deleteVideo(){
				this.videos = ''
				this.uploadvideos = false
			},
			
			// 定位
			addRess(){
				// 定位
				addressdata()
				.then((res)=>{
					let city = res.result.ad_info.city
					this.address = city
				})
				.catch((err)=>{
					console.log('点了拒绝定位');
					this.address = '丰城市'
				})
			},
			// 选择城市
			chooseCity(){
				uni.navigateTo({
					url:'../city/city'
				})
			},
			// 发布
			suBmitd(){
				if(this.titledata == ''){
					let tip = '请填写标题'
					this.proMpt(tip)
				}else if(this.tipsdata == ''){
					let tip = '请填写描述'
					this.proMpt(tip)
				}else if(this.topimg.length < 3){
					let tip = '上传的图片不少于三张'
					this.proMpt(tip)
				}else{
					console.log('可以提交')
					// 判断是否登录
					this.userinfo()
				}
			},
			// 判断是否登录再提交
			userinfo(){
				// 请求用户信息数据库看看有没有存在用户信息
				users.get()
				.then((res)=>{
					// length == 0说明没有用户信息，没有登录，提示登录
				  if(res.data.length == 0){
					 this.$nextTick(()=>{
					 	this.$refs.mon.init()
					 })
				  }else{
					  // 已经登录
					  // 取到用户头像，昵称，oppenid暂存
					let usermen = res.data[0]
					this.avatarUrl = usermen.avatarUrl
					this.nickName = usermen.nickName
					this.openid = usermen._openid
					// console.log(this.avatarUrl,this.nickName,this.openid)
					// 上传用户提交的数据到云存储和数据库
					// 提示正在发布的及时反馈
					this.relend = true
					this.userdata()
				  }
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 上传用户提交的数据到云存储和数据库
			async userdata(){
				// 上传之前需要先把图片视频静态文件上传到云存储返回链接再把链接同其他字符串一并上传到数据库，分两步
				// 先等待图片上传到云储存
				let staticimg = await this.staticImg()
				// console.log(staticimg)
				// 等待视频上传到云存储成功
				let staticvideo = await this.staticVideo()
				// 最后上传所有数据到云数据库
				await this.cloudData(staticimg,staticvideo)
			},
			
			// 上传图片视频文件到云储存
			staticImg(){
				// 把返回的fileid合并成数组
				var imgfileID = []
				return new Promise((resolve,reject)=>{
					this.topimg.forEach((img)=>{
						const imgion = img.lastIndexOf('.');
						// console.log(imgion)
						const eximg = img.slice(imgion);
						// console.log(eximg)
						const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${eximg}`;
						wx.cloud.uploadFile({
						    cloudPath: "static/" + cloudPath, // 上传至云端的路径
						    filePath: img // 要上传的文件
						})
						.then((res)=>{
							// 形成数组
							imgfileID.push(res.fileID)
							// 判断云储存的图片长度是否和用户上传的图片一样多
							if(imgfileID.length == this.topimg.length){
								resolve(imgfileID)
							}
						})
						.catch((err)=>{
							console.log(err)
						})
					})
					
				})
			},
			
			// 上传视频到云储存
			staticVideo(){
				return new Promise((resolve,reject)=>{
					// 用户是否要上传视频
					if(this.videos == ''){
						resolve('')
					}else{
						const videoion = this.videos.lastIndexOf('.');
						const exvideo = this.videos.slice(videoion);
						const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${exvideo}`;
						wx.cloud.uploadFile({
						    cloudPath: "staticvideo/" + cloudPath, // 上传至云端的路径
						    filePath: this.videos // 要上传的文件
						})
						.then((res)=>{
							resolve(res.fileID)
						})
						.catch((err)=>{
							console.log(err)
						})
					}
				})
			},
			
			
			// 上传所有数据到数据库
			cloudData(staticimg,staticvideo){
				let datas = {
					time:time,
					classdata:this.classdata, //分类
					titledata:this.titledata,  //标题
					tipsdata:this.tipsdata, //描述
					address:this.address, //定位
					avatarUrl:this.avatarUrl,  //头像
					nickName:this.nickName,  //昵称
					openid:this.openid, //openid
					staticimg:staticimg,//图片
					staticvideo:staticvideo  //视频
				}
				db.collection('userdata').add({
				  // data 字段表示需新增的 JSON 数据
				  data: {
				    datainfo:datas
				  }
				})
				.then((res)=>{
					// 全部提交成功，清除更新提示
					this.reldata = '发布成功，正在跳转...'
					// 传值给攻略页面，发表成功刷新页面
					var pagesid = true
					setTimeout(()=>{
						uni.switchTab({
							url:'../strategy/strategy'
						})
					this.$store.commit('roturnmuta', pagesid)
					},1700)
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 取消
			cancel(){
				this.modaishow = false
			},
			
			// 提示
			proMpt(tip){
				this.HMmessages.show(tip,{icon:'error',iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		created() {
			this.addRess()
		},
		computed:{
			...mapState(['travecity']),
			count(){
				 this.watchaddress = this.travecity.traveing
			}
		},
		watch:{
			watchaddress(newValue, oldValue){
				this.address = newValue
			}
		},
	}
</script>

<style scoped>
	.travels{padding: 10upx 20upx;}
	.classify text{display: block; font-size: 27upx; color: #14181e; background: #f7f7f7;
	padding: 10upx 20upx; border-radius: 20upx;
	margin: 0 30upx;}
	.classify{display: flex;}
	.classify-text{font-size: 30upx; color: #14181e; font-weight: bold;}
	.classify-view{display: flex; justify-content: flex-start; align-items: center;}
	/* 选中的样式 */
	.activetext{background: #ffdd00 !important;}
	/* 标题 */
	.place-text{color: #808080 !important; font-size: 30upx;}
	.travels-title{margin: 40upx 0;}
	/* 描述 */
	.travels-describe textarea{width: 100%; color: #808080 !important; font-size: 30upx;}
	/* 上传图片 */
	.topimg image{width: 150upx; height: 150upx; border-radius: 20upx;}
	.topimg{padding-left: 20upx; padding-top: 10upx;}
	/* 九宫格 */
		.conteng{display: flex;
				flex-wrap: wrap;
				/* width: 100%; */
				margin-left: 4px;
				margin-right: 4px;
						}
		.conteng-img{
		width: calc((100% / 4) - 8px) !important;
		margin:4px;
		height:176rpx;
		position: relative;
		}
		.uploadimg{width: 100% !important;
		height: 100% !important;
		border-radius: 10rpx;
		}
		.deleteimg{width: 38upx; height: 38upx;
		position: absolute;
		top: 6upx;
		right: 6upx;}
		/* 视频 */
		.uploadvideo video{width: 100%; height: 400upx; border-radius: 5upx;}
		.uploadvideo{margin: 0 8px; border-radius: 5upx; position: relative;}
		/* 覆盖视频 */
		.pause{width: 50upx; height: 50upx; position: absolute; top: 6upx; right: 6upx;}
		/* 位置 */
		.address-site{display: flex; align-items: center;}
		.address-site image{width: 40upx; height: 40upx; margin-right: 10upx;}
		.address-site text{font-size: 30upx; color: #00a2ff;}
		.address-text{font-size: 30upx; color: #333333; padding-right: 40upx;}
		.address{display: flex; background: #f1f1f1; padding: 20upx 0 20upx 20upx; margin-top: 30upx;
				margin-bottom: 160upx;}
		/* 发布 */
		.release{background: #ffdd00; width: 100%;height: 100upx;
		font-size: 40upx;
		line-height: 100upx;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;}
		.release text{display: block;}
		/* 模态弹窗布局 */
		.warp{position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.6);
		z-index: 9999;}
		.warp-view{width: 500upx;
				height: 200upx;
				background: #FFFFFF;
				margin: auto;
				position: absolute;
				-webkit-position:absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				border-radius: 8upx;
				overflow: hidden;
				}
		.warp-text{text-align: center;
				margin-top: 30upx;
				font-size: 34upx;
				color: #666666;}		
		.warp-flex{ display: flex;
			justify-content: space-around;
			border-top: 1upx solid #EEEEEE;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 80upx;
			line-height: 80upx;
			-webkit-transform: translateZ(0);}
		.warp-flex button{border: none;
		font-size: 30upx;}		
			
		/* 提示框 */
		/* .tiplist{background: none !important;}
		.tipmin{background: rgba(0,0,0,0.7);} */
		.tipmin text{font-size: 34upx;
		display: flex;
		justify-content: center;
		line-height: 200upx;
		}
</style>
