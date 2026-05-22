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

.get("/friends-goals/:userId",(req,res)=> {
 const userId = Number(req.params.userId);
    
    const { list, count } = model.getFriendsActivityGoals(userId); 
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
;


export default app;