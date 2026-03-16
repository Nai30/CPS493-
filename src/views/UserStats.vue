<script setup>
import { computed } from 'vue'
import { currentUser } from '../store/userStore.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Reactive data for the chart
const stats = computed(() => currentUser?.activities || {})

// Chart data and options
const chartData = computed(() => ({
  labels: ['Steps', 'Workout Time (min)', 'Calories Burned'],
  datasets: [
    {
      label: currentUser?.name + ' Stats',
      backgroundColor: ['#00D1B2', '#3273dc', '#ff3860'],
      data: [stats.value.steps || 0, stats.value.workoutTime || 0, stats.value.caloriesBurned || 0]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'User Activity Stats'
    }
  }
}
</script>

<template>
  <div class="user-stats box">
    <Bar :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<style scoped>
.user-stats {
  max-width: 500px;
  margin: 1rem auto;
}
</style>