<!-- layouts/DefaultLayout.vue — header + router-view + footer -->
<template>
    <div class="site-shell">
        <AppHeader />
        <main class="site-main">
            <router-view />
        </main>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
</script>

<style scoped>
.site-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.site-main {
    flex: 1 1 0;
    width: 100%;
    overflow-x: clip;
}
</style>
