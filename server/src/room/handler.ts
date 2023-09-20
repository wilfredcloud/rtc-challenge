import { Socket } from "socket.io";
import { SOCKETEVENTS as SE } from "../utils/constants";
import { createRoomSession } from "../services/SessionService";


const activeRooms: Record<string, string[]> = {}

interface PeerSessionData {
  roomId: string,
  peerId: string
}
export const roomHandler = (socket: Socket) => {


    const startSession = async ({roomId}: {roomId: string}) => {
      const session = await createRoomSession(roomId)
      activeRooms[roomId] = [];
      socket.emit(SE.roomSessionStarted, session)
    }

    const leaveSession =  ({roomId, peerId}: PeerSessionData) => {
      console.log("remove")
      activeRooms[roomId] =  activeRooms[roomId].filter((id) => id !== peerId);
      socket.emit(SE.peerDisconnected, {roomId, peerId})
    }

    const joinSession = async ({roomId, peerId}: PeerSessionData) => {
      
     if(activeRooms[roomId]){
      console.log("join sseeson",roomId, peerId)
      activeRooms[roomId].push(peerId);
      socket.emit(SE.roomSessionJoined, {roomId, participants: activeRooms[roomId]} )

      socket.on(SE.disconnect, () => {
        leaveSession({roomId, peerId})
       } )
  
     }
    }

   
    
    socket.on(SE.startRoomSession,  startSession)
    socket.on(SE.joinRoomSession, joinSession);

}
