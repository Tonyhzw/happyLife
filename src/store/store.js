import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
Vue.use(Vuex);

const state = {
      islogin:false,
      loginTips:"",
      blogData:null,
      categoryForSingle:null
};

const store = new Vuex.Store({
     state:state,
     mutations:mutations,
     actions:actions
});

export default store;
