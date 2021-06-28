<template>
  <div class="bg-black q-pa-xl">

    <h2>{{group.script.intro.header}}</h2>

    <p class="linebreak">{{parse(group.script.intro.text)}}</p>

    <div class="row q-gutter-md">
      <div>
        <q-btn :label="group.iRoom < 0 ? 'Vänta på fler vänner' : 'Bjud in fler vänner'" color="primary" @click="invitePrompt = true"/>
      </div>
      <div>
        <q-btn label="Starta äventyret!" color="primary" @click="start" :disable="group.iRoom >= 0"/>
      </div>
    </div>

    <q-dialog v-model="invitePrompt" persistent>
      <q-card class="bg-primary">
        <q-card-section>
          <p>
            <strong>Bjud in vänner!</strong><br>
            https://escapezoom-se.web.app/join/{{group.id}}
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ok" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="startPrompt" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{group.script.intro.dialogs.start.text}}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :label="group.script.intro.dialogs.start.button" @click="nextRoom" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'

import helpers from '../js/helpers.js'

export default {
  name: 'AdventureStart',
  components: {
  },
  props: {
    room: Object
  },
  data () {
    return {
      startPrompt: false,
      invitePrompt: false
    }
  },
  computed: {
    ...mapState('socket', ['idClient', 'group']),
    friends: function () {
      return this.group.clients.filter(c => c.id !== this.idClient)
    },
    /* parsed: function () {
      return helpers.ParseVariables(this.room.text, this)
    }, */
    crew () {
      let str = 'Du'
      if (this.friends.length) {
        this.friends.forEach(f => {
          str += ', ' + f.personal.name
        })
        str = str.replace(/,([^,]*)$/, ' och' + '$1')
      } else {
        str += ' och din vän'
      }
      return str
    }
  },
  watch: {
    'group.iRoom': function (val, prev) {
      if (prev === -1) {
        this.startPrompt = true
      }
    }
  },
  methods: {
    start () {
      this.$store.dispatch('socket/nextRoom', { id: this.group.id })
    },
    nextRoom: function () {
      this.$emit('nextRoom')
    },
    parse (text) {
      return helpers.ParseVariables(text, this)
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

.linebreak {
    white-space: pre-line
}

</style>
