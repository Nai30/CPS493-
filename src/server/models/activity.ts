import fs from "fs";
import path from "path";

// 1. Load the data
const data = require("../data/activities.json");
const userData = require("../data/users.json");
const fileName = path.join(__dirname, "../data/activities.json");

// Helper to save to file
const saveToFile = () => {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
};

export interface Activity {
    id: number;
    userId: number; 
    description?: string;
    duration_min: number;
    calories: number;
    date: string;
    type: string;
    distance_km?: number;
}

// 2. Fix the function logic
export const getAll = () => {
    return { list: data.activities, count: data.activities.length };
};

export const getByUserId = (userId: number, page = 1, limit = 5) => {
    const filteredList = data.activities
        .filter((act: any) => act.userId === userId)
        .sort((a: any, b: any) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

    const total = filteredList.length;
    const startIndex = (page - 1) * limit;
    const paginated = filteredList.slice(startIndex, startIndex + limit);

    return {
        list: paginated,
        count: total
    };
}

export const create = (activity: any) => {
    const newActivity = {
        ...activity,
        id: data.activities.length > 0 ? Math.max(...data.activities.map((a: any) => a.id)) + 1 : 1,
    };
    data.activities.push(newActivity);
    saveToFile(); // 💾 Persist
    return newActivity;
}

export function update(id: number, activityUpdates: Partial<Activity>) {
    const index = data.activities.findIndex((a: any) => a.id === id);
    if (index === -1) {
        throw { status: 404, message: "Activity not found" };
    }

    data.activities[index] = { ...data.activities[index], ...activityUpdates };
    saveToFile(); // 💾 Persist
    return data.activities[index];
}

export function remove(id: number) {
    const index = data.activities.findIndex((a: any) => a.id === id);
    if (index === -1) return null;

    const removedActivity = data.activities.splice(index, 1)[0];
    saveToFile(); // 💾 Persist
    return removedActivity;
}

export function getFriendsActivities(userId: number) {
    const user = userData.users.find((u: any) => u.id === userId);
    console.log("Found User:", user?.name, "Friends:", user?.friends); // 👈 Debug 1
    
    if (!user || !user.friends) return { list: [], count: 0 };

    const friendsActivities = data.activities.filter((a: any) => {
        console.log("Checking activity for user:", a.userId); // 👈 Debug 2
        return user.friends.includes(Number(a.userId));
    });

    return { list: friendsActivities, count: friendsActivities.length };
}