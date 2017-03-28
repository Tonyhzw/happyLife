<template>
  <div class="post">
    <Input v-model="formItem.input" class="title" placeholder="请输入标题"></Input>
     <div class="navbar"></div>
     <Row class="row">
       <Col span="12">
         <div class="inputArea"></div>
         <textarea v-model="formItem.textarea" rows="5" class="content" placeholder="请输入..."></textarea>
       </Col>
       <Col span="12">
         <div class="markdownResult markdown-body" v-html="htmlStr"></div>
       </Col>
     <Row>
  </div>
</template>
<style scoped>
 @import "./../css/github-markdown.css"
.post{
  min-height: 486px;
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
.navbar{
    height: 30px;
    background-color: #ededed;
}
.inputArea{
   min-height: 400px;
   width: 50%;
}
.content{
   font-size: 18px;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 3;
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
.markdownResult{
    position: absolute;
    left: 50%;
    top: 0;
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
import {markdown} from 'markdown'
export default{
    data(){
        return{
          formItem: {
                  input:'',
                  textarea: ''
              }
        }
    },
    computed:{
       htmlStr:function(){
          return markdown.toHTML(this.formItem.textarea);
       }
    },
    methods:{

    }
}
</script>
