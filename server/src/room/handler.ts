import { Socket } from "socket.io";
import { SOCKETEVENTS as SE } from "../utils/constants";
import { createRoomSession } from "../services/SessionService";

const record: Record<string, string[]> = {}

export const roomHandler = (socket: Socket) => {

    const startSession = async ({roomId}: {roomId: string}) => {
      const session = await createRoomSession(roomId)
      socket.emit(SE.roomSessionStarted, session)
    }

    const joinSession = async ({roomId}: {roomId: string}) => {
      console.log("join sseeson",roomId)
      socket.emit(SE.roomSessionJoined)
    }
    
    socket.on(SE.startRoomSession,  startSession)
    socket.on(SE.joinRoomSession, joinSession);

}
