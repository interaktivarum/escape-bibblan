<template class="SessionViewer">
  <div v-if="group">

    <div class="row justify-between items-stretch no-wrap">

      <div v-if="route === 'GroupPlay'" class="row col justify-between items-stretch no-wrap">
        <div class="bg-dark row flex-center no-wrap">
          <q-chip icon="lightbulb" dense dark :title="nClues + ' använda ledtrådar'">
            <span v-if="!$q.screen.lt.md">{{nClues}} använda ledtrådar</span>
            <span v-else>{{nClues}}</span>
          </q-chip>
          <q-chip icon="lock" dense dark :title="nClues + ' felgissningar'">
            <span v-if="!$q.screen.lt.md">{{nGuesses}} felgissningar</span>
            <span v-else>{{nGuesses}}</span>
          </q-chip>
        </div>

        <div class="row no-wrap scroll q-pa-xs">
          <q-chip v-for="(client,i) in group.clients" :key="i" icon="person" dense dark :class="{'bordered': client === getClientSelf}">
            {{client.personal.name}}
          </q-chip>
        </div>
      </div>
      <div v-else class="col row">
        <q-btn :to="{name: 'GroupPlay'}" icon="extension" label="Tillbaka till spelet" color="positive" class="col no-decoration"/>
      </div>

      <q-btn stretch @click="disconnectPrompt = true" icon="logout" class="bg-negative text-white" title="Avsluta spelet"/>

    </div>

    <q-dialog v-model="disconnectPrompt" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <strong>Vill du avsluta spelet och lämna gruppen?</strong>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Ja, avsluta" color="negative" @click="disconnect" v-close-popup />
          <q-btn label="Nej, fortsätt spela" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SessionViewer',
  components: {
  },
  props: {
  },
  data () {
    return {
      disconnectPrompt: false,
      tab: 'enter'
    }
  },
  computed: {
    ...mapState('socket', ['idClient', 'group', 'clientStates']),
    ...mapGetters('socket', ['getClientSelf']),
    route: function () {
      return this.$route.name
    },
    nClients: function () {
      return this.group.clients.length
    },
    nReady: function () {
      return this.group.clients.filter(c => c.ready).length
    },
    nWaiting: function () {
      return this.group.clients.filter(c => !c.ready).length
    },
    nClues () {
      let n = 0
      this.group.script.rooms.forEach(r => {
        if (r.clues) {
          n += r.clues.filter(c => c.used).length
        }
      })
      return n
    },
    nGuesses () {
      let n = 0
      this.group.script.rooms.forEach(r => {
        if (r.guesses) {
          n += r.guesses.length
        }
      })
      return n
    }
  },
  methods: {
    disconnect: function () {
      this.disconnectPrompt = false
      this.$router.push({ name: 'GroupDisconnect' })
    }
  }
}
</script>

<style lang="scss" scoped>

.bordered {
  border: 1px solid $secondary;
}

</style>
