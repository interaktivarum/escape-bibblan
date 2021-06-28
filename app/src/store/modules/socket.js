import Vue from 'vue'
import Vuex from 'vuex'

import { Notify } from 'quasar'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    idClient: '',
    group: null,
    clientStates: { none: 0, entered: 1, ready: 2, playing: 3 }
  },
  getters: {
    getClientSelf: state => {
      try {
        return state.group.clients.find(c => c.id === state.idClient)
      } catch (e) {}
    },
    getClientByID: state => id => {
      return state.clients.find(c => c.id === id)
    },
    getClientsByIDs: state => ids => {
      return ids.map(id => state.clients.find(c => c.id === id))
    }
  },
  mutations: {
    setState: (state, payload) => {
      Vue.set(state, payload.key, payload.value)
    },
    setIdClient: (state, payload) => {
      Vue.set(state, 'idClient', payload.id)
    },
    setGroup: (state, payload) => {
      Vue.set(state, 'group', payload.group)
    },
    setClients: (state, payload) => {
      Vue.set(state, 'clients', payload.clients)
    }
  },
  actions: {
    testNotify: (ctx, payload) => {
      Vue.prototype.$socket.emit('test_notify', { msg: 'Ett testmeddelande!' })
    },
    joinGroup: (ctx, payload) => {
      Vue.prototype.$socket.emit('join_group', payload /* id, script */)
      // ctx.dispatch('setClientState', { state: ctx.state.clientStates.entered })
    },
    leaveGroup: (ctx, payload) => {
      Vue.prototype.$socket.emit('leave_group', { id: payload.id })
    },
    setClientReady: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_client_ready', { ready: payload.ready })
    },
    setClientState: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_client_state', { state: payload.state })
    },
    setClientPersonal: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_client_personal', { personal: payload.personal, merge: payload.merge })
    },
    setGroupScript: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_group_script', { script: payload.script })
      // Vue.prototype.$socket.emit('set_group_next_room', { id: payload.id })
    },
    startGame: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_group_start', { id: payload.id, script: payload.script })
      // Vue.prototype.$socket.emit('set_group_next_room', { id: payload.id })
    },
    nextRoom: (ctx, payload) => {
      Vue.prototype.$socket.emit('set_group_next_room', { id: payload.id })
    },
    showClue: (ctx, payload) => {
      Vue.prototype.$socket.emit('show_clue', payload /* idRoom, idClue */)
    },
    addGuess: (ctx, payload) => {
      Vue.prototype.$socket.emit('add_guess', payload /* idRoom, guess */)
    },

    // SOCKET.IO EVENTS
    SOCKET_connect: ctx => {
      console.log('Connected to server')
    },
    SOCKET_id: (ctx, payload) => {
      // if an old client id is stored in sessionStorage: use it to register Client at server
      const idClient = sessionStorage.getItem('idClient')
        ? sessionStorage.getItem('idClient')
        : payload.id
      Vue.prototype.$socket.emit('register_client_id', {
        id: idClient
      })
    },
    SOCKET_client_id_registered: ({ state, commit, dispatch }, payload) => {
      console.log('Client registered: ' + payload.client.id)
      console.log(payload.client)
      commit('setIdClient', { id: payload.client.id })
      sessionStorage.setItem('idClient', payload.client.id)
      if (payload.client.idGroup) {
        dispatch('joinGroup', { id: payload.client.idGroup })
      }
    },
    SOCKET_group_updated: (ctx, payload) => {
      ctx.commit('setGroup', { group: payload.group })
      sessionStorage.setItem('group', payload.group)
    },
    /* SOCKET_game_started: (ctx, payload) => {
      ctx.commit('setGroup', { group: payload.group })
      sessionStorage.setItem('group', payload.group)
    }, */
    SOCKET_clients_updated: (ctx, payload) => {
      ctx.commit('setClients', { clients: payload.clients })
    },
    SOCKET_notify_client: (ctx, payload) => {
      console.log(payload.msg)
      Notify.create({
        message: payload.msg,
        type: payload.type,
        position: 'top',
        actions: [
          {
            label: 'Ok',
            color: 'white'
          }
        ]
      })
    }
  }
}
