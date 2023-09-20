export const PORT = process.env.PORT || 5000;
export const IS_DEV = process.env.NODE_ENV !== 'PRODUCTION';

export const SOCKETEVENTS: Record<string, string> = {
    startRoomSession: 'start-room-session',
    roomSessionStarted: 'room-session-started',
    joinRoomSession: 'join-room-session',
    roomSessionJoined: 'room-session-joined'
}
