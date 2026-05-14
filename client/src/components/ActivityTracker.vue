<script setup>
import { computed, ref, onMounted, useTemplateRef } from 'vue'
import { currentUser, token, API_URL } from '../store/userStore.js'
import { useInfiniteScroll } from '@vueuse/core'


// --- LOGIC ---
const displayedActivities = ref([]) // For infinite scroll
const currentPage = ref(1)
const pageSize = ref(5)
const totalActivities = ref(0)
const isLoading = ref(false)
const isAddingLoading = ref(false)
const newActivity = ref('')
const editingId = ref(null)
const editText = ref('')
const hasMore = computed(() => displayedActivities.value.length < totalActivities.value)

async function loadPage(page = 1) {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await fetch(`${API_URL}/activities/my-activities?page=${page}&limit=${pageSize.value}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const result = await response.json()
    if (result.isSuccess) {
      if (page === 1) {
        displayedActivities.value = result.data
      } else {
        displayedActivities.value.push(...result.data)
      }
      totalActivities.value = result.total
      currentPage.value = page
    }
  } catch (error) {
    console.error("Failed to fetch:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { loadPage(1) })

async function addActivity() {
  if (newActivity.value.trim() === '') return
  isAddingLoading.value = true
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
   
      body: JSON.stringify({ 
        type: newActivity.value, 
        duration_min: 30, // Default value
        calories: 100,    // Default value
        date: new Date().toISOString(),
        userId: currentUser.value.id 
      })
    })
    const result = await response.json()
    if (result.isSuccess) {
      displayedActivities.value.unshift(result.data)
      totalActivities.value += 1
      newActivity.value = ''
    }
  } finally {
    isAddingLoading.value = false
  }

}

async function deleteActivity(id) {
  try {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const result = await response.json()
    if (result.isSuccess) {
      displayedActivities.value = displayedActivities.value.filter(a => a.id !== id)
      totalActivities.value -= 1
    }
  } catch (error) { console.error("Failed to delete:", error) }
}

// --- INFINITE SCROLL ---
const el = useTemplateRef('el')
//add reset 
 useInfiniteScroll(
  el,
  () => {
    loadPage(currentPage.value + 1)
  },
  {
    distance: 10,
    canLoadMore: () => hasMore.value
  }
)

</script>

<template>
  <section class="section">
    <div class="container">
      
      <div class="columns is-centered">
        <div class="column is-8">
          <div class="level mb-5">
            <div class="level-left">
              <div>
                <h1 class="title is-3">Activity Tracker</h1>
                <p class="subtitle is-6 has-text-grey">Keeping track of your progress, {{ currentUser?.name }}</p>
              </div>
            </div>
          </div>

          <div class="box has-background-primary-light">
            <div class="field has-addons">
              <div class="control is-expanded">
                <input 
                  v-model="newActivity" 
                  class="input is-medium is-rounded" 
                  placeholder="What's your next workout? (e.g. Swimming)" 
                  @keyup.enter="addActivity"
                />
              </div>
              <div class="control">
                <button 
                  :class="['button', 'is-primary', 'is-medium', 'is-rounded', { 'is-loading': isAddingLoading }]" 
                  @click="addActivity"
                >
                  <span class="icon"><i class="fas fa-plus"></i></span>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="isLoading && displayedActivities.length === 0">
            <h3 class="label mb-4">Your Recent Movement</h3>
            <div class="activity-scroll-container">
              <div v-for="n in pageSize" :key="'skeleton-' + n" class="box activity-item p-4">
                <article class="media">
                  <figure class="media-left">
                    <p class="image is-48x48 has-background-grey-light is-rounded-container">
                      <span class="icon is-medium has-text-grey mt-2">
                        <i class="fas fa-running fa-lg"></i>
                      </span>
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <span class="skeleton-text"></span>
                        <br />
                        <small class="skeleton-text small"></small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <button class="button is-white has-text-grey-light" disabled>
                      <span class="icon is-small"><i class="fas fa-times"></i></span>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div v-else-if="displayedActivities.length > 0">
            <h3 class="label mb-4">Your Recent Movement</h3>
            <div ref="el" class="activity-scroll-container">
              <div v-for="activity in displayedActivities" :key="activity.id" class="box activity-item p-4">
                <article class="media">
                  <figure class="media-left">
                    <p class="image is-48x48 has-background-primary-light is-rounded-container">
                      <span class="icon is-medium has-text-primary mt-2">
                        <i class="fas fa-running fa-lg"></i>
                      </span>
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong class="is-size-5">{{ activity?.type }}</strong>
                        <br />
                        <small class="has-text-grey">
                          Logged {{ new Date().toLocaleDateString() }} at {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <button class="button is-white has-text-danger" @click="deleteActivity(activity.id)">
                      <span class="icon is-small"><i class="fas fa-times"></i></span>
                    </button>
                  </div>
                </article>
              </div>
              <div v-if="isLoading" v-for="n in pageSize" :key="'skeleton-' + n" class="box activity-item p-4">
                <article class="media">
                  <figure class="media-left">
                    <p class="image is-48x48 has-background-grey-light is-rounded-container">
                      <span class="icon is-medium has-text-grey mt-2">
                        <i class="fas fa-running fa-lg"></i>
                      </span>
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <span class="skeleton-text"></span>
                        <br />
                        <small class="skeleton-text small"></small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <button class="button is-white has-text-grey-light" disabled>
                      <span class="icon is-small"><i class="fas fa-times"></i></span>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div v-else class="has-text-centered py-6">
            <img src="https://bulma.io/images/placeholders/128x128.png" class="mb-4 opacity-50" style="filter: grayscale(1);">
            <p class="has-text-grey">No activities found. Start your first session above!</p>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activity-scroll-container {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.activity-item {
  border-radius: 15px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.activity-item:hover {
  border-color: #00d1b2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.is-rounded-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.opacity-50 { opacity: 0.5; }

.skeleton-text {
  display: inline-block;
  background: #f0f0f0;
  height: 1em;
  width: 120px;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-text.small {
  width: 80px;
  height: 0.8em;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>