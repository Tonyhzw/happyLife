import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'


Vue.use(Vuex);

const state = {
      islogin:false,
      blogData:null,
      categoryForSingle:null,
      cateAllArr:[]
};

const store = new Vuex.Store({
     state:state,
     mutations:mutations,
     actions:actions,
     plugins: [
      /*有效期与cookie的session有效期一致*/
      //createPersistedState({ storage: window.sessionStorage })
      createPersistedState({
        getState: (key) => Cookies.getJSON(key),
        setState: (key, state) => Cookies.set(key, state, { maxAge: 120000,httpOnly:true})
      })
    ]
});

export default store;
