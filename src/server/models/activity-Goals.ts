import { supabase } from "../supabase";

export interface ActivityGoals {
    id: number;
    userId: number;
    friendId: number;
    title: string;
    type: string;
    metric: string;
    target_value: number;
    target_date: string;
}

const table = process.env.SUPABASE_ACTIVITY_GOALS_TABLE || "activityGoals";
const usersTable = process.env.SUPABASE_USERS_TABLE || "users";

export async function getAll() {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw error;
    return { list: data as ActivityGoals[], count: data.length };
}

export async function getByUserId(userId: number) {
    const { data, error } = await supabase.from(table).select("*").eq("userId", userId).order("target_date", { ascending: false });
    if (error) throw error;
    return { list: data as ActivityGoals[], count: data.length };
}

export async function getFriendsActivityGoals(userId: number) {
    const { data: user, error: userError } = await supabase.from(usersTable).select("friends").eq("id", userId).maybeSingle();
    if (userError) throw userError;
    const friendIds = (user?.friends as number[] | undefined) ?? [];
    if (friendIds.length === 0) return { list: [], count: 0 };

    const { data, error } = await supabase.from(table).select("*").in("userId", friendIds).order("target_date", { ascending: false });
    if (error) throw error;
    return { list: data as ActivityGoals[], count: data.length };
}
