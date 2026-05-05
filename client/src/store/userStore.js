import { ref } from 'vue'
// Access the specific "users" key inside your JSON file
import userData from './data/users.json'

// Ensure we are exporting the actual array so .find() works
export const users = userData.users 

export const currentUser = ref(null) 
export const token = ref(localStorage.getItem('token') || '');
const showLoginModal = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const isLoggingIn = ref(false);

export async function fetchAllUsers() {
    const response = await fetch('http://localhost:3000/api/v1/users', {
        headers: { 'Authorization': `Bearer ${token.value}` }
    });
    const result = await response.json();
    if (result.isSuccess) {
        users.value = result.data; // Now the array exists for findIndex!
    }
}
export function setToken(newToken){
    token.value = newToken;
    localStorage.setItem('token', newToken);
}

export function switchUser(id){
    // Now that 'users' is definitely an array, .find() will work
    const found = users.find(u => u.id === id)
    if (found) {
        currentUser.value = found
    } else {
        console.error("User not found with ID:", id)
    }
}


 async function performLogin() {
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
      // We find the user in our local list to update the UI
      const foundUser = users.find(u => u.email === loginEmail.value);
      if (foundUser) switchUser(foundUser.id);
      
      // Close the box and reset
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
async function deleteUser(userId) {
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
            // Update the local array so the row vanishes instantly
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

export {
  showLoginModal,
  loginEmail,
  loginPassword,
  isLoggingIn,
  performLogin,
  deleteUser
}
