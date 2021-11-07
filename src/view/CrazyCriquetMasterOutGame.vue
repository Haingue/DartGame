<template>
  <b-container fluid id="game">
      <b-row class="mt-1 mb-3">
          <b-col class="title">Crazy criquet master out</b-col>
          <b-col style="text-align: right;">
              <b-button class="menu" @click="$refs['modal-parameters'].show()"><i class="fas fa-ellipsis-v"></i></b-button>
              <b-button class="menu" @click="stopParty"><i class="fas fa-sign-out-alt"></i></b-button>
          </b-col>
      </b-row>
      <b-row class="mb-3">
          <b-col class="dartNumber">{{currentPlayer.dartNumber - currentPlayer.dartCounter}} <i class="fas fa-long-arrow-alt-down"></i></b-col>
      </b-row>
      <b-row v-for="target in this.numbers.filter(n => n.isTarget)" :key="target.value" :class="{target: true, completed: target.isValidated }">
        <b-col>{{target.value}}</b-col>
        <b-col>
            <b-form-rating 
                :value="currentPlayer.validatedShot.reduce((acc, shot) => shot.value === target.value ? acc + shot.progress : acc + 0, 0)"
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
              <Player :id="player.id" :name="player.name" :score="player.score" :selected="idx === currentPlayerIdx"/>
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

        <p class="my-4">Règles crazy cricket master out</p>
        <ul>
            <li>6 chiffres sont choisit de manière aléatoire parmi tous les chiffres. </li>
            <li>lorsque tous les joueurs ont joué les chiffres qui n’ont pas été fermé changent de manière aléatoire. </li>
        </ul>
        <p class="my-4">Pour fermer un chiffre il faut le toucher 3 fois ( ou un triple ) </p>
        <p class="my-4">Si un chiffre est fermé par un joueur les touches des autres joueurs dans le chiffre sont validés. ( exemple : je suis joueur 1 je fais 2 fois le 14 et que toi tu es joueur 2 et que tu fermes le 14 lors du tour suivant tous les chiffres qui ne sont pas fermés sauf le 14 vont changer et le jouer 1 aura 2 touches de validé dans le 14.) </p>
        <p class="my-4">Pour le contage des points c’est simple:</p>
        <ul>
            <li>Si tu touches un nombre qui fait parti des 6 chiffres que tu dois fermer tu ne prends pas de points. </li>
            <li>Si tu touches un chiffre qui ne fait pas parti des 6 chiffres que tu dois fermer tu prends le nombre de point correspondant à ta touche.</li>
            <li>Si tu ne touches pas la cible tu prends une pénalité de 25 points. </li>
        </ul>
        <p class="my-4">Lorsque un joueur a fermé un chiffre, à chaque fois qu’il le retouchera il donnera le nombre de points correspondant à tous les joueurs qui n’ont pas encore fermé ce chiffre. 
        Quand tous les joueurs ont fermé un chiffre il « disparaît » et chaque touche sur se chiffre donnera le nombre de point correspondant au chiffre au joueur qui l’a touché. 
        Pour gagner il faut réussir à fermé les 6 chiffres et avoir le moins de points parmi tous les joueurs. </p>
       <p class="my-4">Si vous avez tout fermé mais que vous avez plus de point qu’un ou plusieurs de vos adversaire, la parti continue tant que vous n’avez pas le plus petit score ou que la personne qui a le plus petit score fermé tous les chiffres !</p>

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
  name: 'CrazyCriquetMasterOutGame',
  components: {
      Player,
      Keyboard,
      Fireworks
  },
  data: function () {
      return {
          currentPlayerIdx: 0,
          currentPlayer: null,
          players: [],
          numbers: [],
          level: 0,
          showFireworks: false,
          fireworksTimeout: null
      }
  },
  methods: {
      stopParty: function () {
          this.$router.push({name: 'Home'})
      },
      initializeLevel: function () {
        this.currentPlayer = this.players[this.currentPlayerIdx]

        // generate numbers
        for (let i = 1; i < 21; i ++) {
            this.numbers.push({
                value: i,
                isTarget: false,
                isValidated: false
            })
        }
        this.numbers.push({
            value: 25,
            isTarget: false,
            isValidated: false
        })
        this.numbers.push({
            value: 50,
            isTarget: false,
            isValidated: false
        })

        // prepare level
        this.prepareNextLevel()
        // prepare players
        this.players.forEach(p => {
            p.validatedShot = []
            p.score = 0
            p.dartNumber = 3
            p.dartCounter = 0
        })
      },
      updateProgress: (target) => {
          console.debug(`Update target value: ${target}`)
      },
      keypress: function (keypress) {
        const progress = keypress.triple ? 3 : keypress.double ? 2 : 1
        const value = keypress.value * progress
        const player = this.currentPlayer
        player.dartCounter++
        console.debug(`Keypress, user: ${JSON.stringify(player)}, key: ${JSON.stringify(keypress)}`)
        let target = this.numbers.find(number => number.value == keypress.value && number.isTarget)
        if (target != null) {
            // the selection is a target number
            let playerShot = player.validatedShot.find(shot => shot.value == keypress.value)
            if (playerShot == null) {
                playerShot = {
                    value: keypress.value,
                    progress: progress
                }
                player.validatedShot.push(playerShot)
            } else {
                playerShot.progress += progress
            }

            if (playerShot.progress > 2 && this.numbers.filter(num => num.isTarget && num.isValidated).length < 6 && !target.isValidated) {
                target.isValidated = true
            } else if (playerShot.progress > 3) {
                this.players.forEach(p => {
                    if (p.id != player.id) p.score += value
                })
            }
        } else {
            // it's a bad target, penality
            player.score += value
        }

        // TODO check if the game is finish
        this.players.forEach(p => {
            let validateShot = 0
            this.numbers.forEach((num) => {
                const shot = p.validatedShot.find(shot => shot.value == num.value)
                if (num.isTarget && shot != null && shot.progress > 2) {
                    validateShot++
                }
            })
            if (validateShot > 5) {
                // TODO check if a player has finish, the game can be continue in order increase score of other players
                this.finishGame()
            }
        })

        if (player.dartCounter >= player.dartNumber) {
            player.dartCounter = 0
            this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length
            this.currentPlayer = this.players[this.currentPlayerIdx]

            if (this.currentPlayerIdx === 0) {
                // new level
                this.prepareNextLevel()
            }
        }
        this.$forceUpdate()
      },
      prepareNextLevel: function () {
        this.level++

        const nbOldTarget = this.numbers.filter(num => num.isTarget && num.isValidated)
        if (nbOldTarget === 6) return
        this.numbers.forEach(n => {
            n.isTarget = n.isValidated && nbOldTarget.length < 6
        })

        const newTarget = this.numbers.filter(num => !num.isTarget)
        for(let i = nbOldTarget.length; i < 6; i++) {
            // choice a number in list
            let idx = Math.floor(Math.random() * newTarget.length);
            this.numbers.find(n => n.value == newTarget[idx].value).isTarget = true
        }
        console.debug('Prepare new level: ', this.numbers.filter(num => num.isTarget))
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
          this.$router.replace({name: 'SetupGame', params: {gameName: 'CrazyCriquetMasterOutGame'}})
      } else {
            this.initializeLevel()
            console.debug(`Load game: players=${JSON.stringify(this.players)}`)
            console.debug(`\tnumbers=${JSON.stringify(this.numbers)}`)
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

.dartNumber {
    font-size: 1.5em;
}

.rules {
    text-align: right;
    border: none;
    background: none;
}
</style>
