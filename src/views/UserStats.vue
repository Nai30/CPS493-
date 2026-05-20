<script setup>

import { currentUser } from '../store/userStore.js'

</script>

<template>
  <div class="column is-full">
<div class="card mt-6">
  <div class="card-content">
    <p class="title">
     Steps Progress
    </p>
    <p class="subtitle">Take a look at your daily step progress</p>
          <progress class="progress is-primary" :value="15" max="100">

</progress>
<p class="has-text-right has-text-grey-dark is-size-6">
            <strong>{{ currentUser?.activities?.steps || 0 }}</strong> steps logged
          </p>
  </div>
  
  <footer class="card-footer">



    <p class="card-footer-item">
      <span>
        Share on
        <a href="https://twitter.com/codinghorror/status/506010907021828096"
          >Twitter</a
        >
      </span>
    </p>
    <p class="card-footer-item">
      <span> Share on <a href="#">Facebook</a> </span>
    </p>
  </footer>
</div>
</div>
 
<div class="column is-four-fifths">
      <div class="card">
        <div class="card-content">
          <p class="title is-4">
            <span class="icon mr-2"><i class="fas fa-fire has-text-danger"></i></span>
            Calories Burned
          </p>
          <p class="subtitle is-6">Track your daily energy expenditure</p>
          
          <!-- Static example percentage or create a custom computed property later -->
          <progress class="progress is-danger mb-2" :value="40" max="100">40%</progress>
          <p class="has-text-right has-text-grey-dark is-size-6">
            <strong>{{ currentUser?.activities?.caloriesBurned || 0 }}</strong> kcal torched
          </p>
        </div>
        
        <footer class="card-footer">
          <p class="card-footer-item">
            <span>Share on <a href="https://twitter.com">Twitter</a></span>
          </p>
          <p class="card-footer-item">
            <span>Share on <a href="#">Facebook</a></span>
          </p>
        </footer>
      </div>
    </div>
 
<div class="column is-two-thirds">
      <div class="card">
        <div class="card-content">
          <p class="title is-4">
            <span class="icon mr-2"><i class="fas fa-stopwatch has-text-link"></i></span>
            Workout Length
          </p>
          <p class="subtitle is-6">Monitor your active training minutes</p>
          
          <!-- Matches your blue theme progress bar -->
          <progress class="progress is-link mb-2" :value="60" max="100">60%</progress>
          <p class="has-text-right has-text-grey-dark is-size-6">
            <strong>{{ currentUser?.activities?.workoutTime || 0 }}</strong> minutes active
          </p>
        </div>
        
        <footer class="card-footer">
          <p class="card-footer-item">
            <span>Share on <a href="https://twitter.com">Twitter</a></span>
          </p>
          <p class="card-footer-item">
            <span>Share on <a href="#">Facebook</a></span>
          </p>
        </footer>
      </div>
    </div>
</template>

<style scoped>
.user-stats {
  max-width: 500px;
  margin: 1rem auto;
}
</style>