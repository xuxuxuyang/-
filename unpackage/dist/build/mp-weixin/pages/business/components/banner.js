(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/business/components/banner"],{"0cb1":function(n,t,e){"use strict";var a=function(){var n=this,t=n.$createElement;n._self._c},r=[];e.d(t,"a",function(){return a}),e.d(t,"b",function(){return r})},"10d9":function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=e("2d07"),r={name:"details",props:{detaildata:Object,leaveword:Array},data:function(){return{imgArray:[],navDatas:"",bannerindex:0,num:1,len:"",top:""}},mounted:function(){},methods:{bannerfun:function(n){this.bannerindex=n.detail.current},previmg:function(n){var t=this.imgArray;(0,a.preview)(n,t).then(function(n){console.log(n)}).catch(function(n){console.log(n)})}},watch:{detaildata:function(n,t){console.log(n.Banner),this.imgArray=n.Banner}}};t.default=r},2096:function(n,t,e){},"440a":function(n,t,e){"use strict";var a=e("2096"),r=e.n(a);r.a},9187:function(n,t,e){"use strict";e.r(t);var a=e("0cb1"),r=e("d480");for(var u in r)"default"!==u&&function(n){e.d(t,n,function(){return r[n]})}(u);e("440a");var o=e("2877"),i=Object(o["a"])(r["default"],a["a"],a["b"],!1,null,"8ba0d214",null);t["default"]=i.exports},d480:function(n,t,e){"use strict";e.r(t);var a=e("10d9"),r=e.n(a);for(var u in a)"default"!==u&&function(n){e.d(t,n,function(){return a[n]})}(u);t["default"]=r.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/business/components/banner-create-component',
    {
        'pages/business/components/banner-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9187"))
        })
    },
    [['pages/business/components/banner-create-component']]
]);                
