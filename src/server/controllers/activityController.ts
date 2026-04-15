import { Router } from "express";
import * as model from "../models/activity";
import { DataListEnvelope, DataEnvelope } from "../types";

const app = Router();

app.get("/", (req, res) => {
    const { list, count } = model.getAll();
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response);
})
.get("/user/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    const { list, count } = model.getByUserId(userId);
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response);
})
.post("/", (req, res) => {
    const newActivity = model.create(req.body);
    const response: DataEnvelope<any> = {
        data: newActivity,
        isSuccess: true
    };
    res.status(201).send(response);
});

export default app;