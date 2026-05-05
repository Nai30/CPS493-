<script setup>
import { ref } from 'vue';
import { currentUser, users, setToken, switchUser, showLoginModal, loginEmail, loginPassword, isLoggingIn, performLogin } from '../store/userStore.js';


const isActive = ref(false);

</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <img src="https://bulma.io/images/bulma-logo-white.png" width="112" height="28" alt="Logo">
      </router-link>

      <a role="button" 
         class="navbar-burger" 
         :class="{ 'is-active': isActive }" 
         @click="isActive = !isActive">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarMenu" class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/admin">Admin</router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">Activity</a>
          <div class="navbar-dropdown">
            <router-link class="navbar-item" to="/personal">Personal</router-link>
            <router-link class="navbar-item" to="/stats">Statistics</router-link>
          </div>
        </div>
      </div>

  <div class="navbar-end">
  <div v-if="!currentUser" class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link is-arrowless">
  <div v-if="!currentUser" class="navbar-item">
  <button class="button is-primary is-rounded" @click="showLoginModal = true">
    Log In
  </button>
</div>
    </a>

 
  </div>

  <div v-else class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      <div class="is-flex is-align-items-center">
        <figure class="image is-24x24 mr-2">
          <img class="is-rounded" :src="currentUser.picture || 'https://bulma.io/images/placeholders/32x32.png'">
        </figure>
        <div>
          <p class="is-size-7 has-text-weight-bold">{{ currentUser.name }}</p>
          <p class="is-size-7 has-text-grey">@{{ currentUser.username }}</p>
        </div>
      </div>
    </a>

    <div class="navbar-dropdown is-right">
      <router-link to="/personal" class="navbar-item">My Profile</router-link>
      <hr class="navbar-divider">
      <a class="navbar-item has-text-danger" @click="currentUser = null">
        Log Out
      </a>
    </div>
  </div>
</div>
    </div>
  </nav>
  <div :class="['modal', { 'is-active': showLoginModal }]">
  <div class="modal-background" @click="showLoginModal = false"></div>
  <div class="modal-content">
    <div class="box p-6">
      <h3 class="title is-4">Welcome Back</h3>
      <p class="subtitle is-6">Enter your credentials to continue</p>

      <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left">
          <input v-model="loginEmail" class="input" type="email" placeholder="alice123@gmail.com">
          <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
        </div>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control has-icons-left">
          <input v-model="loginPassword" class="input" type="password" placeholder="*******">
          <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
        </div>
      </div>

      <div class="buttons is-right mt-5">
        <button class="button is-text" @click="showLoginModal = false">Cancel</button>
        <button 
          :class="['button', 'is-primary', { 'is-loading': isLoggingIn }]" 
          @click="performLogin"
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="showLoginModal = false"></button>
</div>
</template>

<style scoped>
/* This makes the navbar stand out more */
.navbar {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
}
</style>