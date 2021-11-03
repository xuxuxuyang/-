
《一》将alitraver（补录前）代码放在Hbuildex编辑器中
打开manifest.json文件————微信小程序配置，填写你自己的appId

《二》微信开发者工具中创建云开发环境
（1）在云开发控制台集合中创建以下集合名称，并设置权限，请保持一致，否则将要出错

Authentication   数据库权限：仅创建者可读写
Commodity        数据库权限：所有用户可读，仅创建者可读写

Order        数据库权限：仅创建者可读写

Shopping         数据库权限：仅创建者可读写
banner           数据库权限：所有用户可读，仅创建者可读写
message			 数据库权限：所有用户可读，仅创建者可读写
tab				 数据库权限：所有用户可读，仅创建者可读写
user			 数据库权限：仅创建者可读写
userdata		 数据库权限：所有用户可读，仅创建者可读写
userinfo		 数据库权限：仅创建者可读写

（2）打开App.vue文件，在env中设置你的云开发环境名称：
wx.cloud.init({
	env: '云开发环境名称',
	traceUser: true
});

《三》设置云存储：图片和视频存储，点击云开发控制台中的“存储”
（1）设置以下文件名称以及权限
Authentication  权限：所有用户可读，仅创建者可读写
Commodity       权限：同上
baners			权限：同上
banner			权限：同上
list			权限：同上
static			权限：同上
staticvideo		权限：同上

《七》上传云函数
（1）aimessage文件打开index.js文件

env设置为你的环境id
cloud.init({
  traceUser: true,
  env: '你的环境id'
})

以下三个是百度AI的自然语言处理中的评论分类账号，具体看课程中讲到的这一节，注册百度AI账号获取三个值
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";

（2）authening文件打开index.js文件
env设置为你的环境id
cloud.init({
  traceUser: true,
  env: '你的环境id'
})

（3）shopdata文件打开index.js文件
env设置为你的环境id
cloud.init({
  traceUser: true,
  env: '你的环境id'
}
)

（4）wxpay文件：该文件是微信支付云函数，打开index.js文件

env依然为你的环境id
cloud.init({
  env: ''
})

以下三个参数是发起微信支付必须的三个账户，但是注意！！！，
发起微信支付必须要营业执照来认证小程序为商户号才可以得到这三个账户
const appId = '小程序appid'
const mchId = '微信支付商户号'
const key = '微信支付秘钥'


（5）以上云函数设置完之后即可上传部署

《八》定位
打开微信开发者工具，在app.json中最底部添加如下"permission"来做定位

添加在"sitemapLocation": "sitemap.json"下

"permission": {
	"scope.userLocation": {
	"desc": "你的位置信息将用于小程序位置接口的效果展示"
	}
}

——————————————————————————————以上操作完成后，在Hbuildex编辑器中即可运行到微信小程序——————————————————————————————

《九》微信登录获取头像昵称接口更新说明：
2021年4月微信更新了获取头像昵称的接口

登录接口更新说明：https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801