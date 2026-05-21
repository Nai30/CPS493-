import fs from "fs";
import path from "path";

// 1. Load the data
const data = require("../data/activityGoals.json");
const userData = require("../data/users.json");
const fileName = path.join(__dirname, "../data/activityGoals.json");

// Helper to save to file
const saveToFile = () => {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
};

export interface ActivityGoals {
    id: number;
    userId: number; 
    title: string;
    type: string;
    target_Value: number;
    target_Date: string;
}
export const getAll = () => {
    return { list: data.activityGoals, count: data.activityGoals.length };
};


export const getByUserId = (userId: number) => {
    const filteredList = data.activityGoals
        .filter((act: any) => act.userId === userId)
        .sort((a: any, b: any) => new Date(b.target_Date).valueOf() - new Date(a.target_Date).valueOf());

    const total = filteredList.length;

    return {
        list: filteredList,
        count: total
    };
}

export const create = (activity: any) => {
    const newActivityGoal = {
        ...activity,
        id: data.activityGoals.length > 0 ? Math.max(...data.activityGoals.map((a: any) => a.id)) + 1 : 1,
    };
    data.activityGoals.push(newActivityGoal);
    saveToFile(); // 💾 Persist
    return newActivityGoal;
}

export function update(id: number, activityUpdates: Partial<ActivityGoals>) {
    const index = data.activityGoals.findIndex((a: any) => a.id === id);
    if (index === -1) {
        throw { status: 404, message: "Activity not found" };
    }

    data.activityGoals[index] = { ...data.activityGoals[index], ...activityUpdates };
    saveToFile(); // 💾 Persist
    return data.activityGoals[index];
}

export function remove(id: number) {
    const index = data.activityGoals.findIndex((a: any) => a.id === id);
    if (index === -1) return null;

    const removedActivity = data.activityGoals.splice(index, 1)[0];
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