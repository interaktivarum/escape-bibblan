<template>
  <div class="Room bg-black q-pa-xl">

    <h2>{{room.header}}</h2>

    <p class="linebreak">{{parsed}}</p>

    <div class="row q-gutter-md" v-if="room.buttons">
      <div v-if="room.buttons.invite">
        <q-btn :label="room.buttons.invite.label" color="primary" @click="invitePrompt = true" :disable="finished"/>
      </div>
      <div v-if="room.buttons.continue">
        <q-btn :label="room.buttons.continue.label" color="primary" @click="unlockForce" :disable="finished"/>
      </div>
    </div>

    <div v-if="room.images" class="row justify-around">
      <div v-for="(image,i) in room.images" :key="i" class="col-xs-12 col-md-4">
        <div class="q-ma-sm">
          <img :src="imagePath(image)"/>
        </div>
      </div>
    </div>

    <div v-if="room.password">
      <q-input v-model="passwordEntered" type="text" :label="room.password.label" :hint="'Felgissningar: ' + guesses" standout bottom-slots bg-color="secondary" label-color="primary" input-class="text-primary text-bold" :disable="finished" @keydown.enter="guess">
        <template v-slot:prepend>
          <q-icon :name="finished ? 'lock_open' : 'lock'" color="primary"/>
        </template>
        <template v-slot:append>
          <q-btn label="Gissa" color="primary" @click="guess" :disable="!passwordEntered || finished"/>
        </template>
      </q-input>
    </div>

    <br/>

    <div v-if="room.clues" class="row justify-around">
      <div v-for="(clue,i) in cluesSelf" :key="i" class="col-xs-12 col-md-4">
        <ClueLook :clue="clue" class="q-ma-sm" @show="showClue(clue)"/>
      </div>
    </div>

    <!-- Dialogs -->

    <q-dialog v-model="finishedPrompt" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{room.dialogs.finished.text}}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :label="room.dialogs.finished.button" @click="nextRoom" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'

import helpers from '../js/helpers.js'

import ClueLook from 'components/ClueLook'

export default {
  name: 'Room',
  components: {
    ClueLook
  },
  props: {
    room: Object,
    group: Object,
    clientSelf: Object,
    idClient: String,
    iRoom: Number
  },
  data () {
    return {
      finishedPrompt: false,
      start: false,
      passwordEntered: '',
      unlockedForce: false,
      unlockedPassword: false,
      idClue: 0
    }
  },
  computed: {
    ...mapState('socket', ['clientStates']),
    cluesSelf: function () {
      return this.room.clues ? this.room.clues.filter((c, i) => i % this.clients.length === this.indexSelf) : []
    },
    unlocked: function () {
      return this.unlockedPassword || this.unlockedForce
    },
    finished: function () {
      return this.group.iRoom > this.iRoom
    },
    clients: function () {
      const c = [...this.group.clients]
      c.sort(function (c0, c1) {
        return c0.personal.age - c1.personal.age
      })
      return c
    },
    indexSelf: function () {
      return this.clients.findIndex(c => c.id === this.idClient)
    },
    friends: function () {
      return this.clients.filter(c => c.id !== this.idClient)
    },
    parsed: function () {
      return helpers.ParseVariables(this.room.text, this)
    },
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
    },
    guesses () {
      return this.room.guesses ? this.room.guesses.join(', ') : 'inga felaktiga gissningar'
    }
  },
  watch: {
    unlocked: function (val) {
      if (this.unlocked && !this.finished) {
        this.$store.dispatch('socket/nextRoom', { id: this.group.id })
      }
    },
    'group.iRoom': function (val, prev) {
      if (prev === this.iRoom) {
        this.finishedRoom()
      }
    },
    finished: {
      immediate: true,
      handler: function (val) {
        if (val && this.room.password) {
          this.passwordEntered = this.room.password.value
        }
      }
    }
  },
  methods: {
    guess () {
      this.passwordEntered = this.passwordEntered.trim()
      if (this.passwordEntered) {
        if (this.passwordEntered.toLowerCase() === this.room.password.value.toLowerCase()) {
          this.unlockedPassword = true
        } else {
          this.$store.dispatch('socket/addGuess', { idRoom: this.iRoom, guess: this.passwordEntered })
        }
      }
    },
    unlockForce: function () {
      this.unlockedForce = true
    },
    finishedRoom: function () {
      this.finishedPrompt = true
    },
    nextRoom: function () {
      this.$emit('nextRoom')
    },
    showClue (clue) {
      this.$store.dispatch('socket/showClue', { idRoom: this.iRoom, idClue: this.room.clues.findIndex(c => c === clue), used: !this.finished })
    },
    imagePath (image) {
      return helpers.ImagePath(image)
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

.Room {
}

.linebreak {
    white-space: pre-line
}

img {
  max-width: 100%;
}

</style>
