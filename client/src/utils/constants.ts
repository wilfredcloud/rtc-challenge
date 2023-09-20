export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL as string

export const socketEvents: Record<string, string> = {
    startRoomSession: 'start-room-session',
}
