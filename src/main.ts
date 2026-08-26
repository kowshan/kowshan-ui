import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ── Fonts ──────────────────────────────────────────
import './fonts.css'

// ── K UI kit styles ────────────────────────────────
import './ui-kit/assets/ui-kit.css'
import './ui-kit/assets/calendar.css'

// ── Showcase page styles ───────────────────────────
import './style.css'

createApp(App).use(router).mount('#app')
