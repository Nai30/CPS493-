<script setup>
import { onMounted, computed,ref} from 'vue';
import { myActivities,activityGoals,friendGoals, fetchMyActivities, fetchMyActivityGoals,getFriendGoals } from '../store/activityStore';
import { currentUser } from '../store/userStore';
const randomFriendId = ref(null);
const currentId = computed(() => currentUser.value?.id);
onMounted(() => {
    fetchMyActivities();
    fetchMyActivityGoals();

    getFriendGoals(currentId.value).then(() => {
        if (friendGoals.value && friendGoals.value.length > 0) {
            const uniqueFriendIds = [...new Set(friendGoals.value.map(g => g.userId))];
            randomFriendId.value = uniqueFriendIds[Math.floor(Math.random() * uniqueFriendIds.length)];
          
        }
    });
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
const recentActivities = computed(() => {
    return [...myActivities.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
});
const totalDistanceGoal = computed(() => {
    // Sum all distance_km goals for the current user
   return activityGoals.value
        .filter(goal => goal.userId === currentUser.value?.id)
        .filter(goal => goal.metric === 'distance_km' || goal.title?.toLowerCase().includes('distance') || goal.title?.toLowerCase().includes('running'))
        .reduce((acc, goal) => acc + (goal.target_value || 0), 0);
});

const totalDistancePercentage = computed(() => {
    const goal = totalDistanceGoal.value;
   return goal > 0 ? ((parseFloat(totalDistance.value) / goal) * 100).toFixed(1) : 'N/A';
});

const totalDurationGoal = computed(() => {
    // Sum all duration_min goals for the current user
   return activityGoals.value
        .filter(goal => goal.userId === currentUser.value?.id)
        .filter(goal => goal.metric === 'duration_min' || goal.title?.toLowerCase().includes('sessions') || goal.title?.toLowerCase().includes('minutes') || goal.title?.toLowerCase().includes('duration'))
        .reduce((acc, goal) => acc + (goal.target_value || 0), 0);
});

const totalDurationPercentage = computed(() => {
    const goal = totalDurationGoal.value;
    return goal > 0 ? ((totalDuration.value / goal) * 100).toFixed(1) : 'N/A';
});
const totalFriendDistanceGoal = computed(() => {
    // Sum all distance_km goals for friends
    return friendGoals.value
        .filter(goal => goal.userId === randomFriendId.value)
        .filter(goal => goal.metric === 'distance_km' || goal.title?.toLowerCase().includes('distance') || goal.title?.toLowerCase().includes('running'))
        .reduce((acc, goal) => acc + (goal.target_value || 0), 0);
        
});
const totalFriendDistancePercentage = computed(() => {
    const goal = totalFriendDistanceGoal.value;
   
    return goal > 0 ? ((totalDistance.value / goal) * 100).toFixed(1) : 'N/A';
    
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

        <div class="columns is-desktop mt-6">
                <!-- User Goals Column -->
                <div class="column is-eight-fifths-desktop">
                    <div class="box">
                        <h3 class="title is-4 mb-5">🎯 My Goals Tracking</h3>
                        
                        <!-- Distance Goal Tracker -->
                        <div class="mb-5">
                            <div class="is-flex is-justify-content-between is-align-items-center mb-1">
                                <span class="has-text-weight-semibold">Total Distance Track</span>
                                <span class="tag is-primary is-light">
                                    {{ totalDistancePercentage !== 'N/A' ? totalDistancePercentage + '%' : 'No Goal' }}
                                </span>
                            </div>
                            <progress 
                                class="progress is-primary" 
                                :value="totalDistanceGoal > 0 ? totalDistance : 0" 
                                :max="totalDistanceGoal > 0 ? totalDistanceGoal : 100">
                            </progress>
                            <p class="is-size-7 has-text-grey">
                                Progress: <strong>{{ totalDistance }} km</strong> completed out of a <strong>{{ totalDistanceGoal }} km</strong> target field.
                            </p>
                        </div>

                        <!-- Duration Goal Tracker -->
                        <div class="mb-2">
                            <div class="is-flex is-justify-content-between is-align-items-center mb-1">
                                <span class="has-text-weight-semibold">Total Duration Track</span>
                                <span class="tag is-warning is-light">
                                    {{ totalDurationPercentage !== 'N/A' ? totalDurationPercentage + '%' : 'No Goal' }}
                                </span>
                            </div>
                            <progress 
                                class="progress is-warning" 
                                :value="totalDurationGoal > 0 ? totalDuration : 0" 
                                :max="totalDurationGoal > 0 ? totalDurationGoal : 100">
                            </progress>
                            <p class="is-size-7 has-text-grey">
                                Progress: <strong>{{ totalDuration }} min</strong> logged out of a <strong>{{ totalDurationGoal }} min</strong> target field.
                            </p>
                        </div>
                    </div>
                </div>

        
                <div class="column is-three-fifths-desktop">
                    <div class="box has-background-link-light style-fix">
                        <h3 class="title is-4 has-text-link-dark mb-4">🔥 Peer Fuel</h3>
                        <p class="subtitle is-6 has-text-link-dark">
                            Tracking Friend <span class="tag is-link">User #{{ randomFriendId }}</span>
                            
                        </p>

                        <div v-if="totalFriendDistanceGoal> 0" class="has-text-centered py-4">
                            <p class="is-size-6 mb-2">They challenge your distance metrics!</p>
                            <p class="title is-1 has-text-link my-3">{{ totalFriendDistancePercentage }}%</p>
                            <progress 
                                class="progress is-link is-medium mt-2" 
                                :value="totalDistance" 
                                :max="totalFriendDistanceGoal">
                            </progress>
                            <p class="is-size-7 has-text-grey-dark mt-2">
                                Relative Target Pool: <strong>{{ totalFriendDistanceGoal }} km</strong>
                            </p>
                        </div>
                        
                        <div v-else class="has-text-centered py-5 has-text-grey">
                            <span class="icon is-large"><i class="fas fa-user-clock fa-2x"></i></span>
                            <p class="is-size-6 mt-2">This friend has not configured distance targets for this tracking period yet.</p>
                        </div>
                    </div>
                </div>
            </div>
    </section>
</template>