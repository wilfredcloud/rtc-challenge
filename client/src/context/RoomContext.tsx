import { ReactNode, createContext, useEffect } from "react";
import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL, SOCKETEVENTS as SE } from "../utils/constants";
import { Session } from "../utils/types";
import { useNavigate } from "react-router-dom";

interface RoomContextValue {
    ws: Socket,
}
const ws: Socket = socketIOClient(SERVER_BASE_URL)

export const RoomContext = createContext<RoomContextValue>({
    ws: ws
});



interface RoomProviderProps {
    children: ReactNode
}
const RoomProvider:React.FC<RoomProviderProps> = ({children}) => {
    const navigate = useNavigate()
    const enterRoomSession = (session: Session) => {
        navigate(`/${session.roomId}/join?session=${session.id}`);
    }
    useEffect(() => {
        ws.on(SE.roomSessionStarted, enterRoomSession)
    }, []);

    return <RoomContext.Provider value={{ws}}>
    {children}
    </RoomContext.Provider>
}

export default RoomProvider
