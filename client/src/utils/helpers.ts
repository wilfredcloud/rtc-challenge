import Axios from "./Axios"
import { MediaConstraints, Room } from "./types"

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
export const getUserByRoomId = async (roomId: string) => {
    try {
        const response = await Axios.get(`/rooms/${roomId}/owner`);
        const user = response.data;
        return user;
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const hasVideoDevice = async ():Promise<boolean> => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
}

export const setupMediaConstraint = async ({audio, video}: MediaConstraints): Promise<MediaConstraints> => {
    const hasVideoCamera = await hasVideoDevice();
    
    const constraints: MediaConstraints = {
      audio: audio, 
    };
  
    if (hasVideoCamera) {
      constraints.video = video; 
    }
    return constraints
}


