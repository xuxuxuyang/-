(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/order"],{"64bd":function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c;e._isMounted||(e.e0=function(t){e.HMmessages=e.$refs.HMmessages})},r=[];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return r})},"7eb2":function(e,t,n){"use strict";var o=n("c510"),r=n.n(o);r.a},"85bd":function(e,t,n){"use strict";(function(e){n("bb5b"),n("921b");o(n("66fd"));var t=o(n("af96"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},af96:function(e,t,n){"use strict";n.r(t);var o=n("64bd"),r=n("f50d");for(var a in r)"default"!==a&&function(e){n.d(t,e,function(){return r[e]})}(a);n("7eb2");var c=n("2877"),i=Object(c["a"])(r["default"],o["a"],o["b"],!1,null,null,null);t["default"]=i.exports},c510:function(e,t,n){},e439:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=c(n("a34a")),r=n("b4e9"),a=n("f859");function c(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n,o,r,a,c){try{var i=e[a](c),s=i.value}catch(u){return void n(u)}i.done?t(s):Promise.resolve(s).then(o,r)}function s(e){return function(){var t=this,n=arguments;return new Promise(function(o,r){var a=e.apply(t,n);function c(e){i(a,o,r,c,s,"next",e)}function s(e){i(a,o,r,c,s,"throw",e)}c(void 0)})}}var u=function(){return n.e("components/HM-messages/HM-messages").then(n.bind(null,"791b"))},l=wx.cloud.database(),d=l.collection("Shopping"),f=l.collection("Order"),h={name:"orderdata",components:{HMmessages:u},data:function(){return{homeload:!0,orderdata:[],obtainprice:"",name:"",phone:"",carded:"",Placeorder:""}},methods:{orDerdata:function(){var e=this;d.where({Selection:"show"}).get().then(function(t){console.log(t),e.orderdata=t.data,e.homeload=!1}).catch(function(e){console.log(e)})},btnShopping:function(){var e=this;(0,r.erring)(this.name,this.phone,this.carded).then(function(t){if(console.log(t),"SUCCESS"==t)e.weChatorder();else{var n="danger";e.tips(t,n)}}).catch(function(e){console.log(e)})},weChatorder:function(){var e=s(o.default.mark(function e(){var t,n,r,a,c,i,s;return o.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return wx.showToast({title:"正在下单",icon:"loading",mask:!0}),console.log("111"),t={name:this.name,phone:this.phone,carded:this.carded},n={peopleobj:t,arrinfo:this.orderdata},console.log(this.obtainprice),console.log(this.orderdata),console.log(t),r=this.orderdata[0].shopid,a=r.slice(0,7),c=this.orderdata[0].title,console.log(a),e.next=13,this.placeOrder(a,c,n);case 13:return i=e.sent,e.next=16,this.orderInfo(i);case 16:return s=e.sent,console.log(s),e.next=20,this.wxPay(s,i);case 20:return e.sent,e.next=23,this.paySucc(s,i);case 23:e.sent;case 24:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),placeOrder:function(e,t,n){var o=this;return new Promise(function(r,c){var i={type:"placeOrder",goodId:e,commodity:t,Price:o.obtainprice,Paymentinfor:n};(0,a.wxpay)(i).then(function(e){console.log(e.result.orderdata._id);var t=e.result.orderdata._id;r(t)}).catch(function(e){console.log(e)})})},orderInfo:function(e){var t=this;return new Promise(function(n,o){var r={type:"queryorder",Placeorder:e};(0,a.wxpay)(r).then(function(e){console.log(e.result.result.data[0]);var t=e.result.result.data[0];n(t),wx.hideToast()}).catch(function(e){console.log(e);var n="支付出现错误",o="danger";t.tips(n,o),wx.hideToast()})})},wxPay:function(e,t){var n=this;return new Promise(function(o,r){wx.requestPayment({timeStamp:e.time_stamp,nonceStr:e.nonceStr,package:"prepay_id=".concat(e.prepayId),signType:"MD5",paySign:e.payauto,success:function(e){console.log(e),o(e)},fail:function(e){console.log(e);var o="支付错误",r="success";n.tips(o,r),f.doc(t).remove().then(function(e){console.log(e)}).catch(function(e){console.log(e)})}})})},paySucc:function(t,n){var o=this;return new Promise(function(r,c){var i={type:"paysucc",Placeorder:n,out_trade_no:t.out_trade_no};(0,a.wxpay)(i).then(function(t){if(console.log(t.result.tips),r(t),"支付成功"==t.result.tips){console.log("支付成功");var n="购买成功",a="success";o.tips(n,a),e.redirectTo({url:"../Myorder/myorder"})}}).catch(function(e){console.log(e)})})},tips:function(e,t){this.HMmessages.show(e,{icon:t,iconColor:"#ffffff",fontColor:"#ffffff",background:"rgba(102, 0, 51,.8)"})}},onLoad:function(e){console.log(JSON.parse(e.ids));var t=JSON.parse(e.ids);"Shopping"==t.page?(this.obtainprice=t.obtainprice,this.orDerdata()):(console.log("直接下单"),this.obtainprice=t.orderdata[0].totalPrice,this.orderdata=t.orderdata,this.homeload=!1)}};t.default=h}).call(this,n("543d")["default"])},f50d:function(e,t,n){"use strict";n.r(t);var o=n("e439"),r=n.n(o);for(var a in o)"default"!==a&&function(e){n.d(t,e,function(){return o[e]})}(a);t["default"]=r.a}},[["85bd","common/runtime","common/vendor"]]]);