<template>
  <b-container fluid id="game">
      <b-row class="mt-1 mb-3">
          <b-col class="title">Simple criquet</b-col>
          <b-col style="text-align: right;">
              <b-button class="menu" @click="$refs['modal-parameters'].show()"><i class="fas fa-ellipsis-v"></i></b-button>
              <b-button class="menu" @click="stopParty"><i class="fas fa-sign-out-alt"></i></b-button>
          </b-col>
      </b-row>
      <b-row v-for="player, idx in players" :key="player.id" :class="{target: true, completed: currentPlayer === idx}">
        <b-col>{{player.name}}</b-col>
        <b-col>
            <b-form-rating 
                v-model="player.dartCounter"
                icon-empty="circle"
                icon-half="circle-half"
                icon-full="circle-fill"
                icon-clear="slash-circle"
                stars="3"
                no-border
                readonly
                @change="updateProgress(target)"
            />
        </b-col>
        <b-col>{{ player.numbers[0] }}</b-col>
      </b-row>
      <b-row class="mt-3">
          <b-col style="text-align: right;"><button @click="$refs['modal-rules'].show()" class="rules"><i class="fas fa-question-circle"></i></button></b-col>
      </b-row>
      <b-row>
          <b-col>
              <Keyboard @value="keypress"/>
          </b-col>
      </b-row>

      <b-modal id="modal-parameters" ref="modal-parameters" centered size="xl">
        <template #modal-header>Paramètres</template>

        <b-button class="col-12" variant="primary" @click="$refs['modal-parameters'].hide(); finishGame()">Finir partie</b-button>

        <template #modal-footer="{ ok }">
            <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-rules" ref="modal-rules" centered size="xl">
        <template #modal-header>Règles</template>

        <p class="my-4">But: valider le chiffre 20 en premier</p>
        <p class="my-4">Pour commencer, tous les joueurs commencent au chiffre 1.</p>
        <p class="my-4">Chaque joueur a 3 essaies pour réussir à placer une fléchette dans leur chiffre actuel pour passer au chiffre suivant.</p>
        <p class="my-4">Un tir réussi dans un triple, permet de sauter le chiffre suivant.</p>

        <template #modal-footer="{ ok }">
            <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-end" ref="modal-end" centered size="xl">
        <template #modal-header>Partie finie !</template>

        <p class="my-4">Le gagant est: {{players[0] != null ? players[0].name : 'moi'}}</p>
        <br/>
        <ul>
            <li v-for="p in players" :key="p.id">{{p.name}}: {{p.score}}pts</li>
        </ul>

        <template #modal-footer>
            <b-button size="sm" variant="success" @click="validEndOfGame">OK</b-button>
        </template>
      </b-modal>
      <Fireworks v-if="showFireworks" @click="resetFireworks"/>
  </b-container>
</template>

<script>
import Fireworks from '../components/Fireworks.vue'
import Keyboard from '../components/Keyboard.vue'
export default {
  name: 'SimpleCriquetGame',
  components: {
      Keyboard,
      Fireworks
  },
  data: function () {
      return {
          currentPlayer: 0,
          players: [],
          numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, 25, 50],
          level: 1,
          showFireworks: false,
          fireworksTimeout: null
      }
  },
  methods: {
      stopParty: function () {
          this.$router.push({name: 'Home'})
      },
      initializeLevel: function () {
          this.players.forEach((player) => {
              player.dartNumber = 3;
              player.dartCounter = 0;
              player.numbers = [...this.numbers]
          })
          this.players[this.currentPlayer].dartCounter = this.players[this.currentPlayer].dartNumber
      },
      updateProgress: (target) => {
          console.debug(`Update target value: ${target}`)
      },
      keypress: function (keypress) {
        console.debug(`Keypress, user: ${JSON.stringify(this.players[this.currentPlayer])}, key: ${JSON.stringify(keypress)}`)
        const player = this.players[this.currentPlayer]

        if (player.numbers[0] === keypress.value) {
            player.score += keypress.value
            if (keypress.triple) {
                // skip next number
                player.numbers.splice(0, 1)
            }
            // next number
            player.numbers.splice(0, 1)

            if (player.numbers.length == 0) {
                // no numbers remaining, this player win
                this.finishGame()
            }
        }

        player.dartCounter--;
        if (player.dartCounter == 0) {
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length
            this.players[this.currentPlayer].dartCounter = player.dartNumber
        }
      },
      finishGame: function () {
          console.debug('The game is finish')
          this.showFireworks = true

          // sort player by score
          this.players = this.players.sort((a, b) => b.score - a.score)

          this.fireworksTimeout = setTimeout(() => {
              this.showFireworks = false
              this.$refs['modal-end'].show()
          }, 5000)
      },
      resetFireworks: function () {
          console.debug('Reset firework')
          clearTimeout(this.fireworksTimeout)
          this.fireworksTimeout = null
          this.showFireworks = false
          this.$refs['modal-end'].show()
      },
      validEndOfGame: function () {
          this.$refs['modal-end'].hide()
          this.stopParty()
      }
  },
  beforeMount: function () {
      this.players.push(...this.$store.getters.players)
      if (this.players == null || this.players.length == 0) {
          this.$router.replace({name: 'SetupGame', params: {gameName: 'SimpleCriquetGame'}})
      } else {
            this.initializeLevel()
            console.debug(`Load game: players=${JSON.stringify(this.players)}`)
      }
  }
}
</script>

<style>
.menu {
    width: 2.5em;
    margin: 2px;
}

.target.completed, .target.completed output {
    background-color: lightgreen;
}

.rules {
    text-align: right;
    border: none;
    background: none;
}
</style>
