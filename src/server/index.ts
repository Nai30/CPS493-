import express from "express"
import usersController from "./controllers/userController"
import { DataEnvelope } from "./types/dataEnvelopes"
import dotenv from "dotenv" 
import activityController from "./controllers/activityController"
dotenv.config()

const PORT = process.env.PORT || 3000 
const SERVER = "localhost"
const app= express()
app.get("/test", (req, res) => res.send("Server is alive!"));

app.use((_req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
}).use(express.json())

///////// Routes
app.get("/", (_req, res)=> {
    res.send("Hello World!")
})
    .get("/suny", (_req, res)=>{
        res.send("The best university in the world!")
    })
    .use("/api/v1/users", usersController)
    .use("/api/v1/activities", activityController)

///////////Error handling
app.use((
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
)=> {
    console.error(err)
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: false,
        message: err.message ?? "An unexpected error occurred."
        
    }
    res.status(500).json(response)
},
)
app.listen(PORT, () => {
    console.log(`Server is running on port http://${SERVER}:${PORT}`)
})
console.log("Listening for requests...")
