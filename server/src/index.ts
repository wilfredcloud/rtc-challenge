import express from "express";
import  http from "http"
import {Server} from "socket.io"
import cors from "cors"

const app = express();
const PORT = 5000;
app.use(cors)
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("user connected");  

    socket.on("create-meeting", (data) => {
        console.log("meeting created", data);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
