<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Create Players</h2>
    <div>
      <form @submit.prevent="create_player">
        <input type="text" v-model="player_name" placeholder="Enter your name">
        <input type="submit" value="Create Player">
      </form>

        <div v-if="current_game">
          <p>Game Format: {{ current_game }}</p>
        </div>

        <div v-else>
          <form @submit.prevent="start_game">
          <div>
            <h2>Game Format</h2>
            <select v-model="selected_type" aria-label="Game Type">
              <option v-for="(format, key) in game_types" :key="key">
                {{ format }}
              </option>
            </select>
          </div>
          <select v-model="selected_players" multiple>
            <option v-for="player in players" :value="player.id" v-bind:key="player.id">{{ player.name }}</option>
          </select>
          <input type="submit" value="Start Game">
        </form>
    </div>
</div>



    <!--    Table showing all players with an option to add to game -->
    Players: {{ selected_players }}
    Turn: {{ turn }}

    <!--    Input score on dart game -->
    <div v-if="current_game">
      <h2>Score</h2>
      {{ current_player.name }}'s turn
      <form @submit.prevent="throw_dart">
        <input type="number" v-model="dart.score" placeholder="Enter your score">
        <input type="number" v-model="dart.multiplier" placeholder="Enter your multiplier">
        <input type="submit" value="Add Score">
      </form>
    </div>

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
  props: {
    msg: String
  },
  data() {
    return {
      player_name: '',
      game_types: {
        '1': 'Cricket',
        '2': '301',
        '3': '501'
      },
      selected_type: null,
      players: [],
      selected_players: [],
      current_game: null,
      dart_cache: [],
      turn: 0,
      dart: {
        score: 0,
        multiplier: 0,
      },
    }
  },
  computed: {
    game_type: function () {
      return this.game_types[this.selected_type];
    },
    current_player: function () {
      // let round = this.turn % this.selected_players.length;
      let player_id = this.selected_players[Math.floor(this.turn / 3) % this.selected_players.length];
      return this.players.find(player => player.id === player_id);
    }

  },
  created() {
    this.get_players();
  },

  methods: {
    get_players() {
      axios.get('http://localhost:8000/players')
          .then(response => {
            this.players = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    },
    create_player: function () {
      axios.post('http://localhost:8000/player', {name: this.player_name})
          .then(response => {
            this.players.push(response.data);
          })
          .catch(error => {
            console.log(error);
          })
    },
    start_game: function () {
      axios.post('http://localhost:8000/game', {players: this.selected_players, format: this.selected_type})
          .then(response => {
            console.log(response);
            this.current_game = response.data;
          })
          .catch(error => {
            console.log('THIS IS AN ERROR');
            console.log(error);
          });
    },
    throw_dart: function () {
      axios.post('http://localhost:8000/dart', {score: this.dart.score, multiplier: this.dart.multiplier, player_id: this.current_player.id, game_id: this.current_game.id})
          .then(response => {
            // this.dart_history.push(response.data);
            console.log(response);
            this.get_darts();
            this.turn++;
          })
          .catch(error => {
            console.log(error);
          })
    },
    get_darts: function () {
      axios.get('http://localhost:8000/dart/' + this.current_game.id)

          .then(response => {
            this.dart_cache = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    }
  }
}
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
