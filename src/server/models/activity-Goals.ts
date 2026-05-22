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
    metric: string;
    friendIDd: number;
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



export function getFriendsActivityGoals(userId: number) {
// 1. Find the target user in your user dataset
    const user = userData.users.find((u: any) => u.id === userId);
       console.log("Found User:", user?.name, "Friends:", user?.friends);
    // 2. Safeguard: Ensure the user exists and actually has friends listed
    if (!user || !user.friends || user.friends.length === 0) {
        return { list: [], count: 0 };
    }

    const allFriendsActivities: any[] = [];

    // 3. Loop through each friend's userId
    user.friends.forEach((friendId: number) => {
        // Reuse your existing function to get this specific friend's sorted goals
        const friendResult = getByUserId(friendId);
        
        // Push all the individual goals from their list into our main array
        allFriendsActivities.push(...friendResult.list);
        console.log(`Friend ID: ${friendId}, Goals Found: ${friendResult.count}`);
        friendResult.list.forEach((goal: any, index: number) => {
        console.log(`  └─ [Goal #${index + 1}] Title: "${goal.title}", Metric: ${goal.metric}, Target: ${goal.target_value}`);
    });
      
    });

    // 4. Return the combined list and the total count
    return { 
        list: allFriendsActivities, 
        count: allFriendsActivities.length 
    };
}