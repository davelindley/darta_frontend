<template>
  <div>

    <!--  Name Input -->

    <div v-if=!player_saved>
      <h1>What shall we call ya?</h1>
      <input type="text" v-model="player.name" placeholder="Enter your name">
      <button @click="createPlayer">Save Name</button>
    </div>
    <div v-else>
      <h1>Thanks {{ player.name }}</h1>
      <h4> Your player id is {{ player.id }}</h4>


    <!-- Join game input with game_id field -->
      <div v-if=!game>
    <div class="join-game">

      <input type="text" placeholder="Enter Game ID" v-model="join_game_id">
      <button @click="joinGame">Join Game</button>
    </div>

    <!--  Button to Create a game -->
    <div class="create-game">
      <button @click="createGame">Create Game</button>
      <input type="checkbox" id="toggle" v-model="scored" @change="toggleScored">
      <label for="toggle">Scored</label>
    </div>
      <!--toggle button for scored/unscored -->
      <div class="toggle">

      </div>
      </div>
    </div>


    <!--  If I am the creator of the game, display invite link-->
  <div v-if = 'game'>
    Game: {{ game }}
    <br>
    Invite Link: {{ invitelink }}

    <!--  List all players who have joined the game -->
    <div class="players">
      <h2>Players</h2>
      <div v-if="game">

        <ul>
          <li v-for="player in game.players" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>

    <div v-if="self_created_game">
    <!--  Close Lobby and Start Game -->
    <div class="start-game">
      <button @click="startGame">Start Game</button>
    </div>
    </div>


    <!--  Popuate lobby button -->
<!--      TODO  make polling -->
    <div v-if="lobbyOpen">
    <div class="populate-lobby">
      <button @click="getPlayersInGame">Populate Lobby</button>
    </div>
    </div>

    <!--  Join a game via game id -->

  </div>
<!--  enter game button -->
  <div v-if="!lobbyOpen">
    <button @click="$emit('enter-game', this.game, this.player)">Enter Game</button>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "GameLobby",
  components: {},
  data() {
    return {
      scored: false,
      join_game_id: "",
      player_saved: false,
      route_cache: [],
      self_created_game: false,
      player: {
        'name': '',
      },
      game: null,
    }
  },
  computed: {
    invitelink: function () {
      try {
        return window.location.origin + '/game/join/' + this.game.id
      } catch {
        return ''
      }
    },
    creatorGame: function () {
      try {
        return this.game.creator.id === this.player.id
      } catch {
        return false
      }
    },
    lobbyOpen: function () {
      try {
        return this.game.open_to_join
      } catch {
        return false
      }
    }
    },
    methods: {
      toggleScored() {
        this.scoring = !this.scoring;
      },
      createPlayer: function () {
        axios.post('http://localhost:8000/player', {player: this.player})
            .then(response => {
              console.log(response.data);
              this.player = response.data;
              this.player_saved = true;
            })
            .catch(error => {
              console.log(error);
            })
      },
      getPlayersInGame: function () {
        axios.get('http://localhost:8000/game/' + this.game.id + '/players')
            .then(response => {
              console.log(response.data);
              this.game.players = response.data;
            })
            .catch(error => {
              console.log(error);
            })
      },
      joinGame: function () {
        axios.post('http://localhost:8000/game/join', {player: this.player, game_id: this.join_game_id})
            .then(response => {
              this.game = response.data;
            })
            .catch(error => {
              console.log(error);
            })
      },
      createGame: function () {
        axios.post('http://localhost:8000/game', {scored: this.scored, player: this.player})

            .then(response => {
              console.log(response);
              this.game = response.data;
              this.self_created_game = true;
            })
            .catch(error => {
              console.log('THIS IS AN ERROR');
              console.log(error);
            });
      },
      startGame: function () {
        axios.post('http://localhost:8000/game/start', {game: this.game, requestor: this.player})
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
            });
      }
    },
    emits: ['enter-game']
  }




</script>

<style scoped>

</style>
