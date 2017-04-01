<template>
<div id="app">
    <div class="layout">
        <Row type="flex">
           <div class="post" v-if="blogData">
             <h2 class="title">{{blogData.title}}</h2>
             <div class="info">
                <Icon type="ios-pricetags"></Icon>
                <a class="category" v-for="item in blogData.category" v-link="{ name : 'category', params : {category:item.tagId} }">{{item.tagName}}</a>
             </div>
             <Row type="flex" justify="end" class="meta">
                <i-col offset="10" span="5" class="time updateTime" v-if="!!blogData.updateTime"><span>更新于：{{displayTime(blogData.updateTime)}}</span></i-col>
                <i-col span="5" class="time createTime"><span>创建于：{{displayTime(blogData.writeTime)}}</span></i-col>
                <i-col span="2" class="watchCount">浏览量: <span class="count">{{blogData.count}}</span></i-col>
                <a span="1" class="update active" @click="update" v-if="islogin" v-link="{name:'updatePost',params:{id:blogData.blogId}}">编辑</a>
                <span class="update" span="1" v-else>编辑</span>
                <a span="1" class="delete active" @click="instance('警告')" v-if="islogin">删除</a>
                <span class="delete" span="1" v-else>删除</span>
             </Row>
             <div class="main-content">
               <div class="description" v-if="!!blogData.description">
                 <h3>简介</h3>
                 <p>{{blogData.description}}</p>
               </div>
               <div v-html="htmlStr" class="markdown-body"></div>
             </div>
           </div>
        </Row>
    </div>
</div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import marked from 'marked'
import hljs from 'highlight.js'

export default {
    ready(){
       this.fetchData();
       marked.setOptions({
         highlight: function (code) {
           return hljs.highlightAuto(code).value;
         }
       });
    },
    data(){
      return {
      }
    },
    computed:{
       blogData:function(){
          if(this.$store.state.blogData) return this.$store.state.blogData[0];
       },
       islogin:function(){
          return this.$store.state.islogin;
       },
       htmlStr:function(){
         if(this.$store.state.blogData) return marked(this.$store.state.blogData[0].content);
       }
    },
    components:{

    },
    methods:{
      fetchData(){
        axios.get('/getBlog',{
          params:{
             blogId:this.$route.params.id
          }
        }).then((response)=>{
          var data = response.data;
          data.forEach((val)=>{
              this.getCategoryForBlog(this.$route.params.id);
              val.category=[];
          });
          this.$store.commit('getBlogData',{
             data:data
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
            var data = { blogId :id, data: response.data};
            this.$store.commit('addTagsForBlog',{
                data:data
            });
        }).catch(function(error){
            console.log(error);
        });
      },
      displayTime(timeStr){
          return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
          //return moment(timeStr).fromNow();
      },
      update(){
         console.log("You are going to update.");
      },
      instance (title){
         const content = '<p>确定要删除当前博客么？</p>';
         this.$Modal.confirm({
             title:title,
             content:content,
             onOk:()=>{
               axios.post('/deletePost',
                 {
                   blogId: this.$route.params.id
                 }
               ).then((response) => {
                   var data = response.data;
                   if(data=='ok'){
                     this.$Notice.success({
                          title: '删除成功',
                          desc:  '该博客已成功删除。'
                     });
                     //重定向到index
                     this.$router.replace("{ name : 'index'}");
                   }
                 }).catch((error)=>{
                   console.log(error);
                 });
             },
             onCancel:()=>{
               console.log("cancel to delete");
             }
         });
      }
    }
};
</script>

<style scoped>
@import "./../css/github-markdown.css";
@import "./../css/default.css";
.post{
    box-shadow: 0px 0px 2px rgba(0,0,0,0.3);
    width: 100%;
    padding: 16px;
    margin-top: 20px;
}
.info{
    color: #01579b;
    margin: 5px;
}
.category{
    margin-left: 5px;
}
.meta{
    margin-bottom: 18px;
    line-height: 20px;
    color: #8c8c8c;
    font-size: 12px;
    border-bottom: 1px solid #e7e7eb;
}
.description{
    padding: 16px;
    box-shadow: 0 0 1px rgba(0,0,0,0.3);
}
.description p{
    padding: 5px;
}
.update,.delete{
    border: none;
    background: transparent;
    color:#8c8c8c;
    padding-left: 5px;
    padding-right: 5px;
}
.update.active,.delete.active{
    color:#000;
    cursor: pointer;
}
.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
}
.markdown-body img{
   height: 100%;
   width: 100%;
   box-shadow: 0 0 10px rgba(0,0,0,0.3);
   margin: 10px 0;
}
</style>
