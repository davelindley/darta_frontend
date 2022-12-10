<template>
  <div >
<br>
    <!--    Table showing all players with an option to add to game -->
    Players: {{ player_cache }}
    <br>
    Turn: {{ turn }}
    <br>
    Winner: {{ check_winner }}
    <!--    Input score on dart game -->
    <div v-if="game_cache">
      <h2>Score</h2>
      {{ current_player.name }}'s turn
      <form @submit.prevent="throw_dart">
        <select v-model="dart.score" placeholder="Enter your score">
          <option value=20>20</option>
          <option value=19>19</option>
          <option value=18>18</option>
          <option value=17>17</option>
          <option value=16>16</option>
          <option value=15>15</option>
          <option value=B>14</option>
        </select>
        <select v-model="dart.multiplier" placeholder="Enter your multiplier">
          <option value=1>1</option>
          <option value=2>2</option>
          <option value=3>3</option>
        </select>
        <input type="submit" value="Add Score">
      </form>
    </div>
{{ score_board }}
<!--    Table showing all darts from this game -->
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
          <th>Multiplier</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="saved_dart in dart_cache" :key="saved_dart.id">
          <td>{{ saved_dart.player }}</td>
          <td>{{ saved_dart.score }}</td>
          <td>{{ saved_dart.multiplier }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  components: {},
  props: {
    msg: String
  },
  data() {
    return {
      // player_name: '',
      round_num: 1,
      game_types: {
        '1': 'Cricket',
        '2': '301',
        '3': '501'
      },
      cricket_darts: {
        '1': '20',
        '2': '19',
        '3': '18',
        '4': '17',
        '5': '16',
        '6': '15',
        '7': 'Bull'
      },
      dialog: true,
      selected_type: null,
      friends_cache: [],
      player_cache: [],
      game: null,
      dart_cache: [],
      turn: 0,
      round: [],
      dart: {
        score: null,
        multiplier: null
      },

    }
  },
  current_player: function () {
    let player_id = this.player_cache[Math.floor(this.turn / 3) % this.player_cache.length];
    return this.friends_cache.find(player => player.id === player_id);
  },
  score_board() {
    let score_board = {};
    for (let player_id of this.player_cache) {
      score_board[player_id] = {};
      for (let dart of this.dart_cache) {
        if (dart.player === player_id) {
          if (score_board[player_id][dart.score]) {
            score_board[player_id][dart.score] += dart.multiplier;
          } else {
            score_board[player_id][dart.score] = dart.multiplier;
          }
          if (score_board[player_id][dart.score] >= 3) {
            score_board[player_id][dart.score] = 3;
          }
        }
      }
    }
    return score_board;
  },
  check_winner() {
    let winner = null;
    for (let player_id of this.player_cache) {
      //sum all values for player id in scoreboard
      let sum = Object.values(this.score_board[player_id]).reduce((a, b) => a + b, 0);
      if (sum === 21) {
        winner = player_id;
      }
    }
    return winner;
  }
  ,
  mounted() {
   this.$root.$
  },



  methods: {
    throw_dart: function () {
      axios.post('http://localhost:8000/dart', {score: this.dart.score, multiplier: this.dart.multiplier, player_id: this.current_player.id, game_id: this.game_cache.id})
          .then(response => {
            console.log(response);
            this.get_darts();
            this.turn++;
          })
          .catch(error => {
            console.log(error);
          })
    }
    //TODO listen for the lockLobby event on the bus.
    // lockGame: function () {
    //   this.$root.$on('lockLobby', (game) => {
    //     this.game = game;
    //     this.player_cache = game.players;
    //     this.round_num = game.round_num;
    //
    //   });

    ,
    get_darts: function () {
      axios.get('http://localhost:8000/dart/' + this.game_cache.id)
          .then(response => {
            this.dart_cache = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    }
}}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
