<template>
  <div class="post">
    <div class="top">
        <Input v-model="formItem.input" class="title" name="title" placeholder="请输入标题"></Input>
        <button class="submit" @click="submitPost">提交</button>
    </div>
    <div class="tags">
        <Tag v-for="item1 in alCateArr" closable color="green" @on-close="closeAlTag(item1.tagId)">{{item1.tagName}}</Tag>
        <Tag v-for="item2 in cateArr" closable color="blue" @on-close="closeTag(item2,cateArr)">{{item2.tagName}}</Tag>
        <Tag v-for="item3 in alCateArrToAdd" closable color="blue" @on-close="closeTag(item3,alCateArrToAdd)">{{item3.tagName}}</Tag>
    </div>
     <div class="navbar">
        <span>标签</span>
        <div class="mask" @click="dropUp" v-if="candicateArr.length>0"></div>
        <div class="search-bar">
          <Input class="category" v-model="formItem.category" name="category" placeholder="请输入类别..." @keyup.enter="onEnter" @input="onInput" ></Input>
          <ul>
            <li v-for="word in candicateArr" @click="chooseTag(word)">{{word.tagName}}</li>
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
  position: relative;
}
.navbar span{
  line-height: 40px;
  margin-left: 10px;
}
.navbar .search-bar{
  padding-left: 45px;
  margin-top: -40px;
  width: 100%;
  position: absolute;
  z-index: 1;
}
.navbar .search-bar .category{
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
.mask{
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
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
    mounted(){
        axios.defaults.baseURL = 'http://127.0.0.1:8081';
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
          cateArr:[],/*新添加的标签*/
          alCateArr:[], /*已存在的标签，一般用于更新博客时，这类标签仅用于展示*/
          alCateArrToAdd:[], /*选择的已存在的标签*/
          delCateArr:[], /*删除已选择的标签*/
          candicateArr:[],
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
              alCateArr: this.alCateArrToAdd,
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
        }else if(this.cateArr.length==0 && this.alCateArr.length==0 && this.alCateArrToAdd.length==0){
          this.displayTips('error',title, "发布的博客标签不能为空");
          return false;
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
                     this.cateArr.push({'tagName':str});
                     this.formItem.category="";
                 }else{
                     this.displayTips('error','标签输入失败','输入的标签已存在，请尝试更换新的标签。');
                 }
             }).catch(()=>{
                 console.log("error exists");
             });
         }
      },
      onInput(){
         var str=this.formItem.category.replace(/(^\s*)|(\s*$)/g,"");
         if(str!=''){
           axios.get('/getTags',{
             params: {
               tagStr:str,
               isLike:true
             }
           }).then((response) => {
               var data = response.data;
               this.candicateArr = data;
           }).catch(function(error){
               console.log(error);
           });
         }else{
           this.candicateArr = [];
         }
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
            }).catch((error)=>{
                console.log(error);
                reject();
            });
        });
      },
      chooseTag(item){
        if(this.findIndex(item.tagName,this.alCateArr)==-1&&this.findIndex(item,this.cateArr)==-1&&this.findIndex(item.tagName,this.alCateArrToAdd)==-1){
          //查看是否在删除列表中，若不存在时，说明此时需要将其添加到alCateArrToAdd，否则说明本来就有
          let index=this.findIndex(item.tagName,this.delCateArr);
          if(index!=-1){
              this.delCateArr.splice(index,1);
              this.alCateArr.push(item);
              this.formItem.category="";
          }else{
              this.alCateArrToAdd.push(item);
              this.formItem.category="";
          }
        }else{
          this.displayTips('error','标签选择失败','选择的标签已存在，请尝试更换其他的标签。');
        }
        this.candicateArr = [];
      },
      findIndex(val,arr){
        var index = -1;
        for(var i=0; i< arr.length; i++) {
          if(arr[i].tagName == val) {
            index=i;
            break;
          }
        }
        return index;
      },
      closeTag(item,arr){
        var index = index=this.findIndex(item.tagName,arr);
        if(index!=-1){
          arr.splice(index,1);
        }
      },
      closeAlTag(id){
         var i=0;
         for(i=0;i<this.alCateArr.length;i++){
           if(this.alCateArr[i].tagId == id){
              this.delCateArr.push(this.alCateArr[i]);
              break;
           }
         }
         this.alCateArr.splice(i,1);
         //并不是删除，而是本文删除
      },
      dropUp(event){
        if(event.target.className=='mask'){
          this.candicateArr = [];
        }
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
          this.formItem.description = data[0].description;
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
