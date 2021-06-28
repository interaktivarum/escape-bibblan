import Vue from 'vue'
// import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io'
import store from '../store'

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: process.env.WEBSOCKET_SERVER,
    vuex: {
      store,
      actionPrefix: 'SOCKET_'
    }
  })
)
