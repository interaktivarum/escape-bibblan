<template>
  <div class="Section row flex-center">
    <div class="col-10">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'IntroText',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

  .Section {
    padding: 20px 0 20px 0;
  }

</style>
