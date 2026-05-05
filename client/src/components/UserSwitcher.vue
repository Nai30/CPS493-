<script setup>
import { currentUser, switchUser, users } from '@/store/userStore.js'
</script>

<template>
    <div class="box">
       <h2 class="title is-5">CurrentUser: {{ currentUser.name }} ({{ currentUser.role }})</h2>
        
        <div class="buttons">
            <button
              v-for="user in users"
        :key="user.id"
        class="button is-small"
        @click="switchUser(user.id)">
        {{ user.name }}
    </button>
        </div>


    </div>
</template>

<style lang="scss" scoped>

</style>