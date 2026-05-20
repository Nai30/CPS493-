
<script setup>
import {users, currentUser} from '../store/userStore.js'
import {ref, onMounted} from 'vue'
const friend= ref([])
const duration= ref([30, 45, 60])
const distance= ref([1, 2, 3])
const randomDur= Math.floor(Math.random() * duration.value.length)
const randomDist= Math.floor(Math.random() * distance.value.length)
async function addFriends(){
    for (const user of users) {
        if (user.name !== currentUser.name) {
            friend.value.push(user)
        }
    }
}
onMounted(() => {
    addFriends()
})
</script>
<template>
  <div class="friends-activity">
       <section class="section">
        <div class="container">
            <h1 class="title">Friends Feed</h1>
            <p class="subtitle">See what your circle has been up to lately.</p>

           
                <div v-for="act in friend" :key="act.id" class="column is-12">
                    <div class="box card-social">
                        <article class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <div class="is-rounded has-background-link has-text-white has-text-centered pt-2">
                                        {{ act.name.charAt(0) || 'F' }}
                                    </div>
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong>{{ act.name || 'A Friend' }}</strong> 
                                       <br>
                                         Just completed <span class="tag is-info is-light">{{ act.activities.steps }}</span> steps!
                                    </p>
                                    <nav class="level is-mobile mt-2">
                                        <div class="level-left">
                                            <div class="level-item has-text-grey">
                                                <span class="icon is-small mr-1"><i class="fas fa-stopwatch"></i></span>
                                                <small>{{ duration[randomDur] }} mins</small>
                                            </div>
                                            <div class="level-item has-text-grey ml-4" v-if="act.distance_km">
                                                <span class="icon is-small mr-1"><i class="fas fa-map-marker-alt"></i></span>
                                                <small>{{ distance[randomDist] }} km</small>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
         

            
        </div>
    </section>
  </div>
</template>


<style scoped>
.friends-activity {
  padding: 1rem;
}
</style>
