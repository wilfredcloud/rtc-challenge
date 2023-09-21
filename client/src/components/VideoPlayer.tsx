import React, { useContext, useEffect, useRef } from 'react'
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE } from '../utils/constants';
import { useParams } from 'react-router-dom';

const VideoPlayer:React.FC<{stream: MediaStream | null}> = ({stream}) => {
  const {ws, userPeer} = useContext(RoomContext);
  const { roomId } = useParams()

    const videoRef =  useRef<HTMLVideoElement>(null);

    useEffect (() => {

        if(videoRef.current && stream){
          videoRef.current.srcObject = stream
          
        } 

    }, [stream])

    if (!stream) {
      return  <div className='participant-grid-item'>
        <div className='participant-content'>
          participannts
        </div>
      </div>
    }
  return (
    <div className='participant-grid-item'>
       <video className='participant-video' ref={videoRef} autoPlay muted/>
       <div>Participant</div>
    </div>
  )
}

export default VideoPlayer;
