<template>
<div>
  Hello Lobby - Select players and game type, start the game here.

<!--  Create a game -->
  <Button value="Create Game">Create Game</Button>

<!--  Join a game via game id -->

</div>
</template>

<script>
import axios from "axios";
import Button from "primevue/button";

export default {
  name: "GameLobby",
  components: {
    Button
  },
  data() {
    return {
      friends_cache: [],
      turn: 0,
      current_player: {}
    }
  },
  created() {
    this.get_players();
  },

  methods: {
    get_players() {
      axios.get('http://localhost:8000/players')
          .then(response => {
            this.friends_cache = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    }
}}

</script>

<style scoped>

</style>
