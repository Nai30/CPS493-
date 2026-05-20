<script setup>
import { users, currentUser} from '../store/userStore';
import {computed} from 'vue';
const isAdmin = computed(() => currentUser.value?.role === 'admin');


</script>

<template>
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
            <h1 class="title mt-4 has-text-centered">Admin Control Center</h1>
          </div>
        </div>

        <div class="columns mb-6">
          <div class="column">
            <div class="notification is-info is-light has-text-centered">
              <p class="heading">Total Registered Users</p>
              <p class="title">{{users.length}}</p>
            </div>
          </div>
          <div class="column">
            <div class="notification is-primary is-light has-text-centered">
              <p class="heading">Active Admins</p>
              <p class="title"> 1 </p>
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
                  <td>New Paltz, NY</td>
                  <td>05/03/26</td>
                  <td>
                    <div class="buttons">
                      <button class="button is-small is-warning is-light" >Edit</button>
                      <button class="button is-small is-danger is-light" :disabled="user.id === currentUser.id" >Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
</template>

<style lang="scss" scoped>

</style>