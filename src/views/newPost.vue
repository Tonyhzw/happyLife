<template>
  <div class="post">
    <div class="top">
        <Input v-model="formItem.input" class="title" name="title" placeholder="请输入标题"></Input>
        <button class="submit" @click="submitPost">提交</button>
    </div>
    <div class="tags">
        <Tag v-for="item in tagArr" closable color="blue" @on-close="closeTag(item)">{{item}}</Tag>
    </div>
     <div class="navbar">
        <span>标签</span>
        <div>
        <Input class="category" v-model="formItem.category" name="category" placeholder="请输入类别..." @keyup.enter="onEnter"></Input>
        </div>
     </div>
     <div class="row">
         <textarea v-model="formItem.textarea" rows="5" class="content" placeholder="请输入..."></textarea>
         <div class="markdown-container">
            <div class="markdown-body" v-html="htmlStr"></div>
         </div>
     <div>
  </div>
</template>
<style scoped>
 @import "./../css/github-markdown.css";
 @import "./../css/default.css";
.post{
  min-height: 486px;
}
.top{
  position: relative;
}
.tags{
  margin: 5px 10px;
}
.submit{
  position: absolute;
  top: 6px;
  right: 30px;
  border: none;
  padding: 10px 30px;
}
.title{
  font-size: 20px;
  padding: 10px 20px;
  width: 100%;
  border: none;
  outline: none;
}
.row{
  position: relative;
}
.row .markdown-container{
  margin-left: 50%;
}
.row:after{
   content: '';
   display: block;
   clear: both;
   height: 0;
   visibility: hidden;
}
.navbar{
  height: 40px;
  background-color: #ededed;
}
.navbar span{
  line-height: 40px;
  margin-left: 10px;
}
.navbar div{
  margin-left: 45px;
  margin-top: -40px;
}
.navbar div .category{
  line-height: 40px;
  width: 100%;
  padding-left: 10px;
  border:none;
  border-radius: 0;
  outline: none;
  background: rgba(255,255,255,0.5);
}
.inputArea{
   min-height: 400px;
   width: 50%;
}
.content{
   font-size: 18px;
   float: left;
   padding: 12px;
   width: 50%;
   background: transparent;
   border: none;
   outline: none;
   overflow: hidden;
   -ms-user-select: text;
   -moz-user-select: text;
   -webkit-user-select: text;
   user-select: text;
}
.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}
</style>
<script>
import axios from 'axios'
import autosize from 'autosize'
import marked from 'marked'
import hljs from 'highlight.js'

export default{
    ready(){
        autosize(document.querySelectorAll('textarea.content'));
        marked.setOptions({
        highlight: function (code) {
          return hljs.highlightAuto(code).value;
        }
      });
    },
    data(){
        return{
          cateArr:[],
          formItem: {
                  input:'',
                  category:'',
                  textarea: ''
              }
        }
    },
    computed:{
       htmlStr:function(){
          return marked(this.formItem.textarea);
       },
       tagArr:function(){
          return this.cateArr;
       }
    },
    methods:{
      submitPost:function() {
        axios.post('/postNew',
          {
            title: this.formItem.input,
            category: this.cateArr,
            content: this.formItem.textarea,
            blogId: null
          },
          // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
          // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
          {
            baseURL: 'http://127.0.0.1:8081'
          }
        ).then((response) => {
            var data = response.data;
            if(data=='ok'){
              this.$Notice.success({
                   title: '发布成功',
                   desc:  '该博客已发布成功。'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
      },
      onEnter:function(){
         var str=this.formItem.category.replace(/(^\s*)|(\s*$)/g,"");
         if(this.findIndex(str)==-1){
           this.cateArr.push(str);
           this.formItem.category="";
         }else{
           this.$Notice.error({
                title: '标签输入失败',
                desc:  '输入的标签已存在，请尝试更换新的标签。'
           });
         }
      },
      findIndex:function(val){
        var index = -1;
        var arr=this.cateArr;
        for(var i=0; i<arr.length; i++) {
          if(arr[i] == val) {
            index=i;
            break;
          }
        }
        return index;
      },
      closeTag:function(val){
        var index=this.findIndex(val);
        if(index!=-1){
          this.cateArr.splice(index,1);
        }
      }
    }
}
</script>
