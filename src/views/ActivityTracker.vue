<script setup>
import { ref } from 'vue'
import { currentUser } from '../store/userStore.js'

// Reactive array of activities
const activities = ref([
  { id: 1, name: 'Hiking Bear Mountain' },
  { id: 2, name: 'Bike through campus' }
])

const newActivity = ref('')       // For adding new activities
const editingId = ref(null)       // Id of activity being edited
const editText = ref('')          // Temporary text for editing

// Add new activity
function addActivity() {
  if (newActivity.value.trim() === '') return
  activities.value.push({
    id: Date.now(),
    name: newActivity.value
  })
  newActivity.value = ''
}

// Delete activity
function deleteActivity(id) {
  activities.value = activities.value.filter(a => a.id !== id)
}

// Start editing
function startEdit(activity) {
  editingId.value = activity.id
  editText.value = activity.name
}

// Save edit
function saveEdit(id) {
  const activity = activities.value.find(a => a.id === id)
  if (activity) activity.name = editText.value
  editingId.value = null
  editText.value = ''
}

// Cancel edit
function cancelEdit() {
  editingId.value = null
  editText.value = ''
}
</script>

<template>
  <div class="columns is-multiline is-centered pt-6">
    <div class="column is-half" v-for="activity in activities" :key="activity.id">
      <div class="box p-5 shadow-sm">
        <article class="media">

          <div class="media-left">
            <figure class="image is-48x48 has-background-link-light is-rounded is-flex is-justify-content-center is-align-items-center" style="border-radius: 50%;">
              <span class="icon has-text-link">
                <i class="fas fa-running fa-lg"></i>
              </span>
            </figure>
          </div>

          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ currentUser.name }}</strong>
                <br />
                <span v-if="editingId === activity.id">
                  <input v-model="editText" class="input is-small" />
                  <button class="button is-small is-success" @click="saveEdit(activity.id)">Save</button>
                  <button class="button is-small" @click="cancelEdit">Cancel</button>
                </span>
                <span v-else>
                  {{ activity.name }}
                  <button class="button is-small is-info" @click="startEdit(activity)">Edit</button>
                  <button class="button is-small is-danger" @click="deleteActivity(activity.id)">Delete</button>
                </span>
              </p>

              <div v-if="editingId === activity.id" class="field has-addons mt-2">
                <div class="control is-expanded">
                  <input v-model="editText" class="input is-small" />
                </div>
                <div class="control">
                  <button class="button is-small is-success" @click="saveEdit(activity.id)">Save</button>
                </div>
                <div class="control">
                  <button class="button is-small is-light" @click="cancelEdit">Cancel</button>
                </div>
              </div>
          
              
            </div>
          </div>
        </article>
      </div>
    </div>
 <div class="column is-half is-offset-one-third">
      <div class="box p-5 style-input-box" style="border: 2px dashed #3273dc30; background-color: #fafafa;">
        <p class="heading has-text-link has-text-weight-bold mb-3 is-size-6">Track a new session</p>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              v-model="newActivity"
              class="input"
              placeholder="What workout did you conquer today?"
              @keyup.enter="addActivity"
            />
          </div>
          <div class="control">
            <button class="button is-link" @click="addActivity">
              <span class="icon is-small"><i class="fas fa-plus"></i></span>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin-bottom: 1rem;
}
button {
  margin-left: 0.25rem;
  margin-top: 0.25rem;
}
.style-input-box {
  margin: 0 auto;
}
</style>