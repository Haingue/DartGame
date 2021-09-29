<template>
  <b-container fluid class="player">
    <b-row>
      <b-col v-for="v in 20" :key="v" class="key" @click="validValue (v)">{{v}}</b-col>
      <b-col class="key" @click="validValue (25)">25</b-col>
      <b-col class="key" @click="validValue (50)">50</b-col>
    </b-row>
    <b-row>
      <b-col :class="{key: true, enable: doubleEnable}" @click="toggleDouble">Double</b-col>
      <b-col :class="{key: true, enable: tripleEnable}" @click="toggleTriple">Triple</b-col>
    </b-row>

    <b-modal id="modal-key-error" ref="modal-key-error" centered ok-only hide-header-close>
        <p>{{errorMsg}}</p>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'Keyboard',
  data: function () {
    return {
      doubleEnable: false,
      tripleEnable: false,
      errorMsg: "Erreur"
    }
  },
  methods: {
    toggleDouble: function () {
      this.doubleEnable = !this.doubleEnable
      this.tripleEnable = false
    },
    toggleTriple: function () {
      this.doubleEnable = false
      this.tripleEnable = !this.tripleEnable
    },
    validValue: function (v) {
      if ((v == 25 || v == 50) && (this.doubleEnable || this.tripleEnable)) {
        this.errorMsg = `Impossible de faire un ${this.doubleEnable?'double':'triple'} sur un ${v} !`
        this.$refs['modal-key-error'].show()
        return;
      }
      this.$emit('value', {value: v, double: this.doubleEnable, triple: this.tripleEnable})

      this.doubleEnable = false
      this.tripleEnable = false
    }
  }
}
</script>
<style scoped>
.key {
  background-color: lightgrey;
  border-radius: 2px;
  margin: 0.1em;
  font-size: 1.2em;
}
.key:hover {
  opacity: 0.5;
}

.enable {
  background-color: #d3d3d36e;
}
</style>
