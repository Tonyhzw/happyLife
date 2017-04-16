<template>
  <div id="app">
    <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <router-link :to="{name:'index'}" class="index">首页</router-link>
          <router-link :to="{name:'about'}" class="about">关于本站</router-link>
          <Button  v-if="!islogin" class="login-button" @click="modal6 = true">登陆</Button>
          <router-link v-if="islogin" :to="{name:'newPost'}">欢迎您</router-link>
        </div>
    </div>
    <Modal
        v-model="modal6"
        title="请登陆后台系统"
        :loading="loading"
        @on-ok="login">
        <i-input v-model="username" name="username" placeholder="用户名" class=" username"></i-input>
        <i-input v-model="password" name="password" placeholder="密码" class=" password" type="password"></i-input>
        <p class="tips">{{loginTips}}</p>
    </Modal>
    <div>
        <router-view></router-view>
    </div>
    <div class="layout-copy" id="foot">
        2016-2017 &copy; Tonyhzw
    </div>
  </div>
</template>
<style>
.layout-ceiling{
    background: #0091ea;
    padding: 10px 0;
    overflow: hidden;
}
.layout-ceiling-main{
    float: right;
    margin-right: 15px;
}
.layout-ceiling-main a{
    color: rgba(255,255,255,0.7);
}
.layout-ceiling-main a:hover{
    color: #fff;
}
.index{
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid rgba(255,255,255,0.5);
}
.about{
    padding-right: 10px;
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
    position: absolute;
    width: 100%;
    bottom: 0;
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
button.login-button:hover {
    background-color: #fff;
    color: #5cadff;
}
</style>
<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import axios from 'axios'
    import * as Cookies from 'js-cookie'

    //注入
    export default {
        data() {
            return {
                  modal6: false,
                  loginTips:'',
                  loading:true,
                  username: '',
                  password: ''
            };
        },
        computed:{
            islogin: function(){
              return this.$store.state.islogin;
            }
        },
        mounted() {
            var str = Cookies.get('sid');
            console.log(str);
            if(!!str){
              this.$store.commit('loginSuccess');
            }
        },
        methods: {
            changeLoading() {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            },
            login (e) {
                //登陆验证
                if(!this.username||!this.password){
                    this.loginTips="输入不正确，请完成输入。";
                    return this.changeLoading();
                }else{
                    axios.post('/login',
                      {
                        username: this.username,
                        password: this.password
                      }
                    ).then((response) => {
                        if(response.data.status == 'ok'){
                          this.$store.commit('loginSuccess');
                          // 登陆成功，关闭登陆框
                          Cookies.set('sid',response.data.data);
                          this.changeLoading();
                          this.modal6=false;
                        }else{
                          this.loginTips="用户名与密码不正确，请完成输入。";
                          return this.changeLoading();
                        }
                    }).catch((error)=>{
                        this.loginTips="出现其他错误。";
                        return this.changeLoading();
                    });
              }

            }
        }
    };
</script>
