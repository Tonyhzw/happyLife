import Vue from 'vue';
import VueRouter from 'vue-router';
import App from 'components/app.vue';
import iView from 'iview';
import './css/reset.less';//使用重置主题，应用于全局
import store from './store/store.js';
import router from './router';

Vue.use(VueRouter);
Vue.use(iView);


new Vue({
    el:'#app',
    store,
    router,
    render(h) {
      return h(App)
    }
});
