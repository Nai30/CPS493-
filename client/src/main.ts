import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Make sure this points to your router folder
import 'bulma/css/bulma.css';

const app = createApp(App)

app.use(router)
app.mount('#app')
