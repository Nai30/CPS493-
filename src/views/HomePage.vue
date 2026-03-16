<script setup>
import { currentUser } from '@/store/userStore';


</script>

<template>
    <div class="columns">
        <div class="column">  </div>
        <div class="column card is-one-third mt-6 ">
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
<div class="column">  </div>

    </div>
</template>

<style lang="scss" scoped>

</style>