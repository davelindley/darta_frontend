<template>
<div>

<!--  Get current leg button -->
  <button @click="nextLeg">Next Leg - END CURRENT LEG</button>



    <div v-for="(score, index) in this.scored_target_values" :key="index">
      <label>{{ score }}</label>
      <button :disabled='this.disableDartInput' @click="throwDart(score, 1)">{{ score }}</button>
      <button :disabled='this.disableDartInput' @click="throwDart(score, 2)">{{ score }} x2</button>
      <button :disabled='this.disableDartInput' @click="throwDart(score, 3)">{{ score }} x3</button>
    </div>
  <button @click="nextSet" :disabled="!this.disableDartInput">Submit 3 Darts</button>


  {{ this.current_leg }}


</div>
</template>

<script>
import axios from "axios";
export default {
  name: "GamePlay",
  components: {},
  data (){
    return{
      scored_target_values: [20,19,18,17,16,15,'B'],
      game: null,
      current_turn: 0,
      current_player: null,
      current_leg: null,
      leg: null,
      set: {darts: []},
      dart_template: {score: null, multiplier: null},
    }
  },
  computed: {
    disableDartInput: function () {
      return this.set.darts.length >= 3
    }
  },

  methods: {startGame:function () {
  axios.post('http://localhost:8000/game/start', {game: this.$attrs.game, requestor: this.$attrs.player})
      .then(response => {
        this.game = response.data;
        if (response.data['open_to_join'] === false) {
          console.log('Game is now closed to join');
          // this.enterGame();
        }
      })
      .catch(error => {
        console.log('You do not have permission to start this game');
        console.log(error);
      })
    },
    throwDart: function (value, multiplier) {
    this.set.darts.push({
      score: value,
      multiplier:  multiplier,
      player: this.$attrs.player,
      game: this.$attrs.game,
    })
      console.log(this.set.darts)
    },
    //Writes hand to database, which passes the turn to the next player.
    nextSet() {
      axios.post('http://localhost:8000/game/darts', {game: this.$attrs.game, player: this.$attrs.player, hand: this.set, leg: this.current_leg})

        .then(response => {
          this.game = response.data;
          this.set = [];

        })
        .catch(error => {
          console.log('You do not have permission to submit a hand');
          console.log(error);
        })
    },

    nextLeg: function () {
    this.nextSet(this.set);
      axios.get('http://localhost:8000/leg/next/'+ this.$attrs.game.id)
        .then(response => {
          console.log(response.data);
          console.log('Hello from the next hand function!')
          this.current_leg = response.data;
        })
        .catch(error => {
          console.log(error);
        })}
    ,
    nextPlayer: function () {
      console.log('next player')
},

  //  TODO poll for when it's your turn
    checkTurn: function () {
      console.log('check turn')
    },
  }
}
</script>

<style scoped>

</style>
