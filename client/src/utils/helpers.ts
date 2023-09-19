import Axios from "./Axios"
import { Room } from "./types"

export const getToken = async () => {

}

export const createSession = async () => {

}

export const createConnection = async () => {

}

export const getUserHomeRoom = async (userId: string): Promise<Room> => {
    try {
        const response = await Axios.get(`/rooms/user/${userId}/home`);
        const room: Room = response.data;
        return room;
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getUserRooms = async (userId: string): Promise<Room[]> => {
    try {
        const response = await Axios.get(`/rooms/user/${userId}`);
        const room: Room[] = response.data;
        return room;
    } catch (error) {
        console.log(error);
        throw error
    }
}
export const getRoomById = async (roomId: string): Promise<Room> => {
    try {
        const response = await Axios.get(`/rooms/${roomId}`);
        const room: Room = response.data;
        return room;
    } catch (error) {
        console.log(error);
        throw error
    }
}
