import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from 'uuid';

import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL, SOCKETEVENTS as SE } from "../utils/constants";
import { Session } from "../utils/types";
import { PeerAction, PeerState, peersReducer } from "../reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../reducers/peerActions";

interface RoomContextValue {
    ws: Socket,
    userPeer: Peer | null,
    stream: MediaStream | null,
    peers: PeerState
    setUserPeer: React.Dispatch<React.SetStateAction<Peer | null>>;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
    dispatchPeers: React.Dispatch<PeerAction>
}
const ws: Socket = socketIOClient(SERVER_BASE_URL)

export const RoomContext = createContext<RoomContextValue>({
    ws: ws,
    userPeer: null,
    stream: null,
    peers: {},
    setUserPeer: () => { },
    setStream: () => { },
    dispatchPeers: () => {}
});



interface RoomProviderProps {
    children: ReactNode
}
const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [userPeer, setUserPeer] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [peers, dispatchPeers] = useReducer(peersReducer, {})
    const enterRoomSession = (session: Session) => {
        navigate(`/${session.roomId}/join?session=${session.id}`);
    }
    const getParticipants = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
       console.log("participannts",participants)
    }
    const removePeer = ({peerId}: {peerId: string}) => {
        console.log("removed");
        dispatchPeers(removePeerAction(peerId))
    }

    const callPeer = ({peerId, peer}: {peerId: string, peer: Peer}) => {
        const call = peer.call(peerId, stream as MediaStream);
        call.on("stream", (peerStream) => {
          dispatchPeers(addPeerAction(peerId, peerStream))
        })
    };


    useEffect(() => {
        const unid = uuidV4();
        const peer = new Peer(unid);
        setUserPeer(peer);
        
        ws.on(SE.roomSessionStarted, enterRoomSession)
        ws.on(SE.roomSessionJoined, getParticipants)
  
        ws.on(SE.peerDisconnected, removePeer)
    }, []);

    // useEffect(() => {
        
    //     if (!userPeer || !stream) return;
 
    
    // }, [userPeer, stream])

    return <RoomContext.Provider value={{ ws, userPeer, stream, peers, setUserPeer, setStream, dispatchPeers }}>
        {children}
    </RoomContext.Provider>
}

export default RoomProvider
