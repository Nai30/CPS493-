import { Router } from "express";
import * as model from "../models/activity";
import { DataListEnvelope, DataEnvelope } from "../types";
import { authorize } from "../middleware/auth";

const app = Router();

app.use(authorize); 

app.get("/", (req, res) => {
    const { list, count } = model.getAll();
    
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response)
})

.get("/friends/:userId",(req,res)=> {
 const userId = Number(req.params.userId);
    
    const { list, count } = model.getFriendsActivities(userId); 
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: count
    };
    res.send(response);

})
.get("/my-activities", (req, res) => {
    // The bouncer (authorize) put the user info into req.user
    const userId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const { list, count } = model.getByUserId(userId, page, limit);
  setTimeout(() => { // Simulate delay for testing
        const response: DataListEnvelope<any> = {
            data: list,
            isSuccess: true,
            total: count
        };
        res.send(response);
        }, 10000); // 10000ms delay

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
    res.send(response)
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
    res.send(response)
})
.patch("/:id", (req, res) => {
    const updated = model.update(Number(req.params.id), req.body);
    const response: DataEnvelope<any> = {
        data: updated,
        isSuccess: true
    };
    res.send(response);
})
.put("/:id", (req, res) => {
    const updated = model.update(Number(req.params.id), req.body);
    const response: DataEnvelope<any> = {
        data: updated,
        isSuccess: true
    };  
    res.send(response);
})
.delete("/:id", (req, res) => {
    const removed = model.remove(Number(req.params.id));
    const response: DataEnvelope<any> = {
        data: removed,
        isSuccess: true
    };
    res.send(response);
})
.post("/", (req, res) => {
    const newActivity = model.create(req.body);
    const response: DataEnvelope<any> = {
        data: newActivity,
        isSuccess: true
    };
    res.status(201).send(response)
});


export default app;