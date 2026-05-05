<script setup>
import { onMounted } from 'vue';
import { currentUser ,friendsActivities, fetchFriendsActivities} from '../store/userStore';
onMounted(() => {
  if (currentUser.value) {
    fetchFriendsActivities();
  } else {
    // Show login modal if they aren't logged in
    showLoginModal.value = true;
  }
});
</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Friends Feed</h1>
            <p class="subtitle">See what your circle has been up to lately.</p>

            <div v-if="friendsActivities.length > 0" class="columns is-multiline">
                <div v-for="act in friendsActivities" :key="act.id" class="column is-12">
                    <div class="box card-social">
                        <article class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <div class="is-rounded has-background-link has-text-white has-text-centered pt-2">
                                        {{ act.userName?.charAt(0) || 'F' }}
                                    </div>
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong>{{ act.userName || 'A Friend' }}</strong> 
                                        <small class="ml-2 has-text-grey">{{ new Date(act.date).toLocaleDateString() }}</small>
                                        <br>
                                        Just completed a <span class="tag is-info is-light">{{ act.type }}</span> session!
                                    </p>
                                    <nav class="level is-mobile mt-2">
                                        <div class="level-left">
                                            <div class="level-item has-text-grey">
                                                <span class="icon is-small mr-1"><i class="fas fa-stopwatch"></i></span>
                                                <small>{{ act.duration_min }} mins</small>
                                            </div>
                                            <div class="level-item has-text-grey ml-4" v-if="act.distance_km">
                                                <span class="icon is-small mr-1"><i class="fas fa-map-marker-alt"></i></span>
                                                <small>{{ act.distance_km }} km</small>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <div v-else class="notification is-light has-text-centered py-6">
                <p class="is-size-4 mb-2">🤫 It's quiet in here...</p>
                <p>Add some friends or wait for them to log their next workout!</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.card-social {
    border-left: 5px solid #3273dc;
    transition: transform 0.2s;
}
.card-social:hover {
    transform: translateX(5px);
}
.is-rounded {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}
</style>