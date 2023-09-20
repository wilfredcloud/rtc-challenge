import { ReactNode, createContext } from "react";
import socketIOClient, { Socket } from "socket.io-client"
import { SERVER_BASE_URL } from "../utils/constants";

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
    return <RoomContext.Provider value={{ws}}>
    {children}
    </RoomContext.Provider>
}

export default RoomProvider
