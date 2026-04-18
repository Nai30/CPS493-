import { Router } from "express";
import * as model from "../models/activity";
import { DataListEnvelope, DataEnvelope } from "../types";
import { authorize } from "../middleware/auth";

const app = Router();

app.use(authorize); 

app.get("/", (req, res) => {
    // Now, this code ONLY runs if the token was valid!
    const { list, count } = model.getAll();
    res.send({ data: list, isSuccess: true, total: count });
});
app.get("/", (req, res) => {
    const { list, count } = model.getAll();
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response);
})

.get("/friends/:userId",(req,res)=> {
 const userId = Number(req.params.userId);
    // We'll write this model function next
    const { list, count } = model.getFriendsActivities(userId); 
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response);

})
//duplicate? is it possible to have two get routes with the same path? if not, should we change the path for one of them? j
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
.patch("/:id", (req, res) => {
    const updated = model.update(Number(req.params.id), req.body);
    res.send({ data: updated, isSuccess: true });
})
.delete("/:id", (req, res) => {
    const removed = model.remove(Number(req.params.id));
    res.send({ data: removed, isSuccess: true });
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