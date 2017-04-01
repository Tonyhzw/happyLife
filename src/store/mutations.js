export default {
    //获取整个博客数据，获取单个标签下的所有博客数据，获取单个博客的数据
    getBlogData(state,payload){
      state.blogData = payload.data;
    },
    //获取单个博客下的所有标签数据
    addTagsForBlog(state,payload){
      var data = payload.data;
      state.blogData.forEach(function(val){
        if(val.blogId == data.blogId){
           val.category = data.data;
        }
      });
    },
    //登陆成功
    loginSuccess(state){
      state.islogin = true;
    },
    //更新候选tag
    getCandicateTags(state,payload){
      state.candicateArr = payload.data;
    },
    //重置tag
    resetCandicateTags(state){
      state.candicateArr = [];
    },
    //获取所有的类别数据
    getCategoryAll(state,payload){
      state.cateAllArr =payload.data;
    }
};
