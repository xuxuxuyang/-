(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/business/components/navs"],{"247e":function(n,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={name:"navs",data:function(){return{num:0,navalue:[{name:"宝贝"},{name:"详情"},{name:"评价"}]}},methods:{navbtn:function(n){this.num=n,0===n&&this.backTop(),0!=n&&this.$store.dispatch("navdata",n)},backTop:function(){wx.pageScrollTo&&wx.pageScrollTo({scrollTop:0})}}};t.default=e},2664:function(n,t,a){"use strict";a.r(t);var e=a("247e"),u=a.n(e);for(var o in e)"default"!==o&&function(n){a.d(t,n,function(){return e[n]})}(o);t["default"]=u.a},"4afd":function(n,t,a){"use strict";var e=function(){var n=this,t=n.$createElement;n._self._c},u=[];a.d(t,"a",function(){return e}),a.d(t,"b",function(){return u})},aa1e:function(n,t,a){"use strict";a.r(t);var e=a("4afd"),u=a("2664");for(var o in u)"default"!==o&&function(n){a.d(t,n,function(){return u[n]})}(o);a("be93");var r=a("2877"),c=Object(r["a"])(u["default"],e["a"],e["b"],!1,null,"701a4442",null);t["default"]=c.exports},ad62:function(n,t,a){},be93:function(n,t,a){"use strict";var e=a("ad62"),u=a.n(e);u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/business/components/navs-create-component',
    {
        'pages/business/components/navs-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("aa1e"))
        })
    },
    [['pages/business/components/navs-create-component']]
]);                
