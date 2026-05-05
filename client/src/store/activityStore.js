import { ref } from 'vue';
import { token } from './userStore'; 

export const myActivities = ref([]);

export async function fetchMyActivities() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/activities/my-activities', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            myActivities.value = result.data;
        }
    } catch (err) {
        console.error("Failed to load activities:", err);
    }
}