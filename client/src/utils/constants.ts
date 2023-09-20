export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL as string

export const SOCKETEVENTS: Record<string, string> = {
    startRoomSession: 'start-room-session',
    roomSessionStarted: 'room-session-started',
    joinRoomSession: 'join-room-session',
    roomSessionJoined: 'room-session-joined'
}
