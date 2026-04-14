import { ref } from 'vue'
import { users } from '@/server/data/users.js'

export const currentUser = ref(users[0]) // creates a reactive variable called current user, using ref means that if user[] changes it is updated 
export function switchUser(id){
    currentUser.value = users.find(u=> u.id ===id) //searches the array for the user put in
    //updates currentUser value dynamically
}

export {users}
