<template>
  <div class="bg-black q-pa-xl">

    <h2>Grattis, ni har klarat {{group.script.name}}!</h2>

    <div v-for="(room,i) in this.group.script.rooms" :key="i">
      <h3>{{room.name}}</h3>
      <div>
        <strong>Rätt svar:</strong> {{room.password.value}}
      </div>
      <div>
        <strong>Felgissningar:</strong> {{guesses(room)}}
      </div>
      <div v-if="room.clues && room.clues.filter(c => c.used).length">
        <strong>Använda ledtrådar:</strong>
        <div class="row justify-around">
          <div v-for="(clue,i) in room.clues.filter(c => c.used)" :key="i" class="col-xs-12 col-md-4">
            <ClueLook :clue="clue" class="q-ma-sm"/>
          </div>
        </div>
      </div>
    </div>

    <p class="q-mt-xl row">
      <q-btn :to="{name: 'GroupDisconnect'}" icon="logout" label="Avsluta spelet" color="negative" class="col no-decoration"/>
    </p>

  </div>
</template>

<script>

import { mapState } from 'vuex'

import ClueLook from 'components/ClueLook'

export default {
  name: 'AdventureSummary',
  components: {
    ClueLook
  },
  props: {
    room: Object
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('socket', ['group'])
  },
  methods: {
    guesses (room) {
      return room.guesses ? room.guesses.join(', ') : 'inga felaktiga gissningar'
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
