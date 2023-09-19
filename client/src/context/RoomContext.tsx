import { ReactNode, createContext } from "react";
import socketIOClient from "socket.io-client"
import { SERVER_BASE_URL } from "../utils/data";

export const RoomContext = createContext<any>(null);
const ws = socketIOClient(SERVER_BASE_URL)

interface RoomProviderProps {
    children: ReactNode
}


const RoomProvider:React.FC<RoomProviderProps> = ({children}) => {
    return <RoomContext.Provider value={{ws}}>
    {children}
    </RoomContext.Provider>
}

export default RoomProvider
