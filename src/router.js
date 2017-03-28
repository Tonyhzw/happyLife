const routers = {
    '/index': {
        component(resolve) {
            require(['./views/index.vue'], resolve);
        }
    },
    '/login':{
        component(resolve){
            require(['./views/login.vue'],resolve);
        }
    },
    '/post/:id':{
        component(resolve){
            require(['./views/post.vue'],resolve);
        },
        name:'post'
    },
    '/category/:category':{
        component(resolve){
            require(['./views/index.vue'],resolve);
        },
        name:'category'
    },
    '/newPost':{
       component(resolve){
         require(['./views/newPost.vue'],resolve);
       }
    },
    '/updatePost/:id':{
      component(resolve){
        require(['./views/newPost.vue'],resolve);
      },
      name:'updatePost'
    }
};
export default routers;
