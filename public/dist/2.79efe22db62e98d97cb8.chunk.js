webpackJsonp([2],{544:function(e,s,o){var t,a;o(545),t=o(546),a=o(547),e.exports=t||{},e.exports.__esModule&&(e.exports=e.exports.default),a&&(("function"==typeof e.exports?e.exports.options:e.exports).template=a)},545:function(e,s){},546:function(e,s){"use strict";Object.defineProperty(s,"__esModule",{value:!0}),s.default={components:{},data:function(){return{modal6:!1,loading:!0,username:"",password:""}},methods:{asyncOK:function(){var e=this;setTimeout(function(){e.modal6=!1},2e3)}}}},547:function(e,s){e.exports=' <div class=layout _v-b88fb1bc=""> <div class=layout-header _v-b88fb1bc=""> <div class=layout-logo _v-b88fb1bc=""></div> </div> <modal :visible.sync=true title=请登陆后台系统 :loading=loading @on-ok=asyncOK _v-b88fb1bc=""> <i-input :value.sync=username placeholder=用户名 class=username _v-b88fb1bc=""></i-input> <i-input :value.sync=password placeholder=密码 class=password type=password _v-b88fb1bc=""></i-input> <p class=tips _v-b88fb1bc="">点击确定后，对话框将在 2秒 后关闭。</p> </modal> </div> '}});