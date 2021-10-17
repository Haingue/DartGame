<template>
  <b-container fluid id="home">
      <b-row>
          <b-col class="title">Dart Game</b-col>
      </b-row>
      <b-row>
          <b-col style="font-size: 10em;"><i class="fas fa-bullseye"></i></b-col>
      </b-row>
      <b-row>
          <b-col><b-button @click="startGame('Game1')">Jeu de Tintinou où on comprend rien</b-button></b-col>
      </b-row>
      <b-row class="mt-3">
          <b-col><b-button @click="startGame('TintinouGame')">Jeu de Tintinou pas trop mal</b-button></b-col>
      </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
      startGame: function (gameName) {
          console.debug(`Setup new ${gameName}`)
          this.$router.push({name: "SetupGame", params: {gameName: gameName}})
      }
  }
}
</script>

<style>
</style>
