<template class="">
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-btn stretch flat label="Escape Bibblan" :to="{path: '/'}" />
        <div class="col">
        </div>
      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-primary"
      elevated
    >

      <q-list>
        <q-item-label header class="">
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view class="router" />
    </q-page-container>

    <q-footer elevated>
      <SessionViewer/>
    </q-footer>

  </q-layout>
</template>

<script>

import { mapState } from 'vuex'

import EssentialLink from 'components/EssentialLink.vue'
import SessionViewer from 'components/SessionViewer.vue'
// import SessionViewer from 'components/SessionViewer.vue'

const linksData = [
  {
    title: 'Börja spela',
    caption: 'Skapa en grupp och bjud in dina vänner',
    icon: 'extension',
    link: '/starta'
  },
  {
    title: 'Såhär spelar du',
    caption: 'Instruktioner för att spela',
    icon: 'lightbulb',
    link: '/instruktioner'
  },
  {
    title: 'Om Escape Bibblan',
    caption: 'Information om spelet',
    icon: 'info',
    link: '/om'
  }
]

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    SessionViewer
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    ...mapState(['menuOpen']),
    ...mapState('socket', ['group'])
  },
  watch: {
    menuOpen (val) {
      this.leftDrawerOpen = val
    }
  }
}
</script>

<style lang="scss" scoped>

.q-layout {
  background: black;
  color: white;
}

.router{
  padding-bottom: 50px;
}

</style>
