import { useContext, useEffect, useState, } from 'react'
import { v4 as uuidV4 } from 'uuid';
import { AuthContext } from '../context/AuthContext'
import { RoomContext } from '../context/RoomContext';
import { useNavigate, useParams } from 'react-router-dom';
import { SOCKETEVENTS as SE } from '../utils/constants';
import VideoPlayer from '../components/VideoPlayer';
import { PeerState, } from '../reducers/peerReducer';
import { addPeerAction } from '../reducers/peerActions';
import Participants from '../components/Participants';
import Comments from '../components/Comments';
import { Room as RoomValue } from '../utils/types';
import { Participant } from '../utils/types';
import { getRoomById } from '../utils/helpers';

const RoomSession = () => {
  const { user, } = useContext(AuthContext);
  const { ws, userPeer, stream, peers, participants, setStream, dispatchPeers } = useContext(RoomContext);
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [room, setRoom] = useState<RoomValue>()
  const participantName = localStorage.getItem("participantName");



  const switchStream = (newStream: MediaStream) => {
    if (!userPeer) return;
  
    // Find the video track from the new stream
    const videoTrack = newStream.getTracks().find((track) => track.kind === 'video');
  
    if (!videoTrack) {
      console.error('No video track found in the new stream');
      return;
    }
    // Iterate through connections and replace the video track
    Object.values(userPeer.connections).forEach((connections) => {
      connections.forEach((connection:any) => {
        const senders = connection.peerConnection.getSenders();
        const videoSender = senders.find((sender:any) => sender.track && sender.track.kind === 'video');
  
        if (videoSender) {
          videoSender.replaceTrack(videoTrack).catch((error:any) => console.error(error));
        }
      });
    });
  
    // Update the local stream state with the new stream
    setStream(newStream);
  };
  

  const shareCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(switchStream)
      .catch((error) => console.log(error));
    setIsCameraOff(false);
    setIsScreenShared(false);
  }

  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({}).then(switchStream).catch((error) => console.log(error))
    setIsCameraOff(true);
    setIsScreenShared(true);
  }

  const handleRoomSessionState = ({roomState}: {roomState:boolean}) => { 
    if (!roomState)  {
      navigate(`/${roomId}`);
    }
}

const leaveRoom = () => {
    navigate(`/${roomId}`);
} 
 

  useEffect(() => {

    if (!userPeer || !stream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => setStream(stream))
        .catch((error) => console.log("error"))

    }

    if (!userPeer || !stream) return;
    const participant: Participant = {
      peerId: userPeer.id,
      name: participantName!,
      isRoomOwner: false
    }
    ws.emit(SE.joinRoomSession, { roomId, participant: participant })


    ws.on(SE.peerJoined, ({ participant }) => {
      const call = userPeer.call(participant.peerId, stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(participant.peerId, peerStream))
      })
    })

    userPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(call.peer, peerStream))
      })
    })


  }, [userPeer, stream])


  useEffect (() => {

    const getRoom = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);

      } catch (error) {
        navigate(`/${roomId}`);
      }
      
    }

    if (!participantName ) {
      navigate(`/${roomId}`);
      return;
    }
    
    getRoom();
    ws.on(SE.roomSessionState, handleRoomSessionState)
    ws.emit(SE.isRoomInSession, {roomId})

    return () => {
      ws.off(SE.roomSessionState)
    }

  }, [roomId, participantName ])


  


  return (
    <div className='conference-room'>
      {/* participants */}
      <Participants />
      {/* comment */}
      <Comments />
      {/* conf bos */}
      <div className='room-display'>
        <div className='room-title'>{room?.name}</div>
        <div className="participant-grid">
          <VideoPlayer stream={stream} />
          {Object.values(peers as PeerState).map((peer, index) =>
            <VideoPlayer key={index} stream={peer.stream} />
          )}

        </div>

        {/* controls panel */}
        <div className='controls'>
          <button onClick={()=> {}}  className={`${!isMuted && 'active'}`}>Mic</button>
          <button onClick={shareCamera}  className={`${!isCameraOff && 'active'}`}>Camera</button>
          <button onClick={shareScreen} className={`${isScreenShared && 'active'}`}>Screen Sharing</button>
          <button onClick={leaveRoom} className='leave'>Leave</button>
        </div>

      </div>

    </div>
  )
}

export default RoomSession
