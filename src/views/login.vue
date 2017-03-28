<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .username,.password{
        margin-bottom:10px;
    }
    .tips{
        display: flex;
        justify-content: center;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-header">
            <div class="layout-logo"></div>
        </div>
        <Modal
            :visible.sync="modal6"
            title="请登陆后台系统"
            :loading="loading"
            @on-ok="login">
            <i-input :value.sync="username" name="username" placeholder="用户名" class=" username"></i-input>
            <i-input :value.sync="password" name="password" placeholder="密码" class=" password" type="password"></i-input>
            <p class="tips">点击确定后，对话框将在 2秒 后关闭。</p>
        </Modal>
    </div>
</template>
<script>
    import axios from 'axios';

    export default {
        components:{

        },
        data () {
            return {
                modal6: true,
                loading: true,
                username: '',
                password: ''
            }
        },
        methods: {
            login () {
                //登陆验证
                if(!this.username||!this.password){

                    this.modal6=true;
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
                        console.dir(response);
                    }).catch(function(error){
                        console.log(error);
                    });
                    // 登陆成功，关闭登陆框
                    this.modal6 = false;
              }
            }
        }
    }
</script>
