import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    background: ''
  },
  getters: {
  },
  mutations: {
    setState: (state, payload) => {
      Vue.set(state, payload.key, payload.value)
    }
  },
  actions: {
  }
}
