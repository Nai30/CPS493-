import { Router } from "express"
import { getAll, get, create, update, remove } from "../models/user"
import * as model from "../models/user";
import { User, DataEnvelope, DataListEnvelope } from "../types"
import { authorize } from "../middleware/auth"

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
    
    // Safety check: if model.login fails
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
    .put("/:id",authorize, (req, res) => {
        if ((req as any).user?.role !== "admin") {
        return res.status(403).json({ isSuccess: false, message: "Admin access required." });
    }
        const { id } = req.params
        const updatedUser = update(Number(id), req.body)
        const response: DataEnvelope<User> = {
            data: updatedUser as User,
            isSuccess: true,
        }
        res.send(response)
    })  
.delete("/:id",authorize, (req, res) => {


   if ((req as any).user?.role !== "admin") {
  return res.status(403).json({
    isSuccess: false,
 
    message: `Unauthorized: ou must be an admin to delete users. ${(req as any).user?.name}, with role ${(req as any).user?.role}, attempted to delete user with id ${req.params.id}.`
})
}

    const { id } = req.params;
    
    try {
        const removedUser = remove(Number(id));

        // If the user wasn't found, stop here to avoid reading .name of null
        if (!removedUser) {
            return res.status(404).json({
                isSuccess: false,
                message: "User not found."
            });
        }

        res.json({
            data: removedUser,
            isSuccess: true,
            message: `User ${removedUser.name} has been removed.`
        });
    } catch (error) {
        console.error("DETAILED ERROR:", error); // Check your terminal for this!
        res.status(500).json({ isSuccess: false, message: "Server error" });
    }
});

export default app
