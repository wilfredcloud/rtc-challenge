import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from 'uuid';

import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL, SOCKETEVENTS as SE } from "../utils/constants";
import { Session } from "../utils/types";

interface RoomContextValue {
    ws: Socket,
    userPeer: Peer | null,
    stream: MediaStream | null,
    setUserPeer: React.Dispatch<React.SetStateAction<Peer | null>>;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

}
const ws: Socket = socketIOClient(SERVER_BASE_URL)

export const RoomContext = createContext<RoomContextValue>({
    ws: ws,
    userPeer: null,
    stream: null,
    setUserPeer: () => {},
    setStream: () => {},
});



interface RoomProviderProps {
    children: ReactNode
}
const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [userPeer, setUserPeer] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null)
    const enterRoomSession = (session: Session) => {
        navigate(`/${session.roomId}/join?session=${session.id}`);
    }
    const getParticipants = ({ roomId, participants }: { roomId: string, participants: string }) => {
        console.log(roomId, participants);
    }
    useEffect(() => {
        const unid = uuidV4();
        const peer = new Peer(unid);
        setUserPeer(peer);

        ws.on(SE.roomSessionStarted, enterRoomSession)
        ws.on(SE.roomSessionJoined, getParticipants)
    }, []);

    useEffect (() => {
        if (!userPeer || !stream) return;
       ws.on(SE.peerJoined, ({peerId}) => {
            const call = userPeer.call(peerId, stream);
       })

       userPeer.on("call", (call) => {
        call.answer(stream)
       })
    }, [userPeer, stream])

    return <RoomContext.Provider value={{ ws, userPeer, stream, setUserPeer, setStream }}>
        {children}
    </RoomContext.Provider>
}

export default RoomProvider
