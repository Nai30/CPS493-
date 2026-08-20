import { supabase } from "../supabase";

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

const table = process.env.SUPABASE_ACTIVITIES_TABLE || "activities";
const usersTable = process.env.SUPABASE_USERS_TABLE || "users";

export async function getAll() {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw error;
    return { list: data as Activity[], count: data.length };
}

export async function getByUserId(userId: number, page = 1, limit = 5) {
    const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .eq("userId", userId)
        .order("date", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { list: data as Activity[], count: count ?? 0 };
}

export async function create(activity: Omit<Activity, "id">) {
    const { data, error } = await supabase.from(table).insert(activity).select().single();
    if (error) throw error;
    return data as Activity;
}

export async function update(id: number, activityUpdates: Partial<Activity>) {
    const { data, error } = await supabase.from(table).update(activityUpdates).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw { status: 404, message: "Activity not found" };
    return data as Activity;
}

export async function remove(id: number) {
    const { data, error } = await supabase.from(table).delete().eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data as Activity | null;
}

export async function getFriendsActivities(userId: number) {
    const { data: user, error: userError } = await supabase.from(usersTable).select("friends").eq("id", userId).maybeSingle();
    if (userError) throw userError;
    const friendIds = (user?.friends as number[] | undefined) ?? [];
    if (friendIds.length === 0) return { list: [], count: 0 };

    const { data, error } = await supabase.from(table).select("*").in("userId", friendIds).order("date", { ascending: false });
    if (error) throw error;
    return { list: data as Activity[], count: data.length };
}
