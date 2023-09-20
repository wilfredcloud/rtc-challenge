import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { RoomContext } from '../context/RoomContext';
import { useParams } from 'react-router-dom';
import { SOCKETEVENTS as SE } from '../utils/constants';

const RoomSession = () => {
    const {user} = useContext(AuthContext);
    const {ws} = useContext(RoomContext);
    const {roomId} = useParams()
    const videoRef = useRef<HTMLVideoElement | null>(null);

    
    useEffect(() => {
        ws.emit(SE.joinRoomSession, {roomId})
    //    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    }, [])


  return (
    <div>RoomSession
        <video ref={videoRef} autoPlay/>
    </div>
  )
}

export default RoomSession
