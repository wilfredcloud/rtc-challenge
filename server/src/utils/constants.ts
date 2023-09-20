export const PORT = process.env.PORT || 5000;
export const IS_DEV = process.env.NODE_ENV !== 'PRODUCTION';

export const socketEvents: Record<string, string> = {
    startRoomSession: 'start-room-session',
}
