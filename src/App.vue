<template>

  <div class="main">
    <div v-if="!this.game">
  <GameLobby @enter-game="enterGame"></GameLobby>
    </div>
<!--  <HelloWorld msg="Welcome to Darta"/>-->
    <div v-else>
  <GamePlay :game="this.game" :player="this.player"></GamePlay>
      </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import GameLobby from './components/GameLobby.vue'
import GamePlay from './components/GamePlay.vue'

export default {
  name: 'App',
  props: {
    game_id: String
  },
  components: {
    // HelloWorld,
    GameLobby,
    GamePlay
  },
  data() {
    return {
      game: null
    }
},
  methods: {
    enterGame(game, player) {
      console.log('Hello this is the main app')
      this.game = game
      this.player = player
      console.log(this.game)
      console.log(this.player)
    }

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
