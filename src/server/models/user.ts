import type { User } from "../types/index";
import { PagingRequest } from "../types/dataEnvelopes";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-later";
const table = process.env.SUPABASE_USERS_TABLE || "users";

type ItemType = User;

export async function getAll(params: PagingRequest) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw error;

    let list = [...(data as ItemType[])];
    const count = list.length;

    if (params?.search) {
        const search = params.search.toLowerCase();
        list = list.filter((item) =>
            `${item.name}`.toLowerCase().includes(search),
        );
    }

    if (params?.sortBy) {
        const sortField = params.sortBy as keyof ItemType;
        list.sort((a, b) => {
            const valA = (a as any)[sortField];
            const valB = (b as any)[sortField];
            if (valA < valB) return params.descending ? 1 : -1;
            if (valA > valB) return params.descending ? -1 : 1;
            return 0;
        });
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    list = list.slice(start, start + pageSize);

    return { list, count };
}

export async function get(id: number): Promise<ItemType> {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) {
        throw { status: 404, message: "User not found" };
    }
    return data as ItemType;
}

export async function create(user: ItemType) {
    const { data, error } = await supabase.from(table).insert(user).select().single();
    if (error) throw error;
    return data as ItemType;
}

export async function update(id: number, user: Partial<ItemType>) {
    const { data, error } = await supabase.from(table).update(user).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) {
        throw { status: 404, message: "User not found" };
    }
    return data as ItemType;
}

export async function remove(id: number) {
    const { data, error } = await supabase.from(table).delete().eq("id", id).select().maybeSingle();
    if (error) throw error;
    return (data as ItemType | null) ?? null;
}

export async function login(email: string, password: string) {
    const { data: user, error } = await supabase.from(table).select("*").eq("email", email).maybeSingle();
    if (error) throw error;

    const storedPassword = user && ((user as any).passwordHash ?? (user as any).password_hash);
    if (!user || storedPassword !== password) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
            passwordHash: storedPassword
        }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );

    const { passwordHash: _, password_hash: __, ...userWithoutPassword } = user as any;
    return { 
        user: userWithoutPassword, 
        token 
    };
}