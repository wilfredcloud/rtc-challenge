import  { useContext, useEffect } from 'react'
import { v4 as uuidV4 } from 'uuid';
import { AuthContext } from '../context/AuthContext'
import { RoomContext } from '../context/RoomContext';
import { useParams } from 'react-router-dom';
import { SOCKETEVENTS as SE } from '../utils/constants';
import VideoPlayer from '../components/VideoPlayer';
import Peer from 'peerjs';

const RoomSession = () => {
    const {user, } = useContext(AuthContext);
    const {ws, userPeer, stream, setStream, setUserPeer} = useContext(RoomContext);
    const {roomId} = useParams()

    
    useEffect(() => {

       if(userPeer){
        ws.emit(SE.joinRoomSession, {roomId, peerId: userPeer.id})
       } 

       try {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                 setStream(stream);
            })
    } catch (error) {
      console.log("Could not get media")
    } 
    //    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    }, [userPeer, roomId, ws])


  return (
    <div>RoomSession
        <VideoPlayer stream={stream} />
    </div>
  )
}

export default RoomSession
