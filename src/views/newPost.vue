<template>
  <div class="post">
    <div class="top">
        <Input v-model="formItem.input" class="title" name="title" placeholder="请输入标题"></Input>
        <button class="submit" @click="submitPost">提交</button>
    </div>
     <div class="navbar">
        <span>标签</span>
        <div>
        <Input class="category" v-model="formItem.category" name="category" placeholder="请输入类别，以空格间隔"></Input>
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
import showdown from 'showdown'
import hljs from 'highlight.js'

export default{
    ready(){
        autosize(document.querySelectorAll('textarea.content'));
        hljs.initHighlightingOnLoad();
    },
    data(){
        return{
          formItem: {
                  input:'',
                  category:'',
                  textarea: ''
              }
        }
    },
    computed:{
       htmlStr:function(){
          let converter = new showdown.Converter();
          return converter.makeHtml(this.formItem.textarea);
       }
    },
    methods:{
      submitPost:function() {

      }
    }
}
</script>
