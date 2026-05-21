import { Router } from "express";
import * as model from "../models/activity-Goals";
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
.get("/my-activitygoals", (req, res) => {
    // The bouncer (authorize) put the user info into req.user
    const userId = (req as any).user.id;
    const { list, count } = model.getByUserId(userId);
 
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