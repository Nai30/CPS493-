import { Router } from "express";
import * as model from "../models/user";
import { User, DataEnvelope, DataListEnvelope } from "../types";
import { authorize } from "../middleware/auth";

const app = Router();

app.get("/", async (req, res, next) => {
    try {
        const { list, count } = await model.getAll(req.query);
        const sanitizedUsers = list.map((item) => {
            const { passwordHash: _, password_hash: __, ...user } = item as User & { password_hash?: string };
            return user;
        });
        res.send({ data: sanitizedUsers, isSuccess: true, total: count } satisfies DataListEnvelope<Omit<User, "passwordHash">>);
    } catch (error) { next(error); }
});

app.post("/login", async (req, res) => {
    try {
        const { user, token } = await model.login(req.body.email, req.body.password);
        res.json({ data: { user, token }, isSuccess: true, message: `Welcome back, ${user.name}!` } satisfies DataEnvelope<any>);
    } catch (error) {
        if ((error as any)?.status === 401) {
            return res.status(401).json({ isSuccess: false, message: "Invalid email or password" });
        }
        res.status(500).json({ isSuccess: false, message: "Unable to connect to the user database" });
    }
});

app.get("/count", async (req, res, next) => {
    try {
        const { count } = await model.getAll(req.query);
        res.send({ data: { count }, isSuccess: true } satisfies DataEnvelope<{ count: number }>);
    } catch (error) { next(error); }
});

app.get("/:id", async (req, res, next) => {
    try { res.send({ data: await model.get(Number(req.params.id)), isSuccess: true } satisfies DataEnvelope<User>); }
    catch (error) { next(error); }
});

app.post("/", async (req, res, next) => {
    try { res.send({ data: await model.create(req.body), isSuccess: true } satisfies DataEnvelope<User>); }
    catch (error) { next(error); }
});

app.patch("/:id", async (req, res, next) => {
    try { res.send({ data: await model.update(Number(req.params.id), req.body), isSuccess: true } satisfies DataEnvelope<User>); }
    catch (error) { next(error); }
});

app.put("/:id", authorize, async (req, res, next) => {
    if (req.user?.role !== "admin") return res.status(403).json({ isSuccess: false, message: "Admin access required." });
    try { res.send({ data: await model.update(Number(req.params.id), req.body), isSuccess: true } satisfies DataEnvelope<User>); }
    catch (error) { next(error); }
});

app.delete("/:id", authorize, async (req, res, next) => {
    if (req.user?.role !== "admin") return res.status(403).json({ isSuccess: false, message: "Admin access required." });
    try {
        const removedUser = await model.remove(Number(req.params.id));
        if (!removedUser) return res.status(404).json({ isSuccess: false, message: "User not found." });
        res.json({ data: removedUser, isSuccess: true, message: `User ${removedUser.name} has been removed.` });
    } catch (error) { next(error); }
});

export default app;
