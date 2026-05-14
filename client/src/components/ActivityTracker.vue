<script setup>
import { ref, onMounted } from 'vue'
import { currentUser, token, API_URL } from '../store/userStore.js'
import { useInfiniteScroll } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

// --- LOGIC ---
const activities = ref([])
const isAddingLoading = ref(false)
const newActivity = ref('')
const editingId = ref(null)
const editText = ref('')

async function fetchActivities() {
  try {
    const response = await fetch(`${API_URL}/activities/my-activities`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const result = await response.json()
    if (result.isSuccess) {
      activities.value = result.data
    }
  } catch (error) {
    console.error("Failed to fetch:", error)
  }
}

onMounted(() => { fetchActivities() })

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
      // ✅ Send the fields your backend expects
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
      activities.value.unshift(result.data)
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
      activities.value = activities.value.filter(a => a.id !== id)
    }
  } catch (error) { console.error("Failed to delete:", error) }
}

// --- INFINITE SCROLL ---
const el = useTemplateRef('el')
const data = ref([1, 2, 3, 4, 5, 6])

const { reset } = useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...moreData)
  },
  {
    distance: 10,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  }
)

function resetList() {
  data.value = []
  reset()
}
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

          <div v-if="activities.length > 0">
            <h3 class="label mb-4">Your Recent Movement</h3>
            <div v-for="activity in activities" :key="activity.id" class="box activity-item p-4">
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
</style>