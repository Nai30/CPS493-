import type { User } from "../types/index";
import { PagingRequest } from "../types/dataEnvelopes";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// 1. Load the data. We use 'data1' as the container and 'usersArray' as the pointer.
const data1 = require("../data/users.json");
const fileName = path.join(__dirname, "../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "change-me-later";

type ItemType = User;
const usersArray: ItemType[] = data1.users;

// Helper function to save changes to the disk
const saveToFile = () => {
    fs.writeFileSync(fileName, JSON.stringify(data1, null, 2), "utf-8");
};

export function getAll(params: PagingRequest) {
    let list = [...usersArray]; // Use a spread to avoid mutating the original array during filtering
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

export function get(id: number): ItemType {
    const item = usersArray.find((u) => u.id === id);
    if (!item) {
        throw { status: 404, message: "User not found" };
    }
    return item;
}

export function create(user: ItemType) {
    const newItem = {
        ...user,
        id: usersArray.length > 0 ? Math.max(...usersArray.map(u => u.id)) + 1 : 1,
    };
    usersArray.push(newItem);
    saveToFile();
    return newItem;
}

export function update(id: number, user: Partial<ItemType>) {
    const index = usersArray.findIndex((u) => u.id === id);
    if (index === -1) {
        throw { status: 404, message: "User not found" };
    }

    // Merge existing user data with the new updates
    usersArray[index] = { ...usersArray[index], ...user };
    
    saveToFile();
    return usersArray[index];
}

export function remove(id: number) {
    const index = usersArray.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const removedUser = usersArray.splice(index, 1)[0];
    saveToFile();
    return removedUser;
}

export function login(email: string, password: string) {
    const user = usersArray.find(
        (u) => u.email === email && u.passwordHash === password,
    );
    
    if (!user) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
            passwordHash: user.passwordHash
        }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { 
        user: userWithoutPassword, 
        token 
    };
}