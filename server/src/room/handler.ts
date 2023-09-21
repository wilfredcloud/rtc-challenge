import { Socket } from "socket.io";
import { SOCKETEVENTS as SE } from "../utils/constants";
import { createRoomSession } from "../services/SessionService";


const activeRooms: Record<string, string[]> = {}

interface PeerSessionData {
  roomId: string,
  peerId: string
}
export const roomHandler = (socket: Socket) => {


  const startSession = async ({ roomId }: { roomId: string }) => {
    console.log("startSession")
    const session = await createRoomSession(roomId)
    activeRooms[roomId] = [];
    console.log('roomSessionStarted')
    socket.emit(SE.roomSessionStarted, session)
  }

  const leaveSession = ({ roomId, peerId }: PeerSessionData) => {
    console.log("leaveSession")

    activeRooms[roomId] = activeRooms[roomId].filter((id) => id !== peerId);
    console.log("Emit, peerDisconnected")
    socket.emit(SE.peerDisconnected, { roomId, peerId })
  }

  const joinSession = async ({ roomId, peerId }: PeerSessionData) => {
    if (activeRooms[roomId]) {

      if (!activeRooms[roomId].find((id) => id === peerId)) {
        activeRooms[roomId].push(peerId);
      };
      socket.join(roomId);
      console.log("join")
      // socket.on("ready", () => {
      //   console.log("just got ready");
      //   socket.to(roomId).emit(SE.peerJoined, { peerId })
      // })
      socket.to(roomId).emit(SE.peerJoined, { peerId })
      socket.emit(SE.roomSessionJoined, { roomId, participants: activeRooms[roomId] })
      socket.on(SE.disconnect, () => {
        leaveSession({ roomId, peerId })
      })

    }
  }



  socket.on(SE.startRoomSession, startSession)
  socket.on(SE.joinRoomSession, joinSession);

}
