import { Socket } from "socket.io";
import { socketEvents as SE } from "../utils/constants";
import { createRoomSession } from "../services/SessionService";
import { CreateSessionData } from "../utils/types";


export const roomHandler = (socket: Socket) => {

    const startSession = (data: CreateSessionData) => {
        createRoomSession(data)
        console.log("session created succef")
    }
    
    socket.on(SE.startRoomSession,  startSession)

}
