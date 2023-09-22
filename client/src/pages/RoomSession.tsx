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
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [room, setRoom] = useState<RoomValue>()
  const participantName = localStorage.getItem("participantName");



    const sharNewStreamWithPeers = (newStream: MediaStream) => {
      if (!userPeer) return;
      setStream(newStream);
      Object.keys(peers as PeerState).forEach((peerId) => {
        const call = userPeer.call(peerId, newStream);
        
        call.on('stream', (remoteScreenStream) => {
          // Handle remote screen sharing streams if needed
        });
      });
    };
  

  const muteMic = () => {
    navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: false })
      .then(sharNewStreamWithPeers)
      .catch((error) => console.log(error));
    setIsMicOn(false);
  }
  const unmuteMic = () => {
    navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: true })
      .then(sharNewStreamWithPeers)
      .catch((error) => console.log(error));
    setIsMicOn(true);
  }

  const turnOnCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
      .then(sharNewStreamWithPeers)
      .catch((error) => console.log(error));
    setIsCameraOn(true);
    setIsScreenShareOn(false);
  }
  const turnOffCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: isMicOn })
      .then(sharNewStreamWithPeers)
      .catch((error) => console.log(error));
    setIsCameraOn(false);
  }

  const turnOnScreen = () => {
    navigator.mediaDevices.getDisplayMedia({}).
    then(sharNewStreamWithPeers).catch((error) => console.log(error))
    setIsCameraOn(false);
    setIsScreenShareOn(true);
  }

  const turnOffScreen = () => {
    navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: isMicOn })
      .then(sharNewStreamWithPeers)
      .catch((error) => console.log(error));
      setIsScreenShareOn(false);
  }

  

  const handleRoomSessionState = ({roomState}: {roomState:boolean}) => { 
    if (!roomState)  {
      window.location.replace(`/${roomId}?session=false`);
    }
}

const leaveRoom = () => {
    window.location.replace(`/${roomId}`)
} 
 

  useEffect(() => {

    if (!userPeer || !stream) {
      navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: isMicOn })
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
          <button onClick={isMicOn? muteMic : unmuteMic}  className={`${isMicOn && 'active'}`}>Mic</button>
          <button onClick={isCameraOn ? turnOffCamera : turnOnCamera}  className={`${isCameraOn && 'active'}`}>Camera</button>
          <button onClick={isScreenShareOn ? turnOffScreen : turnOnScreen} className={`${isScreenShareOn && 'active'}`}>Screen Sharing</button>
          <button onClick={leaveRoom} className='leave'>Leave</button>
        </div>

      </div>

    </div>
  )
}

export default RoomSession
