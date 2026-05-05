<script setup>
import  {currentUser, showLoginModal}  from '../store/userStore';


</script>
<template>
  <div class="home-page">
    
    <div v-if="currentUser">
      <section class="hero  is-small mb-5 shadow-sm">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-3">Welcome back, {{ currentUser.name }}!</h1>
            <h2 class="subtitle is-6">📍 {{ currentUser.profile?.location }}</h2>
          </div>
        </div>
      </section>

      <div class="container px-4">
        <div class="box mb-5">
          <nav class="level is-mobile">
            <div class="level-item has-text-centered border-right">
              <div>
                <p class="heading">Total Steps</p>
                <p class="title has-text-info">{{ currentUser.stats?.totalSteps?.toLocaleString() || 0 }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Calories</p>
                <p class="title has-text-danger">{{ currentUser.stats?.totalCalories?.toLocaleString() || 0 }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Weight</p>
                <p class="title has-text-success">{{ currentUser.profile?.weight_kg }}kg</p>
              </div>
            </div>
          </nav>
        </div>

        <div class="columns">
          <div class="column is-7">
            <div class="box">
              <h3 class="title is-5">Weekly Goal</h3>
              <progress class="progress is-primary" value="75" max="100">75%</progress>
              <p class="is-size-7 has-text-grey">Target: {{ currentUser.goals?.weeklyMinutes }} minutes active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <section class="hero is-medium is-link is-bold">
        <div class="hero-body has-text-centered">
          <div class="container">
            <h1 class="title is-1">Health Fitness</h1>
            <h2 class="subtitle is-3">Your health, simplified.</h2>
            <hr style="width: 100px; margin: 2rem auto; background: white;">
            <p class="is-size-5 mb-5">
              Log in to start tracking your health goals and daily progress.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="columns is-centered has-text-centered">
            <div class="column is-8">
              <div class="box p-6">
                <h3 class="title is-4">About the App</h3>
                <p class="content is-medium has-text-grey">
                  This tracker is designed to help you hit your fitness targets. 
                  Whether you are training for a marathon or just staying active, we’ve got you covered.
                </p>
                
                <div class="columns mt-5">
                  <div class="column">
                    <span class="icon is-large has-text-primary"><i class="fas fa-running fa-2x"></i></span>
                    <p class="has-text-weight-bold">Activity Tracking</p>
                    <p class="is-size-7">Log every workout in real-time.</p>
                  </div>
                  <div class="column">
                    <span class="icon is-large has-text-info"><i class="fas fa-chart-line fa-2x"></i></span>
                    <p class="has-text-weight-bold">Personal Stats</p>
                    <p class="is-size-7">Visual data on your progress.</p>
                  </div>
                  <div class="column">
                    <span class="icon is-large has-text-success"><i class="fas fa-users fa-2x"></i></span>
                    <p class="has-text-weight-bold">Friends</p>
                    <p class="is-size-7">Connect and stay motivated.</p>
                  </div>
                </div>

                <div class="mt-6">
                  <p class="mb-3">Ready to begin your journey?</p>
                  <button class="button is-link is-large is-rounded" @click="showLoginModal = true">
                    Log in to start!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<style scoped>
.shadow-sm { box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.border-right { border-right: 1px solid #eee; }
</style>