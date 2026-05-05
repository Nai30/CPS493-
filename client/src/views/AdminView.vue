<script setup>
import { fetchAllUsers, currentUser, users, deleteUser,updateUser } from '../store/userStore.js';
import { computed, ref, onMounted} from 'vue';

onMounted(() => {
  fetchAllUsers();
});
// Check if current user is an admin
const isAdmin = computed(() => currentUser.value?.role === 'admin');

// Calculate some quick stats for the admin dashboard
const totalUsers = computed(() => users.value.length);
const totalAdmins = computed(() => users.value.filter(u => u.role === 'admin').length);

const isEditModalActive = ref(false);
const editingUser = ref({
  id: null,
  name: '',
  role: '',
  profile: { location: '' }
});

function startEdit(user) {
  // Use a deep copy so the table doesn't change while you're typing in the modal
  editingUser.value = JSON.parse(JSON.stringify(user));
  isEditModalActive.value = true;
}

async function saveEdit() {
  // We send the ID separately to the URL, and the data in the body
  await updateUser(editingUser.value.id, {
    name: editingUser.value.name,
    role: editingUser.value.role,
    profile: {
      ...editingUser.value.profile,
      location: editingUser.value.profile.location
    }
  });
  isEditModalActive.value = false;
}

</script>

<template>
  <section class="section">
    <div class="container">
      
      <div v-if="!isAdmin" class="hero is-light is-medium has-text-centered is-rounded box">
        <div class="hero-body">
          <span class="icon is-large has-text-danger mb-4">
            <i class="fas fa-lock fa-3x"></i>
          </span>
          <h1 class="title">Access Denied</h1>
          <h2 class="subtitle">You need Admin privileges to view this page.</h2>
          <p>Please switch to an administrator account in the navbar.</p>
        </div>
      </div>

      <div v-else>
        <div class="level">
          <div class="level-left">
            <h1 class="title">Admin Control Center</h1>
          </div>
        </div>

        <div class="columns mb-6">
          <div class="column">
            <div class="notification is-info is-light has-text-centered">
              <p class="heading">Total Registered Users</p>
              <p class="title">{{ totalUsers }}</p>
            </div>
          </div>
          <div class="column">
            <div class="notification is-primary is-light has-text-centered">
              <p class="heading">Active Admins</p>
              <p class="title">{{ totalAdmins }}</p>
            </div>
          </div>
        </div>

        <div class="box">
          <h2 class="subtitle">User Management</h2>
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>
                    <strong>{{ user.name }}</strong>
                    <br><small class="has-text-grey">@{{ user.username }}</small>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['tag', user?.role === 'admin' ? 'is-danger' : 'is-link is-light']">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>{{ user.profile?.location || 'N/A' }}</td>
                  <td>{{ new Date(user.profile?.joinedAt).toLocaleDateString() }}</td>
                  <td>
                    <div class="buttons">
                      <button class="button is-small is-warning is-light" @click="startEdit(user)">Edit</button>
                      <button class="button is-small is-danger is-light" :disabled="user.id === currentUser.id" @click="deleteUser(user.id)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </section>
  <div class="modal" :class="{ 'is-active': isEditModalActive }">
  <div class="modal-background" @click="isEditModalActive = false"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit User Profile</p>
      <button class="delete" aria-label="close" @click="isEditModalActive = false"></button>
    </header>
    <section class="modal-card-body">
      
      <div class="field">
        <label class="label">User ID</label>
        <div class="control">
          <p class="is-size-5 has-text-weight-bold has-text-grey">#{{ editingUser.id }}</p>
        </div>
      </div>

      <div class="field">
        <label class="label">Full Name</label>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="editingUser.name">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">Location</label>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="editingUser.profile.location">
          <span class="icon is-small is-left">
            <i class="fas fa-map-marker-alt"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label">Account Role</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="editingUser.role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

    </section>
    <footer class="modal-card-foot">
      <button class="button is-warning" @click="saveEdit">Update User</button>
      <button class="button" @click="isEditModalActive = false">Cancel</button>
    </footer>
  </div>
</div>
</template>

<style scoped>
.table-container {
  margin-top: 1rem;
}
.tag {
  text-transform: uppercase;
  font-weight: bold;
}
</style>