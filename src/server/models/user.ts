import type { User } from "../types/index"
const data1 = require("../data/users.json");
import { PagingRequest } from "../types/dataEnvelopes"
//importing jsonwebtoken to create a token for the user at login
import jwt from "jsonwebtoken";
//importing the secret key from the .env file
const JWT_SECRET = process.env.JWT_SECRET || "change-me-later";

type ItemType = User
const data = {
    ...data1,
    items: data1.users,
}

export function getAll(params: PagingRequest) {
    let list = data.items as ItemType[]
    const count = list.length

    if (params?.search) {
        const search = params.search.toLowerCase()
        list = list.filter((item) =>
            `${item.name}`.toLowerCase().includes(search),
        )
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
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    list = list.slice(start, start + pageSize)

    return { list, count }
}

export function get(id: number): ItemType {
    const item = data.items.find((item:any) => item.id === id)
    if (!item) {
        const error = { status: 404, message: "ItemType not found" }
        throw error
    }
    return item as ItemType
}

export function create(user: ItemType) {
    const newItemType = {
        ...user,
        id: data.items.length + 1,
    }
    data.items.push(newItemType as any)
    return newItemType
}

export function update(id: number, user: Partial<ItemType>) {
    const index = data.items.findIndex((u:any) => u.id === id)
    if (index === -1) {
        const error = { status: 404, message: "ItemType not found" }
        throw error
    }
    const updatedItemType = {
        ...data.items[index],
        ...user,
    }
    data.items[index] = updatedItemType as any
    return updatedItemType
}

export function remove(id: number) {
const userList = data.users || data.items; 

    const index = userList.findIndex((u: any) => u.id === id);
    if (index === -1) {
        return null;
    }
    const removedItemType = data.items.splice(index, 1)[0];


    return removedItemType as ItemType
}

//letting a user login by checking if there is user with the same email and password in the json file
export function login(email: string, password: string) {
    const user = data.items.find(
        (u:any) => u.email === email && u.passwordHash === password,
    )
    if (!user) {
        const error = { status: 401, message: "Invalid email or password" }
        throw error
    }
    //create jwt token with user email and password as param and our secret key
    const token = jwt.sign({id: user.id,passwordHash: user.passwordHash}, JWT_SECRET, { expiresIn: "1h" });
    //return our user without password and a token
    //the token allows you to acces protected routes
    const { passwordHash: _, ...userWithoutPassword } = user ;
    return { 
        user: userWithoutPassword, 
        token 
    };
}