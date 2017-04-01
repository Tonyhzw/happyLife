<template>
  <div class="post">
    <div class="top">
        <Input v-model="formItem.input" class="title" name="title" placeholder="请输入标题"></Input>
        <button class="submit" @click="submitPost">提交</button>
    </div>
    <div class="tags">
        <Tag v-for="item in alCateArr" closable color="green" @on-close="closeAlTag(item.tagId)">{{item.tagName}}</Tag>
        <Tag v-for="item in tagArr" closable color="blue" @on-close="closeTag(item)">{{item}}</Tag>
    </div>
     <div class="navbar">
        <span>标签</span>
        <div>
        <Input class="category" v-model="formItem.category" name="category" placeholder="请输入类别..." @keyup.enter="onEnter" @input="onInput" @blur="onBlur"></Input>
        <ul>
          <li v-for="word in candicateArr"><a  @click="chooseTag(word)">{{word.tagName}}</a></li>
        </ul>
        </div>
     </div>
     <div class="description">
       <textarea rows="3" class="content" v-model="formItem.description" placeholder="请输入简介，本部分不支持markdown语法..."></textarea>
     </div>
     <div class="row">
         <textarea v-model="formItem.textarea" rows="5" class="content" placeholder="请输入正文，支持markdown语法"></textarea>
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
  position: relative;
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
.navbar ul{
  color: black;
  position: absolute;
  z-index: 1;
  width: 100%;
  background-color: white;
}
.navbar ul li{
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 10px;
}
.navbar ul li:hover{
  background-color: #39f;
  cursor: pointer;
}
.navbar ul li:hover a{
  color:#fff;
}
.inputArea{
   min-height: 400px;
   width: 50%;
}
.description{
    padding: 16px;
    box-shadow: 0 0 1px rgba(0,0,0,0.3);
    margin-bottom: 10px;
    margin-top: 5px;
}
.description .content{
    padding: 12px;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    overflow: hidden;
    user-select: text;
}
.row .content{
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
        if(this.$route.params.id) this.fetchData();
    },
    data(){
        return{
          cateArr:[],
          alCateArr:[],
          delCateArr:[],
          formItem: {
                  input:'',
                  category:'',
                  description:'',
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
       },
       candicateArr:function(){
          return this.$store.state.candicateArr;
       }
    },
    methods:{
      submitPost:function() {
        let blogId = !!this.$route.params.id?this.$route.params.id:null;
        //检查是否为空
        if(this.checkIfNotNull()){
          axios.post('/postNew',
            {
              title: this.formItem.input,
              category: this.cateArr,
              alCateArr: this.alCateArr,
              delCateArr: this.delCateArr,
              content: this.formItem.textarea,
              description: this.formItem.description,
              blogId: blogId
            }
          ).then((response) => {
              var data = response.data;
              if(data=='ok'){
                this.displayTips('success','发布成功','该博客已发布成功。');
              }
            }).catch(function (error) {
              console.log(error);
            });
        }
      },
      checkIfNotNull(){
        //title、tags、content 不能为空
        var title = "发布失败";
        if(!this.formItem.input){
          this.displayTips('error', title, "发布的博客题目不能为空");
          return false;
        }else if(!this.formItem.textarea) {
          this.displayTips('error', title, "发布的博客内容不能为空");
          return false;
        }else if(this.cateArr.length==0 && this.alCateArr.length==0){
          this.displayTips('error',title, "发布的博客标签不能为空");
        }
        return true;
      },
      displayTips(type,title,content){
         switch (type) {
           case 'error':
               this.$Notice.error({
                    title: title,
                    desc:  content
               });
               break;
           case 'success':
               this.$Notice.success({
                    title: title,
                    desc:  content
               });
               break;
           default:

         }
      },
      onEnter:function(){
         var str=this.formItem.category.replace(/(^\s*)|(\s*$)/g,"");
         //检查本地是否存在
         var isExist = false;
         if(this.findIndex(str,this.cateArr)==-1){
             isExist = false;
         }else{
             this.displayTips('error','标签输入失败','输入的标签已存在，请尝试更换新的标签。');
         }
         //检查数据库是否存在
         if(!isExist){
             var promise = this.checkDB(str);
             promise.then((data)=>{
                 if(data.length==0){
                     this.cateArr.push(str);
                     this.formItem.category="";
                 }
             }).catch(()=>{
                 console.log("tags already exists");
             });
         }
      },
      onInput(){
         var str=this.formItem.category.replace(/(^\s*)|(\s*$)/g,"");
         axios.get('/getTags',{
           params: {
             tagStr:str,
             isLike:true
           }
         }).then((response) => {
             var data = response.data;
             this.$store.commit('getCandicateTags',{
                 data:data
             });
         }).catch(function(error){
             console.log(error);
         });
      },
      onBlur(){
        this.$store.commit('resetCandicateTags');
      },
      checkDB(str){
        return new Promise(function(resolve,reject){
            axios.get('/getTags',{
              params: {
                tagStr:str,
                isLike:false
              }
            }).then((response) => {
                var data = response.data;
                resolve(data);
            }).catch(function(error){
                console.log(error);
                reject();
            });
        });
      },
      chooseTag(item){
        if(this.findIndex(item,this.alCateArr)!=-1)
          this.alCateArr.push(item);
        else{
          this.displayTips('error','标签输入失败','输入的标签已存在，请尝试更换新的标签。');
        }
      },
      findIndex:function(val,arr){
        var index = -1;
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
      },
      closeAlTag(id){
         for(i=0;i<this.alCateArr.length;i++){
           if(this.alCateArr[i].tagId == id){
              this.delCateArr.push(this.alCateArr[i]);
              break;
           }
         }
         this.alCateArr.splice(i,1);
         //并不是删除，而是本文删除
         console.log("tag delet success.");
      },
      fetchData(){
        axios.get('/getBlog',{
          params:{
             blogId:this.$route.params.id
          }
        }).then((response)=>{
          var data = response.data;
          this.formItem.input = data[0].title;
          this.formItem.textarea = data[0].content;
          data.forEach((val)=>{
              this.getCategoryForBlog(this.$route.params.id);
              val.category=[];
          });
        }).catch((error)=>{
          console.log(error);
        });
      },
      getCategoryForBlog(id){
        axios.get('/getCategoryForBlog',{
          params: {
            blogId:id
          }
        }).then((response) => {
            this.alCateArr = response.data;
        }).catch(function(error){
            console.log(error);
        });
      },
    }
}
</script>
