<script setup>
import { onMounted, computed } from 'vue';
import { myActivities, fetchMyActivities } from '../store/activityStore';
import { currentUser } from '../store/userStore';

onMounted(() => {
    fetchMyActivities();
});

// --- STATS LOGIC ---

const totalDistance = computed(() => {
    return myActivities.value.reduce((acc, curr) => acc + (curr.distance_km || 0), 0).toFixed(1);
});

const totalCalories = computed(() => {
    return myActivities.value.reduce((acc, curr) => acc + (curr.calories || 0), 0);
});

const totalDuration = computed(() => {
    return myActivities.value.reduce((acc, curr) => acc + (curr.duration_min || 0), 0);
});

const activityCount = computed(() => myActivities.value.length);

const favoriteType = computed(() => {
    if (myActivities.value.length === 0) return 'N/A';
    const counts = {};
    myActivities.value.forEach(a => counts[a.type] = (counts[a.type] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
});
</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="title">My Fitness Dashboard</h1>
            <h2 class="subtitle">Welcome back, {{ currentUser?.name }}!</h2>

            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child box notification is-primary">
                        <p class="heading">Total Distance</p>
                        <p class="title">{{ totalDistance }} km</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box notification is-info">
                        <p class="heading">Calories Burned</p>
                        <p class="title">{{ totalCalories }} kcal</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box notification is-warning">
                        <p class="heading">Total Minutes</p>
                        <p class="title">{{ totalDuration }} min</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box notification is-link">
                        <p class="heading">Workouts</p>
                        <p class="title">{{ activityCount }}</p>
                    </article>
                </div>
            </div>

            <div class="box mt-6">
                <h3 class="subtitle">Recent Workouts</h3>
                <table class="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Distance</th>
                            <th>Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="act in myActivities" :key="act.id">
                            <td class="is-capitalized">
                                <strong>{{ act.type }}</strong>
                            </td>
                            <td>{{ new Date(act.date).toLocaleDateString() }}</td>
                            <td>{{ act.duration_min }}m</td>
                            <td>{{ act.distance_km > 0 ? act.distance_km + 'km' : '-' }}</td>
                            <td>{{ act.calories }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>