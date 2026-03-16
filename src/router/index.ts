import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import Admin from '@/views/AdminView.vue'
import ActivityTracker from '@/views/ActivityTracker.vue'
import UserStats from '@/views/UserStats.vue'

const routes = [
  {

    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  {
    path: '/personal',
    name: 'Personal',
    component: ActivityTracker
  },
  {
   path: '/stats',
    name: 'Statistics',
    component: UserStats
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router