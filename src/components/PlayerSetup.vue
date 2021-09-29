<template>
  <b-container fluid class="player">
    <b-row>
      <b-col cols="6" style="padding-top: 0.45em;"><i class="fas fa-user"></i></b-col>
      <b-col cols="6"><b-button variant="waring" @click="$emit('remove')"><i class="fas fa-trash-alt"></i></b-button></b-col>
    </b-row>
    <b-row>
      <b-col cols="12"><b-form-input :value="name" @update="emitUpdate" @click="emitUpdate('')" /></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'PlayerSetup',
  props: {
    id: Number,
    name: String
  },
  methods: {
    emitUpdate: function (newValue) {
      this.$emit('change', this.id, newValue)
    }
  }
}
</script>
<style scoped>
.player {
  background-color: lightgrey;
  border-radius: 5px;
}
</style>
