import { ref } from 'vue';
import { token,API_URL } from './userStore'; 

export const myActivities = ref([]);
export const activityGoals = ref([]);
export const friendGoals = ref([]);

export async function fetchMyActivities() {
    try {
        const response = await fetch(`${API_URL}/activities/my-activities`, {
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
export async function fetchMyActivityGoals(){
    try {
        const response = await fetch(`${API_URL}/activity-goals/my-activitygoals`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            activityGoals.value = result.data;
        }
    } catch (err) {
        console.error("Failed to load activity goals:", err);
    }
}
export async function addActivity() {
  if (newActivity.value.trim() === '') return
  isAddingLoading.value = true
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
   
      body: JSON.stringify({ 
        type: newActivity.value, 
        duration_min: 30, // Default value
        calories: 100,    // Default value
        date: new Date().toISOString(),
        userId: currentUser.value.id 
      })
    })
    const result = await response.json()
    if (result.isSuccess) {
      activityGoals.value.unshift(result.data)
      totalActivityGoals.value += 1
        newActivityGoal.value = ''
    }
  } finally {
    isAddingLoading.value = false
  }

}

export async function deleteActivity(id) {
  try {
    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const result = await response.json()
    if (result.isSuccess) {
        //
      displayedActivities.value = displayedActivities.value.filter(a => a.id !== id)
      totalActivities.value -= 1
    }
  } catch (error) { console.error("Failed to delete:", error) }
}




export async function getFriendGoals(friendId) {
    try {
        const response = await fetch(`${API_URL}/activity-goals/friends-goals/${friendId}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            friendGoals.value = result.data;
        }
    } catch (err) {
        console.error("Failed to load friend's goals:", err);
        return [];
    }
}