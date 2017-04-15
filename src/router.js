import VueRouter from 'vue-router';
import Index from './views/index.vue'
import Post from './views/post.vue'
import NewPost from './views/newPost.vue'
import About from './views/about.vue'

const routers = [
     {
        path:'/index',
        component:Index,
        name:'index'
    },
    {
        path:'/post/:id',
        component:Post,
        name:'post'
    },
    {
       path:'/about',
       component:About,
       name:'about'
    },
    {
        path:'/category/:category',
        component:Index,
        name:'category'
    },
    {
       path:'/newPost',
       component:NewPost,
       name:'newPost'
    },
    {
      path:'/updatePost/:id',
      component:NewPost,
      name:'updatePost'
    },
    {
      path: '*',
      redirect: { name: 'index' }
    }
];
//路由配置
var router = new VueRouter({
    // 是否开启History模式的路由, 如果生产环境的服务端没有进行相关配置,请慎用
    history: false,
    routes: routers
});


export default router;
