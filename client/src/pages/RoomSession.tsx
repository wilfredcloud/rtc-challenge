import { useContext, useEffect, useState, } from 'react'
import { AuthContext } from '../context/AuthContext'
import { RoomContext } from '../context/RoomContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SOCKETEVENTS as SE } from '../utils/constants';
import PeerDisplayer from '../components/PeerDisplayer';
import { PeerState, } from '../reducers/peerReducer';
import { addPeerAction } from '../reducers/peerActions';
import Participants from '../components/Participants';
import Comments from '../components/Comments';
import { Room as RoomValue } from '../utils/types';
import { Participant } from '../utils/types';
import { getRoomById, hasVideoDevice, setupMediaConstraint } from '../utils/helpers';

const RoomSession = () => {
  const { user, } = useContext(AuthContext);
  const { ws, userPeer, stream, peers, setStream, dispatchPeers } = useContext(RoomContext);
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [room, setRoom] = useState<RoomValue>()
  const participantName = localStorage.getItem("participantName");
  const [hasCamera, setHasCamera] = useState(false);
  const [roomSessionError, setRoomSessionError] = useState("");
  const [participant, setParticipant] = useState<Participant>();



  const shareNewStreamWithPeers = (newStream: MediaStream) => {
    if (!userPeer) return;
    setStream(newStream);
    Object.keys(peers as PeerState).forEach((peerId) => {
       userPeer.call(peerId, newStream, {metadata: participant});
    });
  };


  const toggleMic = () => {
    setStream((stream) => {
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !isMicOn;
        });
      setIsMicOn(!isMicOn);
      shareNewStreamWithPeers(stream)
      }
      return stream
    });
  }

 const toggleCamera = () => {
  setStream((stream) => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
    setIsCameraOn(!isCameraOn);
    shareNewStreamWithPeers(stream)
    }
    return stream
  });
}


  const turnOnScreen = () => {
    navigator.mediaDevices.getDisplayMedia({}).
      then(shareNewStreamWithPeers).catch((error) => console.log(error))
    setIsCameraOn(false);
    setIsScreenShareOn(true);
  }

  const turnOffScreen = () => {
    navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: isMicOn })
      .then(shareNewStreamWithPeers)
      .catch((error) => console.log(error));
    setIsScreenShareOn(false);
  }



  const handleRoomSessionState = ({ roomState }: { roomState: boolean }) => {
    if (!roomState) {
      window.location.replace(`/${roomId}?session=false`);
    }
  }

  const leaveRoom = () => {
    window.location.replace(`/${roomId}`)
  }

  useEffect(() => {

    if (!participantName) {
      navigate(`/${roomId}`);
      return;
    }

    const getRoom = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);

      } catch (error) {
        navigate(`/${roomId}`);
      }
    }

    getRoom();
    ws.on(SE.roomSessionState, handleRoomSessionState)
    ws.emit(SE.isRoomInSession, { roomId })

    return () => {
      ws.off(SE.roomSessionState)
    }

  }, [roomId, participantName])


  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const constraint = await setupMediaConstraint({audio: isMicOn, video: isCameraOn});
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        setStream(stream)
        const hasCamera = await hasVideoDevice()
        setHasCamera(hasCamera);
      } catch (error) {
        setRoomSessionError("Your Device is not supported")
      }
    }
    if (!userPeer || !stream) {
        getMediaStream();
    }

    if (!userPeer || !stream) return;
    const participant: Participant = {
      peerId: userPeer.id,
      name: participantName!,
      isRoomOwner: room?.userId === user?.data.id || false
    }

    setParticipant(participant);

    ws.emit(SE.joinRoomSession, { roomId, participant: participant })

    ws.on(SE.peerJoined, ({ participant: peer }) => {
      const call = userPeer.call(peer.peerId, stream, {metadata: participant});
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(peer.peerId, peerStream, peer))
      })
    })

    userPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(call.peer, peerStream, call.metadata))
      })
    })

  }, [userPeer, stream])



if (roomSessionError !== "") {
  return <div>
    <h3 className='error'>{roomSessionError}</h3>
    <Link to={`/${roomId}`}><button>Return to Rome</button></Link>
  </div>
}

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
          <PeerDisplayer stream={stream} metadata={participant} />
          {Object.values(peers as PeerState).map((peer, index) =>
            <PeerDisplayer key={index} {...peer}/>
          )}

        </div>

        {/* controls panel */}
        <div className='controls'>
          <button onClick={toggleMic} className={`${isMicOn && 'active'}`}>Mic</button>
          {hasCamera &&  <button onClick={toggleCamera} className={`${isCameraOn && 'active'}`}>Camera</button>}
          <button onClick={isScreenShareOn ? turnOffScreen : turnOnScreen} className={`${isScreenShareOn && 'active'}`}>Screen Sharing</button>
          <button onClick={leaveRoom} className='leave'>Leave</button>
        </div>

      </div>

    </div>
  )
}

export default RoomSession
