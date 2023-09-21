import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from 'uuid';

import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL, SOCKETEVENTS as SE } from "../utils/constants";
import { Participant, Session } from "../utils/types";
import { PeerAction, PeerState, peersReducer } from "../reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../reducers/peerActions";

interface RoomContextValue {
    ws: Socket,
    userPeer: Peer | null,
    stream: MediaStream | null,
    peers: PeerState,
    participants: Participant[]
    setUserPeer: React.Dispatch<React.SetStateAction<Peer | null>>;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    dispatchPeers: React.Dispatch<PeerAction>
}
const ws: Socket = socketIOClient(SERVER_BASE_URL)

export const RoomContext = createContext<RoomContextValue>({
    ws: ws,
    userPeer: null,
    stream: null,
    peers: {},
    participants: [],
    setUserPeer: () => { },
    setStream: () => { },
    setParticipants: () => { },
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
    const [participants, setParticipants] = useState<Participant[]>([])
    const enterRoomSession = (session: Session) => {
        navigate(`/${session.roomId}/join?session=${session.id}`);
    }
    const getParticipants = ({ roomId, participants }: { roomId: string, participants: Participant[] }) => {
       console.log("participants",participants)
       setParticipants(participants);
    }
    const removePeer = ({participant}: {participant: Participant}) => {
        console.log("removed");
        dispatchPeers(removePeerAction(participant.peerId))
    }



    useEffect(() => { 
        const peer = new Peer();
        setUserPeer(peer);
        ws.on(SE.roomSessionStarted, enterRoomSession)
        ws.on(SE.roomSessionJoined, getParticipants)
        ws.on(SE.peerDisconnected, removePeer)
    }, []);


    return <RoomContext.Provider value={{ ws, userPeer, stream, peers,participants, setParticipants, setUserPeer, setStream, dispatchPeers }}>
        {children}
    </RoomContext.Provider>
}

export default RoomProvider
