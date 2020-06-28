import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowLogin: false,
    name: '',
    isOK: false,
  },
  mutations: {
    toggleLogin(state, value) {
      state.isShowLogin = value
    },
    setOK(state, value) {
      state.isOK = value
    },
    setName(state, value) {
      state.name = value
    }
  },
  actions: {
    toggleLogin(context, value) {
      context.commit('toggleLogin', value)
    },
    setOK(context, value) {
      context.commit('setOK', value)
    },
    setName(context, value) {
      context.commit('setName', value)
    }
  },
  modules: {
  }
})
