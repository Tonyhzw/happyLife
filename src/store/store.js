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
      createPersistedState()
    ]
});

export default store;
