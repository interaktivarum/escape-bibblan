<template>
  <q-page class="">

    <div class="row flex-center">
      <div class="col-10">

        <h2>Såhär spelar du Escape Bibblan</h2>

        <p>
          I Escape Bibblan spelar du med dina vänner online, dels på denna webbplats samt i valfritt program för videosamtal.
        </p>
        <p>
          I spelet samarbetar ni för att låsa upp olika rum.
        </p>
        <p>
          Ni samlar ledtrådarna som är unika för varje spelare, så god kommunikation är A och O.
        </p>

        <h2>Instruktioner</h2>

        <h3>1. Starta ett gemensamt videosamtal</h3>
        <p>
          Använd valfri tjänst, t.ex. Zoom, Teams eller Jitsi.
        </p>

          <h3>2. Skapa en kod för spelet</h3>
          <p>
            En av spelarna klickar <router-link :to="{name: 'GroupCreate'}">Börja spela</router-link> och skapar en ny kod.
          </p>

          <h3>3. Dela länken</h3>
          <p>
            Kopiera och dela länken med samtliga spelare.
          </p>

          <h3>4. Starta spelet</h3>
          <p>
            Varje spelare anger sitt namn och klickar <i>Starta spelet</i>.
          </p>

        <q-btn :to="{name: 'GroupCreate'}" label="Börja spela" color="primary"/>

      </div>
    </div>
  </q-page>
</template>

<script>

// import ConnectForm from 'components/ConnectForm'

export default {
  name: 'PageInstructions',
  components: {
  //  ConnectForm
  }
}
</script>
