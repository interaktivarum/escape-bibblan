<template>
  <q-card class="row ClueLook" @click="showClue">
    <q-btn v-if="!clue.show" @click="show = true" icon="lightbulb" label="Ledtråd" color="primary" class="col" :disable="show"/>
    <div v-if="clue.show" class="col row flex-center q-pa-sm">
        <div v-if="clue.text" class="text-h2 text-secondary text-center">{{clue.text}}</div>
        <img v-if="clue.image" :src="imagePath(clue.image)" />
    </div>
  </q-card>
</template>

<script>

import helpers from '../js/helpers.js'

export default {
  name: 'ClueLook',
  props: {
    time: { type: Number, default: 15 },
    clue: Object
  },
  data () {
    return {
      show: false,
      looking: false
    }
  },
  computed: {
    btn: function () {
      return !this.looking ? 'Leta efter en ledtråd' : 'Letar efter en ledtråd... '
    }
  },
  methods: {
    startLooking: function () {
      this.looking = true
      window.setTimeout(this.showClue, this.time * 1000)
    },
    showClue: function () {
      // this.show = true
      this.$emit('show')
    },
    imagePath (image) {
      return helpers.ImagePath(image)
    }
  }
}
</script>

<style lang="scss" scoped>

  .ClueLook {
    position: relative;
    background: $dark;
  }

  img {
    max-width: 100%;
  }

</style>
