import { Router } from "express";
import * as model from "../models/activity-Goals";
import { DataListEnvelope } from "../types";
import { authorize } from "../middleware/auth";

const app = Router();
app.use(authorize);

app.get("/", async (_req, res, next) => {
    try {
        const result = await model.getAll();
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/friends-goals/:userId", async (req, res, next) => {
    try {
        const result = await model.getFriendsActivityGoals(Number(req.params.userId));
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/my-activitygoals", async (req, res, next) => {
    try {
        const result = await model.getByUserId((req as any).user.id);
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/user/:userId", async (req, res, next) => {
    try {
        const result = await model.getByUserId(Number(req.params.userId));
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

export default app;
