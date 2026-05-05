import { ref } from 'vue'

export const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/v1';

export const users = ref([])
export const currentUser = ref(null) 
export const token = ref(localStorage.getItem('token') || '');
export const showLoginModal = ref(false);
export const loginEmail = ref('');
export const loginPassword = ref('');
export const isLoggingIn = ref(false);

export async function fetchAllUsers() {
    try {
        // Changed to backticks ``
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            users.value = result.data; 
        }
    } catch (err) {
        console.error("Fetch users failed:", err);
    }
}

export function setToken(newToken){
    token.value = newToken;
    localStorage.setItem('token', newToken);
}

export function switchUser(id){
    const found = users.value.find(u => u.id === id)
    if (found) {
        currentUser.value = found
    } else {
        console.error("User not found with ID:", id)
    }
}

export async function performLogin() {
  isLoggingIn.value = true;
  try {
    // Changed to backticks ``
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: loginEmail.value, 
        password: loginPassword.value 
      })
    });

    const result = await response.json();

    if (result.isSuccess) {
      setToken(result.data.token);
      await fetchAllUsers();

      const foundUser = users.value.find(u => u.email === loginEmail.value);
      if (foundUser) {
          currentUser.value = foundUser;
      }
      
      showLoginModal.value = false;
      loginEmail.value = '';
      loginPassword.value = '';
    } else {
      alert("Login Failed: " + result.message);
    }
  } catch (err) {
    console.error("Login Error:", err);
  } finally {
    isLoggingIn.value = false;
  }
}

export async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        // Swapped localhost for API_URL
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.isSuccess) {
            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1) {
                users.value.splice(index, 1);
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

export async function updateUser (userId, updatedData) {
    try {
        // Swapped localhost for API_URL
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (result.isSuccess) {
            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1) {
                users.value[index] = { ...users.value[index], ...updatedData };
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Update failed:", err);
    }
}

export const friendsActivities = ref([]);

export async function fetchFriendsActivities() {
    if (!currentUser.value) {
        console.warn("No user logged in. Skipping friends feed fetch.");
        return;
    }

    try {
        // Swapped localhost for API_URL
        const response = await fetch(`${API_URL}/activities/friends/${currentUser.value.id}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            friendsActivities.value = result.data;
        }
    } catch (err) {
        console.error("Failed to load friends' feed:", err);
    }
}