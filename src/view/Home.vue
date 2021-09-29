<template>
  <b-container fluid id="home">
      <b-row>
          <b-col class="title">Dart Game</b-col>
      </b-row>
      <b-row>
          <b-col style="font-size: 10em;"><i class="fas fa-bullseye"></i></b-col>
      </b-row>
      <b-row>
          <b-col><b-button @click="startGame">Jouer</b-button></b-col>
      </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
      startGame: function () {
          console.debug('Setup new game')
          this.$router.push({name: "SetupGame"})
      }
  }
}
</script>

<style>
</style>
