<script>
	export default {
		onLaunch: function() {
			if (!wx.cloud) {
			      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			    } else {
			      wx.cloud.init({
			        env:'nanliwaimai-5gyu7y2dedb6dff7',
			        traceUser: true,   //是否在将用户访问记录到用户管理中，在控制台中可见
			      })
			    }
		},
	}
</script>
 
<style>
	/*每个页面公共css */
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
</style>
