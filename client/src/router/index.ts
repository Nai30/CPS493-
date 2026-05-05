// 1. Change createWebHistory to createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router' 
import Home from '../views/HomePage.vue'
import Admin from '../views/AdminView.vue'
import ActivityTracker from '../components/ActivityTracker.vue'
import UserStats from '../views/UserStats.vue'
import FriendTracker from '../components/FriendTracker.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/personal', name: 'Personal', component: ActivityTracker },
  { path: '/stats', name: 'Statistics', component: UserStats },
  { path: '/friends', name: 'Friends', component: FriendTracker }
]

const router = createRouter({
  // 2. Use Hash History here
  history: createWebHashHistory(), 
  routes
})

export default router