<template>
  <q-page>

    <div class="row flex-center q-mt-lg">
      <q-parallax src="~assets/graphics/magasin.jpg" :height="300" class="q-mb-xl rotate">
        <h1 class="text-secondary q-ma-sm">Escape Bibblan</h1>
      </q-parallax>
    </div>

    <section-row>

        <IntroText />

        <h2>Vem smyger ni till magasinet med?</h2>
        <p>
          Bjud in dina vänner för att tillsammans fortsätta berättelsen om natten i biblioteket.
        </p>
        <p>
          När böckerna vaknar till liv möter ni historiska personer som behöver er hjälp att hitta tillbaka till sina egna världar.
        </p>
        <q-btn :to="{name: 'GroupCreate'}" label="Börja spela" color="primary"/>

    </section-row>
  </q-page>
</template>

<script>

import IntroText from 'components/IntroText'

export default {
  name: 'PageIndex',
  components: {
    IntroText
  }
}
</script>

<style type="scss" scoped>
  h1 {
    backdrop-filter: brightness(0.15);
    padding: 20px;
  }

  .rotate {
    width: 90%;
      transform: rotate(-1deg);
  }
</style>
