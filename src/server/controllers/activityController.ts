import { Router } from "express";
import * as model from "../models/activity";
import { DataListEnvelope, DataEnvelope } from "../types";
import { authorize } from "../middleware/auth";

const app = Router();
app.use(authorize);

app.get("/", async (_req, res, next) => {
    try {
        const { list, count } = await model.getAll();
        res.send({ data: list, isSuccess: true, total: count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/friends/:userId", async (req, res, next) => {
    try {
        const result = await model.getFriendsActivities(Number(req.params.userId));
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/my-activities", async (req, res, next) => {
    try {
        const result = await model.getByUserId((req as any).user.id, Number(req.query.page) || 1, Number(req.query.limit) || 5);
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.get("/user/:userId", async (req, res, next) => {
    try {
        const result = await model.getByUserId(Number(req.params.userId));
        res.send({ data: result.list, isSuccess: true, total: result.count } satisfies DataListEnvelope<any>);
    } catch (error) { next(error); }
});

app.patch("/:id", async (req, res, next) => {
    try { res.send({ data: await model.update(Number(req.params.id), req.body), isSuccess: true } satisfies DataEnvelope<any>); }
    catch (error) { next(error); }
});

app.put("/:id", async (req, res, next) => {
    try { res.send({ data: await model.update(Number(req.params.id), req.body), isSuccess: true } satisfies DataEnvelope<any>); }
    catch (error) { next(error); }
});

app.delete("/:id", async (req, res, next) => {
    try { res.send({ data: await model.remove(Number(req.params.id)), isSuccess: true } satisfies DataEnvelope<any>); }
    catch (error) { next(error); }
});

app.post("/", async (req, res, next) => {
    try { res.status(201).send({ data: await model.create(req.body), isSuccess: true } satisfies DataEnvelope<any>); }
    catch (error) { next(error); }
});

export default app;
