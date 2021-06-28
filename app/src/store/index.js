import Vue from 'vue'
import Vuex from 'vuex'

import socket from './modules/socket'
import adventure from './modules/adventure'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

/* export default function () {
  const Store = new Vuex.Store({
    modules: {
      socket: socket
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING

  })

  return Store
} */

export default new Vuex.Store({
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
  modules: {
    socket: socket,
    adventure: adventure
    // user: user
  },
  state: {
    menuOpen: false,
    script: {}
  },
  mutations: {
    setState: (state, payload) => {
      Vue.set(state, payload.key, payload.value)
    },
    setScript: (state, payload) => {
      console.log(payload.script)
      state.script = payload.script
    }
  },
  actions: {
    /* startGame: (ctx, payload) => {
      ctx.commit('setScript', { script: payload.script })
      ctx.dispatch('socket/startGame', { id: payload.id })
    } */
  }
})
