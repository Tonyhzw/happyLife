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
             <Row type="flex" class="meta">
                <i-col offset="16" span="4" class="time">{{displayTime(blogData.writeTime)}}</i-col>
                <i-col span="2">浏览量: <span class="count">8</span></i-col>
                <a span="1" class="update active" @click="update" v-if="islogin">编辑</a>
                <span class="update" span="1" v-else>编辑</span>
                <a span="1" class="delete active" @click="instance('警告')" v-if="islogin">删除</a>
                <span class="delete" span="1" v-else>删除</span>
             </Row>
             <div class="main-content">
               <p>{{blogData.content}}</p>
             </div>
           </div>
        </Row>
    </div>
</div>
</template>
<script>
import axios from "axios";
import moment from "moment"
export default {
    ready(){
       this.fetchData();
    },
    computed:{
       blogData:function(){
          if(this.$store.state.blogData) return this.$store.state.blogData[0];
       },
       islogin:function(){
          return this.$store.state.islogin;
       }
    },
    components:{

    },
    methods:{
      fetchData(){
        axios.get('/getBlog',{
          params:{
             blogId:this.$route.params.id
          },
          baseURL:'http://127.0.0.1:8081'
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
          },
          baseURL:'http://127.0.0.1:8081'
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
          //return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
          return moment(timeStr).fromNow();
      },
      update(){
         console.log("You are going to update.");
      },
      instance (title){
         const content = '<p>确定要删除当前博客么？</p>';
         this.$Modal.confirm({
             title:title,
             content:content,
             onOk:function(){
                console.log("ok to delete");
             },
             onCancel:function(){
               console.log("cancel to delete");
             }
         });
      }
    }
};
</script>

<style scoped>
.post{
    box-shadow: 0px 0px 2px rgba(0,0,0,0.3);
    width: 100%;
    padding: 16px;
    margin-top: 20px;
}
.title{
    font-size: 28px;
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
    font-size: 14px;
    border-bottom: 1px solid #e7e7eb;
}
.meta .time{
    padding-right: 20px;
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
</style>
