import express from "express";
import * as model from "../models/user";
import { DataListEnvelope } from "../types/dataEnvelopes";

const router = express.Router();

router.get("/", (req, res) => {
    const users = model.getUsers();
    const response: DataListEnvelope<any> = {
        data: users,
        isSuccess: true,
        total: users.length
    };
    res.send(response);
});

export default router;