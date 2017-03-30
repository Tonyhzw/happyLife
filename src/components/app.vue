<template>
  <div>
    <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <!-- <a href="#/login" :class="{ active:isActive }">登录</a> -->
          <Button  v-if="!islogin" type="ghost" shape="circle" class="login-button" @click="showLoginModal">登陆</Button>
          <a v-if="islogin" href="">欢迎您</a>
        </div>
    </div>
    <Modal
        :visible.sync="modal6"
        title="请登陆后台系统"
        :loading="loading"
        @on-ok="login">
        <i-input :value.sync="username" name="username" placeholder="用户名" class=" username"></i-input>
        <i-input :value.sync="password" name="password" placeholder="密码" class=" password" type="password"></i-input>
        <p class="tips">{{tips}}</p>
    </Modal>
    <div>
        <router-view></router-view>
    </div>
    <div class="home" id="back-home">
       <Icon type="ios-home"></Icon><a href="#/index">返回主页</a>
    </div>
    <div class="layout-copy" id="foot">
        2016-2017 &copy; Tonyhzw
    </div>
  </div>
</template>
<style>
.layout-ceiling{
    background: #01579b;
    padding: 10px 0;
    overflow: hidden;
}
.layout-ceiling-main{
    float: right;
    margin-right: 15px;
}
.layout-ceiling-main a{
    color: #9ba7b5;
}
.layout-ceiling-main a.active{
    color: #e1f5fe;
}
.home{
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 10px;
    color:#fff;
    background-color: #b3e5fc;
    font-size: 14px;
    line-height: 14px;
    display: none;
}
.short a{
    display: none;
}
.home:hover{
    background-color: #4fc3f7;
}
.home:hover a{
    display: inline-block;
}
.home a{
    color: #fff;
    margin-left: 5px;
}
.home a:hover{
    color:#fff;
}
.layout-copy{
    text-align: center;
    padding: 20px 0;
    color: #fff;
    background-color: #0091ea;
    margin-top: 20px;
}
.username,.password{
    margin-bottom:10px;
}
.tips{
    display: flex;
    justify-content: center;
}
.login-button{
    padding: 4px 14px;
    border-radius: 5px;
    background-color: #5cadff;
    border: none;
    cursor: pointer;
    color: #fff;
}
</style>
<script>
    import store from './../store/store.js';
    import Vue from 'vue'
    import Vuex from 'vuex'
    import axios from 'axios'
    import Cookies from 'js-cookie'
    //注入
    export default {
        store,
        data() {
            return {
                  modal6: false,
                  loading: true,
                  username: '',
                  password: ''
            };
        },
        computed:{
            islogin: function(){
              var loginState = store.state.islogin;
              var isCookie = this.$cookie.get('test');
              console.log(isCookie);
              console.log(document.cookie);
              if(!loginState&&(!!isCookie)){
                store.commit('loginSuccess');
                return true;
              }
              return loginState;
            },
            tips: function(){
              return store.state.loginTips;
            }
        },
        ready() {
            this.isOverloads(); //addEventListener
        },
        beforeDestroy() {

        },
        methods: {
            isOverloads(){
                var footer = document.getElementById('foot');
                var home = document.getElementById('back-home');
                home.style.setProperty('display','block');
                if(footer.getBoundingClientRect().bottom<home.getBoundingClientRect().top ||
                   footer.getBoundingClientRect().right<home.getBoundingClientRect().left
                ){
                  this.removeClass(home,'short');
                }
                else home.className +=' short';
            },
            removeClass(obj, cls) {
                if (this.hasClass(obj, cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    obj.className = obj.className.replace(reg, ' ');
                }
            },
            hasClass(obj, cls) {
                return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
            },
            showLoginModal(){
                this.modal6 = true;
            },
            login (e) {
                //登陆验证
                if(!this.username||!this.password){
                    store.commit('updateTips',{
                       data: "输入不正确，请完成输入。"
                    });
                    this.loading=false;
                }else{
                    axios.post('/login',
                      {
                        username: this.username,
                        password: this.password
                      },
                      {
                        baseURL:'http://127.0.0.1:8081'
                      }
                    ).then((response) => {
                        if(response.data == 'ok'){
                          store.commit('loginSuccess');
                          // 登陆成功，关闭登陆框
                          this.modal6=false;
                        }else{
                          store.commit('updateTips',{
                             data: "用户名与密码不正确，请完成输入。"
                          });
                          this.loading=false;
                        }
                    }).catch(function(error){
                        store.commit('updateTips',{
                           data: " 出现其他错误。"
                        });
                        this.loading=false;
                    });
              }

            }
        }
    };
</script>
