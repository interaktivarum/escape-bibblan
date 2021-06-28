<template class="AgeSum">
  <div>

    <h2>{{room.header}}</h2>

    <p class="linebreak">{{room.text}}</p>

    <q-btn label="Vänta på fler vänner" class="q-ma-xs" color="positive" @click="waitPrompt = true" :disable="finished"/>
    <q-btn label="Påbörja äventyret" class="q-ma-xs" color="positive" @click="start = true" :disable="finished"/>

    <q-dialog v-model="waitPrompt" persistent>
      <q-card>
        <q-card-section>
          <p v-if="friendsNotReady.length">
            <strong>Hjälp dina vänner!</strong><br>
            Säg till <ClientCard color="negative" v-for="(c,i) in friendsNotReady" :key="i" :client="c" mode="badge" :nameOnly="true" /> att
            <ol>
              <li>Fylla i och spara sina uppgifter.</li>
              <li>Klicka på Spela.</li>
            </ol>
          </p>
          <p>
            <strong>Bjud in vänner!</strong><br>
            https://escapezoom-se.web.app/join/{{group.id}}
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ok" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="finishedPrompt" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Ni tänder era pannlampor och smyger försiktigt ner till magasinet.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ok, nu kör vi!" @click="nextRoom" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'

import ClientCard from 'components/ClientCard.vue'

export default {
  name: 'Room',
  components: {
    ClientCard
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
      // finished: false,
      finishedPrompt: false,
      waitPrompt: false,
      start: false
    }
  },
  computed: {
    ...mapState('socket', ['clientStates']),
    unlocked: function () {
      return this.start
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
    friendsReady: function () {
      return this.friends.filter(c => c.state === this.clientStates.playing)
    },
    friendsNotReady: function () {
      return this.friends.filter(c => c.state !== this.clientStates.playing)
    },
    ageToShow: function () {
      return this.clients[(this.indexSelf + 1) % (this.clients.length)].personal.age
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
    }
  },
  methods: {
    finishedRoom: function () {
      this.finishedPrompt = true
    },
    nextRoom: function () {
      this.$emit('nextRoom')
    }
  }
}
</script>

<style lang="scss" scoped>

.AgeSum {
  background: black;
}

.note {

}

.w {
  min-width: 100px;
}

.linebreak {
    white-space: pre-line
}

</style>
