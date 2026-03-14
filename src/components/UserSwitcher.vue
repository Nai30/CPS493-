<script setup>
import {ref} from 'vue' //special object that stores a value and automatically updates the UI whenever it changes
import {users} from '@/data/users.js' //import user array that was created
const currentUser = ref(users[0]) // creates a reactive variable called current user, using ref means that if user[] changes it is updated 
function switchUser(id){
    currentUser.value = users.find(u=> u.id ===id) //searches the array for the user put in
    //updates currentUser value dynamically
}
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