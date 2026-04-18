const data = require("../data/activities.json");
// This defines what an Activity looks like for TypeScript
export interface Activity {
    id: number;
    userId: number;
    description: string;
    duration: number;
    calories: number;
    date: string;
    type?: string; // e.g., 'Running', 'Yoga'
}

export const getAll = () => {
    return { list: data.activities, count: data.activities.length };
};
//get activities based on a user id number
export const getByUserId = (userId: number) => {
    const list = data.activities.filter((activity: any) => activity.userId === userId);
    return { list, count: list.length };
}
export const create  = (activity: any) => {
    const newActivity = {
        ...activity,
        id: data.activities.length + 1,
    }
    data.activities.push(newActivity)
    return newActivity
}
export function update(id: number, activityUpdates: Partial<Activity>) {
    // 1. Find the activity in your JSON array
    const index = data.activities.findIndex((a:any) => a.id === id);
    
    if (index === -1) {
        throw { status: 404, message: "Activity not found" };
    }

    // 2. Merge the old activity with the new updates
    const updatedActivity = {
        ...data.activities[index],
        ...activityUpdates,
    };

    // 3. Save it back to the array
    data.activities[index] = updatedActivity;
    return updatedActivity;
}

export function remove(id: number) {
    const index = data.activities.findIndex((a:any) => a.id === id);
    
    if (index === -1) {
        throw { status: 404, message: "Activity not found" };
    }

    // 4. Remove it from the array
    const removedActivity = data.activities.splice(index, 1)[0];
    return removedActivity;
}
//getting a friend's activities based on the user's id number
export function getFriendsActivities(userId: number){
    //find the user first
    const user= data.users.find((u:any) => u.id ==userId);
    if(!user || !user.friends){
        return{list:[],count: 0}
    }
    //get the friends' activities
    const friendsActivities = data.activities.filter((a:any) => user.friends.includes(a.userId));
    return {list: friendsActivities, count: friendsActivities.length}
}
