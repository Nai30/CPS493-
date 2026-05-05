import { ref } from 'vue'

export const users = ref([])
export const currentUser = ref(null) 
export const token = ref(localStorage.getItem('token') || '');
export const showLoginModal = ref(false);
export const loginEmail = ref('');
export const loginPassword = ref('');
export const isLoggingIn = ref(false);

export async function fetchAllUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/users', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        });
        const result = await response.json();
        if (result.isSuccess) {
            // ✅ Updates the reactive array
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
    // ✅ MUST USE .value
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
    const response = await fetch('http://localhost:3000/api/v1/users/login', {
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
      
      // ✅ We need to fetch users first so our local list isn't empty
      await fetchAllUsers();

      // ✅ Use .value to find the user that just logged in
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
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.isSuccess) {
            // ✅ Use .value
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
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (result.isSuccess) {
            // ✅ Use .value
            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1) {
                // Merge the new data into the existing user object
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
        const response = await fetch(`http://localhost:3000/api/v1/activities/friends/${currentUser.value.id}`, {
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