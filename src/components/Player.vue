<template>
  <b-container fluid :class="{player: true, selected: selected}">
    <b-row>
      <b-col><i class="fas fa-user"></i> {{name}}</b-col>
    </b-row>
    <b-row>
      <b-col><i class="fas fa-star"></i> {{score != null ? score : 0}}</b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Player',
  props: {
    id: Number,
    name: String,
    score: Number,
    selected: Boolean
  }
}
</script>
<style scoped>
.player {
  background-color: lightgrey;
  border-radius: 5px;
}

.player.selected {
  background-color: cadetblue;
}
</style>
