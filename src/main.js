import { createApp } from 'vue';
import App from './App.vue';

import GameLobby from "@/components/GameLobby";
import GamePlay from "@/components/GamePlay";



const app = createApp(App)

app.component('GameLobby', GameLobby);
app.component('GamePlay', GamePlay);

app.mount('#app')
