import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const state = {
      islogin:false,
      blogData:null,
      categoryForSingle:null,
      candicateArr:[],
      cateAllArr:[]
};

const store = new Vuex.Store({
     state:state,
     mutations:mutations,
     actions:actions,
     plugins: [
      /*有效期与cookie的session有效期一致*/
      createPersistedState({ storage: window.sessionStorage })
    ]
});

export default store;
