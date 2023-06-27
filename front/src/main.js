/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './router/index.js'
// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

const app = createApp(App)
app.use(router)

registerPlugins(app)

app.mount('#app')
