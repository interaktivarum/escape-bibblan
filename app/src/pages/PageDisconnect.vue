<template>
  <q-page>

    <div class="row flex-center">

      <div class="col-10">
        <h4>Tack för att du spelade!</h4>
        <p>
          Du har nu avslutat spelet.
        </p>
      </div>
    </div>

  </q-page>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'PageDisconnect',
  components: {
  },
  computed: {
    ...mapState('socket', ['group'])
  },
  mounted: function () {
    this.$store.commit('setState', { key: 'menuOpen', value: true })
    if (this.group) {
      this.$store.dispatch('socket/leaveGroup', { id: this.group.id })
    }
  }
}
</script>
