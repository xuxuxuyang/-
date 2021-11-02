(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/details/components/navs"],{1369:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={name:"navs",data:function(){return{num:0,navalue:[{name:"宝贝"},{name:"详情"},{name:"评价"}]}},methods:{navbtn:function(n){this.num=n,0===n&&this.backTop(),0!=n&&this.$store.dispatch("navdata",n)},backTop:function(){wx.pageScrollTo&&wx.pageScrollTo({scrollTop:0})}}};t.default=a},"198c":function(n,t,e){},"1c9e":function(n,t,e){"use strict";e.r(t);var a=e("c3fe"),c=e("38ef");for(var u in c)"default"!==u&&function(n){e.d(t,n,function(){return c[n]})}(u);e("560c");var o=e("2877"),r=Object(o["a"])(c["default"],a["a"],a["b"],!1,null,"80247170",null);t["default"]=r.exports},"38ef":function(n,t,e){"use strict";e.r(t);var a=e("1369"),c=e.n(a);for(var u in a)"default"!==u&&function(n){e.d(t,n,function(){return a[n]})}(u);t["default"]=c.a},"560c":function(n,t,e){"use strict";var a=e("198c"),c=e.n(a);c.a},c3fe:function(n,t,e){"use strict";var a=function(){var n=this,t=n.$createElement;n._self._c},c=[];e.d(t,"a",function(){return a}),e.d(t,"b",function(){return c})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/details/components/navs-create-component',
    {
        'pages/details/components/navs-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("1c9e"))
        })
    },
    [['pages/details/components/navs-create-component']]
]);                
