<template>
  <q-page v-if="group" class="PageAdventure flex column" :style="{'background-image': 'url('+backgroundPath+')'}">

    <div class="row justify-around ofh">
      <q-btn-toggle
        v-model="slideRoom"
        :options="carouselOptions"
        color="dark"
        toggle-color="primary"
        class="scroll"
        @update="onSlideChange"
        ref="buttons"
      />
    </div>

    <div class="col row flex-center">
      <q-carousel
      v-model="slideRoom"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      class="bg-transparent"
      :class="{'q-ma-xl': !$q.screen.lt.md}"
      height="100%">
        <q-carousel-slide :name="0" class="col full-width">
          <AdventureStart @nextRoom="nextRoom"/>
        </q-carousel-slide>
        <q-carousel-slide v-for="(room,i) in group.script.rooms" :name="i+1" :key="i" class="col full-width">
          <div class="row flex-center">
            <Room :room="room" :group="group" :clientSelf="getClientSelf" :idClient="idClient" :iRoom="i" @nextRoom="nextRoom"/>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="group.script.rooms.length + 1" class="col full-width">
          <AdventureSummary />
        </q-carousel-slide>
      </q-carousel>

    </div>

  </q-page>
</template>

<script>

// const group = sessionStorage.getItem('script')

// import { defineAsyncComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'

import helpers from '../js/helpers.js'

import Room from 'components/Room'
import AdventureStart from 'components/AdventureStart'
import AdventureSummary from 'components/AdventureSummary'

export default {
  name: 'PageAdventure',
  components: {
    Room,
    AdventureStart,
    AdventureSummary
  },
  props: {
  },
  data () {
    return {
      slideRoom: 0
    }
  },
  computed: {
    // ...mapState(['script']),
    ...mapState('socket', ['idClient', 'group', 'clientStates']),
    ...mapState('adventure', ['background']),
    ...mapGetters('socket', ['getClientSelf']),
    carouselOptions () {
      const start = [{ label: this.group.script.name, value: 0 }]
      const rooms = this.group.script.rooms.map((r, i) => ({ label: r.name, value: i + 1, disable: this.group.iRoom < i }))
      const summary = { label: 'Grattis!', value: this.group.script.rooms.length + 1, disable: this.group.iRoom < this.group.script.rooms.length }
      return start.concat(rooms.concat(summary))
    },
    backgroundPath () {
      // return 'graphics/' + this.background
      const room = this.slideRoom - 1 <= this.group.script.rooms.length ? this.group.script.rooms[this.slideRoom - 1] : null
      const background = room && room.background ? room.background : this.group.script.background
      return this.imagePath(background)
    },
    script () {
      return this.group.script
    }
  },
  watch: {
    slideRoom () {
      this.onSlideChange()
    },
    'script.background': {
      immediate: true,
      handler () {
        this.$store.commit('adventure/setState', { key: 'background', value: this.script.background })
      }
    }
  },
  methods: {
    nextRoom: function () {
      this.slideRoom++
      this.$nextTick(() => {
        window.scrollTo(0, 0)
      })
    },
    onSlideChange () {
      const button = this.$refs.buttons.$el.getElementsByTagName('button')[this.slideRoom]
      this.$refs.buttons.$el.scrollLeft = button.offsetLeft - 50

      // this.$ref.buttons.$el.scrollIntoView(true)

      // Set background
      /* const room = this.slideRoom <= this.group.script.rooms.length ? this.group.script.rooms[this.slideRoom] : null
      const background = room && room.background ? room.background : this.group.script.background
      this.$store.commit('adventure/setState', { key: 'background', value: background }) */
    },
    imagePath (image) {
      return helpers.ImagePath(image)
    }
  },
  mounted: function () {
    this.slideRoom = this.group.iRoom + 1
    // this.$store.commit('adventure/setState', { key: 'background', value: this.group.script.background })
    /* if (this.getClientSelf.state === this.clientStates.ready) {
      this.$store.dispatch('socket/setClientState', { state: this.clientStates.playing })
    } */
  }
}
</script>

<style lang="scss" scoped>
.PageAdventure {
  background-size: cover;
}

.ofh {
  width: 100%;
  background: $dark;
}

.q-btn-toggle{
  max-width: 100%;
}

.scroll {
  scroll-behavior: smooth;
}
</style>
