<template>
  <q-page>
    <section-row>

      <h2>Börja spela</h2>

      <div v-if="idClient">

        <div v-if="!group">

        <p>
          För att spela tillsammans behöver du och dina vänner en gemensam kod.
        </p>

        <div class="row justify-around q-gutter-lg">

          <q-card class="col-12-xs col-md bg-primary">
            <q-card-section class="q-gutter-md">
              <h3>Jag har en kod</h3>
              <q-form @submit="join">

                <q-input v-model="name" lazy-rules :rules="[ val => val && val.length > 0]" label="Ditt namn" standout bg-color="secondary" label-color="primary" input-class="text-primary text-bold">
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary"/>
                  </template>
                </q-input>

                <q-input bottom-slots lazy-rules :rules="[ val => val && val.length > 0 || 'Har du skapat eller fått en kod av dina vänner? Ange den här.']" v-model="id" label="Ange kod" hint="Har du skapat eller fått en kod av dina vänner? Ange den här." standout bg-color="secondary" label-color="primary" input-class="text-primary text-bold">
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary"/>
                  </template>
                </q-input>

                <br/>

                <q-btn type="submit" label="Starta spelet" color="dark" title="Starta spelet" />

              </q-form>
            </q-card-section>
          </q-card>

          <q-card v-if="!codeRoute" dark class="col-12-xs col-md">
            <q-card-section class="q-gutter-md">

              <h3>Skapa en ny kod</h3>

              <div v-if="!idNew">
                <q-btn @click="createCode" label="Skapa kod" color="primary" class="q-mb-md"/>
                <p>
                  Klicka på knappen för att skapa en ny kod.
                </p>
              </div>
              <div v-else>
                <p>
                Du har skapat koden <strong>{{idNew}}</strong>
                <q-btn @click="copyId" icon="content_copy" color="primary" size="sm" flat dense class="q-ma-xs" title="Kopiera kod"/>
                </p>
                <p>
                    Dela koden med dina vänner, eller kopiera och dela följande länk:
                </p>

                <q-input bottom-slots v-model="url" readonly width="100%" standout bg-color="secondary" >
                  <template v-slot:before>
                    <q-btn @click="copyURL" icon="content_copy" color="primary" class="full-height" title="Kopiera länk"/>
                  </template>
                </q-input>
              </div>
            </q-card-section>

          </q-card>
        </div>
      </div>

      <div v-else>
          <p>
            Du är redan med i spelet med koden: <strong>{{group.id}}</strong>
          </p>
          <div class="q-gutter-md">
            <q-btn :to="{name: 'GroupPlay'}" icon="extension" label="Tillbaka till spelet" color="positive" class="col no-decoration"/>
            <q-btn :to="{name: 'GroupDisconnect'}" icon="logout" label="Avsluta spelet" color="negative" class="col no-decoration"/>
          </div>
      </div>
    </div>
    <div v-else>
      <q-spinner /> Kopplar upp mot server
    </div>

    </section-row>

  </q-page>
</template>

<script>

import { mapState } from 'vuex'

import { copyToClipboard } from 'quasar'

import script from 'components/stories/library/script.json'

export default {
  name: 'PageJoin',
  components: {
  },
  data () {
    return {
      script: script,
      name: '',
      id: '',
      idNew: ''
    }
  },
  computed: {
    ...mapState('socket', ['idClient', 'group', 'clientStates']),
    url: function () {
      return window.location.origin + '/starta/' + this.idNew
    },
    encoded: function () {
      return encodeURI(this.url + this.id)
    },
    codeRoute () {
      return this.$route.params.idGroup
    }
  },
  methods: {
    createCode () {
      this.$socket.emit('generate_code', (response) => {
        this.idNew = response.code
      })
    },
    copyId () {
      copyToClipboard(this.idNew)
      this.$q.notify({
        message: 'Koden har kopierats till urklipp'
      })
    },
    copyURL () {
      copyToClipboard(this.encoded)
      this.$q.notify({
        message: 'Länken har kopierats till urklipp'
      })
    },
    join: function (e) {
      this.$store.dispatch('socket/joinGroup', { id: this.id, script: this.script })
      // this.$store.dispatch('socket/setClientState', { state: this.clientStates.entered })
      this.$store.dispatch('socket/setClientPersonal', { personal: { name: this.name } })
      this.$store.dispatch('socket/setClientState', { state: this.clientStates.ready })
      this.$store.commit('setState', { key: 'menuOpen', value: false })
      this.$router.push({ name: 'GroupPlay', params: { idGroup: this.id } })
    }
  },
  mounted: function () {
    this.id = this.codeRoute || ''
  }
}
</script>
