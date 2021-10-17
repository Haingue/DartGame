<template>
  <b-container fluid id="game">
      <b-row class="mt-1 mb-3">
          <b-col class="title">Jeu de Tintinou</b-col>
          <b-col style="text-align: right;">
              <b-button class="menu" @click="$refs['modal-parameters'].show()"><i class="fas fa-ellipsis-v"></i></b-button>
              <b-button class="menu" @click="stopParty"><i class="fas fa-sign-out-alt"></i></b-button>
          </b-col>
      </b-row>
      <b-row v-for="target in targets" :key="target.value" :class="{target: true, completed: target.progress === 3}">
        <b-col>{{target.value}}</b-col>
        <b-col>
            <b-form-rating 
                v-model="target.progress"
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
      </b-row>
      <b-row class="mt-3">
          <b-col style="text-align: right;"><button @click="$refs['modal-rules'].show()" class="rules"><i class="fas fa-question-circle"></i></button></b-col>
      </b-row>
      <b-row>
          <b-col>
              <Keyboard @value="keypress"/>
          </b-col>
      </b-row>
      <b-row class="mt-3">
          <b-col cols="6" v-for="(player, idx) in players" :key="player.id" class="mb-1">
              <Player :id="player.id" :name="player.name" :score="player.score" :selected="idx === currentPlayer"/>
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

        <p class="my-4">Le but est de fermer tous les chiffres proposés par le système, tout en minimisant son score.</p>
        <p class="my-4">6 nombres sont choisis par le système, les joueurs devront tenter de tirer 3 fois chaque chiffre (un double ou un triple comptent).</p>
        <p class="my-4">Quand un joueur tire un chiffre étant déjà fermé ou ne faisant pas partie de la liste, ce joueur reçoit la valeur de ce qu'il a touchée en score.</p>
        <p class="my-4">Quand un joueur tire un chiffre déjà fermé, il ajoute la valeur de ce qu'il a touchée à tous les autres joueurs.</p>
        <p class="my-4">La partie se termine quand tous les chiffres ont été choisis une fois.</p>

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
import Player from '../components/Player'
export default {
  name: 'Game1',
  components: {
      Player,
      Keyboard,
      Fireworks
  },
  data: function () {
      return {
          currentPlayer: 0,
          players: [],
          numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,50],
          targets: [],
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
        this.targets.splice(0, this.targets.length)
        for(let i = 0; i < 6 && this.numbers.length > 0; i++) {
            // choice a number in list
            let idx = Math.floor(Math.random() * this.numbers.length);
            let value = this.numbers.splice(idx, 1)
            this.targets.push({
                value: value[0],
                progress: 0
            })
        }
      },
      updateProgress: (target) => {
          console.debug(`Update target value: ${target}`)
      },
      keypress: function (keypress) {
        console.debug(`Keypress, user: ${JSON.stringify(this.players[this.currentPlayer])}, key: ${JSON.stringify(keypress)}`)
        let target = this.targets.find(t => t.value == keypress.value)
        if (target != null) {
            // the selection is a target number
            if (target.progress < 3) {
                // upgrade progress
                target.progress += (keypress.triple ? 3 : keypress.double ? 2 : 1)
            } else {
                // increase score of other player
                this.players.forEach((element, idx) => {
                    if (idx !== this.currentPlayer) {
                        element.score += keypress.triple ? 3 * keypress.value : keypress.double ? 2 * keypress.value : keypress.value
                    }
                });
            }
        } else {
            // it's a bad target, penality
            this.players[this.currentPlayer].score += keypress.triple ? 3 * keypress.value : keypress.double ? 2 * keypress.value : keypress.value
        }
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length

        if (!this.targets.find(t => t.progress < 3)) {
            console.debug('All targets are closed')
            if (this.numbers.length > 0) {
                this.initializeLevel()
            } else {
                this.finishGame()
            }
        }
      },
      finishGame: function () {
          console.debug('The game is finish')
          this.showFireworks = true

          // sort player by score
          this.players = this.players.sort((a, b) => a.score - b.score)

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
          this.$router.replace({name: 'SetupGame', params: {gameName: 'Game2'}})
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
.target {
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
