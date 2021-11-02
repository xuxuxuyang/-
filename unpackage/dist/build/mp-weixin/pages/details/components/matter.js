(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/details/components/matter"],{"3f85":function(t,e,n){},"5d49":function(t,e,n){"use strict";n.r(e);var a=n("eec8"),o=n("d493");for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);n("78a6");var c=n("2877"),u=Object(c["a"])(o["default"],a["a"],a["b"],!1,null,"1ae277df",null);e["default"]=u.exports},"78a6":function(t,e,n){"use strict";var a=n("3f85"),o=n.n(a);o.a},"848d":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"matter",props:{detaildata:Object},data:function(){return{videoing:!1,staticvideo:""}},methods:{videoErrorCallback:function(t){console.log(t)},playcall:function(t){console.log(t)}},watch:{detaildata:function(t,e){""!=t.staticvideo?(console.log(t),this.staticvideo=t.staticvideo,this.videoing=!0):(this.videoing=!1,console.log("空"))}}};e.default=a},d493:function(t,e,n){"use strict";n.r(e);var a=n("848d"),o=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);e["default"]=o.a},eec8:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return o})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/details/components/matter-create-component',
    {
        'pages/details/components/matter-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("5d49"))
        })
    },
    [['pages/details/components/matter-create-component']]
]);                
