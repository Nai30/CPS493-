<script setup>
import NavBar from './components/NavBar.vue'

</script>

<template>
  <div id="app" class="has-background-light" style="min-height: 100vh;">
    <NavBar />
    
    <main class="py-5">
      <router-view />
    </main>
    
    <footer class="footer has-background-white mt-6">
      <div class="content has-text-centered">
        <p class="is-size-7 has-text-grey">© 2026 Marseille Fitness Tracker | CPS493 Project</p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>

</style>
