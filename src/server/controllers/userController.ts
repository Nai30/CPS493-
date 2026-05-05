import { Router } from "express"
import { getAll, get, create, update, remove } from "../models/user"
import * as model from "../models/user";
import { User, DataEnvelope, DataListEnvelope } from "../types"

const app = Router()

app.get("/", (req, res) => {
    const { list, count } = getAll(req.query)
    const sanitizedUsers = list.map((x) => ({
        ...x,
        password: undefined,
    }))
    const response: DataListEnvelope<User> = {
        data: sanitizedUsers,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    // Safety check: if model.login fails, handle it so it doesn't crash
    try {
        const {user, token} = model.login(email, password);
        
        const response: DataEnvelope<any> = {
            data: {user, token},
            isSuccess: true,
            message: `Welcome back, ${user.name}!`
        };

        // CHANGE THIS LINE:
        res.json(response); 
        
    } catch (error) {
        res.status(401).json({
            isSuccess: false,
            message: "Invalid email or password"
        });
    }
})
    .get("/count", (req, res) => {
        const { count } = getAll(req.query)
        const response: DataEnvelope<{ count: number }> = {
            data: { count },
            isSuccess: true,
        }
        res.send(response)
    })
    .get("/:id", (req, res) => {
        const { id } = req.params
        const response: DataEnvelope<User> = {
            data: get(Number(id)),
            isSuccess: true,
        }
        res.send(response)
    })

    .post("/", (req, res) => {
        const newUser = create(req.body)
        const response: DataEnvelope<User> = {
            data: newUser,
            isSuccess: true,
        }
        res.send(response)
    })
    .patch("/:id", (req, res) => {
        const { id } = req.params
        const updatedUser = update(Number(id), req.body)
        const response: DataEnvelope<User> = {
            data: updatedUser as User,
            isSuccess: true,
        }
        res.send(response)
    })
.delete("/:id", (req, res) => {
    // 1. Authorization Guard
    if ((req as any).user.role !== "admin") {
        return res.status(403).json({
            isSuccess: false,
            message: "Unauthorized: Access denied."
        });
    }

    const { id } = req.params;
    
    try {
        const removedUser = remove(Number(id));

        if (!removedUser) {
            return res.status(404).json({
                isSuccess: false,
                message: "User not found."
            });
        }

        res.json({
            data: removedUser,
            isSuccess: true,
            message: `User ${removedUser.name} deleted successfully.`
        });
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            message: "Database error during deletion."
        });
    }
})

export default app
