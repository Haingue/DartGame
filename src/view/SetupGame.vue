<template>
  <b-container fluid id="setupgame">
      <b-row class="mb-5">
          <b-col class="title">Configuration</b-col>
      </b-row>
      <b-row class="mb-3">
          <b-col>{{players.length}} Joueurs</b-col>
          <b-col><b-button variant="primary" @click="addPlayer"><i class="fas fa-plus"></i></b-button></b-col>
      </b-row>
      <b-row class="mb-3">
          <b-col cols="6" v-for="player in players" :key="player.id" class="mb-1">
              <PlayerSetup :id="player.id" :name="player.name" @remove="removePlayer(player.id)" @change="updateName" />
          </b-col>
      </b-row>
      <b-row>
          <b-col><b-button variant="danger" @click="cancel">Retour</b-button></b-col>
          <b-col><b-button variant="success" @click="startGame">Valider</b-button></b-col>
      </b-row>
  </b-container>
</template>

<script>
import PlayerSetup from '../components/PlayerSetup'
export default {
  name: 'SetupGame',
  components: {
    PlayerSetup
  },
  data: function () {
    return {
      serialId: 0,
      players: [{
        id: 0,
        name: 'Joueur 1',
        score: 0
      }]
    }
  },
  methods: {
    addPlayer: function () {
      console.debug('Add new player')
      let player = {
        id: ++this.serialId,
        name: `Player ${this.serialId + 1}`,
        score: 0
      }
      this.players.push(player)
    },
    removePlayer: function (id) {
      console.debug(`Remove player id: ${id}`)
      let idx = this.players.findIndex(p => p.id == id)
      this.players.splice(idx, 1)
      if (this.players.length < 1) {
        this.serialId = -1
      }
    },
    updateName: function (id, newName) {
      this.players.forEach(p => {
        if (p.id == id) {
          p.name = newName
        }
      })
    },
    cancel: function () {
        console.debug('Start new game')
        this.$router.replace({name: "Home"})
    },
    startGame: function () {
        console.debug('Start new game')

        // check players
        this.players.forEach(p => {
          if (p.name.length == 0) {
            p.name = `Joueur ${p.id + 1}`
          }
        })

        this.$store.dispatch('savePlayers', this.players)
        .then(() => {
          this.$router.push({name: "Game"})
        })
        .catch((error) => {
          console.error('Error to save player list in store: ', error)
        })
    }
  }
}
</script>

<style>
</style>
