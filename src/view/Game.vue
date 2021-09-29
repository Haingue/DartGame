<template>
  <b-container fluid id="game">
      <b-row class="mt-1 mb-3">
          <b-col class="title">Game</b-col>
          <b-col style="text-align: right;"><b-button @click="stopParty"><i class="fas fa-sign-out-alt"></i></b-button></b-col>
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
          <b-col>
              <Keyboard @value="keypress"/>
          </b-col>
      </b-row>
      <b-row class="mt-3">
          <b-col cols="6" v-for="player in players" :key="player.id" class="mb-1">
              <Player :id="player.id" :name="player.name" :score="player.score"/>
          </b-col>
      </b-row>

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
  name: 'Game',
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
          this.$router.go(-1)
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
          this.$router.replace({name: 'SetupGame'})
      } else {
            this.initializeLevel()
            console.debug(`Load game: players=${JSON.stringify(this.players)}`)
      }
  }
}
</script>

<style>
.target {
}

.target.completed, .target.completed output {
    background-color: lightgreen;
}
</style>
