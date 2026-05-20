<script setup>
import { currentUser } from '@/store/userStore';


</script>

<template>
    <div class="columns is-centered is-multiline mt-6">
    <div class="column is-two-thirds pb-4">
      <div class="notification is-link">
  <button class="delete"></button>
<strong>Welcome to FitPulse!</strong>
<br> Your ultimate hub for tracking workouts, smashing goals, and staying inspired. <br> Best of all, fitness is better together—don't forget to check out the community feed to see what your friends are crushing today.
<br>
<strong> Let's make every movement count!</strong>
</div>
</div>
<div class="column is-full p-0"></div>
<div class="column card is-light is-medium-width mx-3 mb-6 ">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img
            :src= "currentUser.picture"
            alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">{{ currentUser.name }}</p>
        <p class="subtitle is-6">@{{ currentUser.name }}</p>
      </div>
    </div>

    <div class="content">
     <p class="subtitles  is-2"> Steps today: {{ currentUser.activities.steps }} </p>
     <p class="subtitles  is-2"> Workout length: {{ currentUser.activities.workoutTime  }} </p>
      <p class="subtitles  is-2"> Calories burned: {{ currentUser.activities.caloriesBurned }} </p>
     <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
    </div>
  </div>
</div>

<div class="column box is-light mx-3 mb-6">
 <div class="box has-background-white-bis shadow-sm">
  <h3 class="title is-4 has-text-grey-dark mb-4"> 
  <span class="icon mr-2"><i class="fas fa-chart-line has-text-link"></i></span> Weekly Progress </h3> 
   <div class="mb-4"> <div class="is-flex is-justify-content-between mb-1">
   <span class="has-text-weight-semibold">Weekly Steps Goal</span> <span class="has-text-grey">75% Complete</span></div> <progress class="progress is-link" value="75" max="100">75%</progress> </div>  <div class="mb-4"> <div class="is-flex is-justify-content-between mb-1"> <span class="has-text-weight-semibold">Active Minutes</span> <span class="has-text-grey">120 / 150 min</span> </div> <progress class="progress is-success" value="80" max="100">80%</progress> </div> <div class="mt-5 pt-2 border-top"> <p class="has-text-weight-semibold mb-2"> Quick Water Tracker</p> <div class="buttons are-small"> <button class="button is-link is-light">+ 250ml</button> <button class="button is-link is-light">+ 500ml</button> <span class="tag is-info is-light ml-auto">1.5L Tracked today</span> </div> </div> </div> </div>
<div class="column is-full p-0"></div>
        
<div class="column">  </div>

    </div>
</template>

<style lang="scss" scoped>

</style>