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
  <div class="columns is-multiline pt-6">
    <div class="column is-half" v-for="activity in activities" :key="activity.id">
      <div class="box">
        <article class="media">
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
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Add new activity box -->
    <div class="column is-half">
      <div class="box">
        <input
          v-model="newActivity"
          class="input"
          placeholder="New activity"
          @keyup.enter="addActivity"
        />
        <button class="button is-primary mt-2" @click="addActivity">Add Activity</button>
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
</style>