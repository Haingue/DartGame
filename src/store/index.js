import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: []
  },
  getters: {
      players: state => {
        return state.players
      }
  },
  mutations: {
    addPlayer (state, player) {
        state.players.push(player)
    },
    removePlayer (state, player) {
        let idx = state.players.findIndex(p => p.id == player.id)
        state.splice(idx, 1)
    },
    savePlayers (state, players) {
        if (players == null) {
            state.players = []
        } else {
            state.players = players
        }
    }
  },
  actions: {
      savePlayers (context, players) {
          context.commit('savePlayers', players)
      }
  }
})