import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Varlet from '@varlet/ui'
// import '@varlet/ui/es/style'
const app = createApp(App)
app.use(router)
app.use(Varlet)
app.mount('#app')
