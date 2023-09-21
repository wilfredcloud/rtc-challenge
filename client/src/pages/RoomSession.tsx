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
import { error } from 'console';
import { Participant } from '../utils/types';

const RoomSession = () => {
  const { user, } = useContext(AuthContext);
  const { ws, userPeer, stream, peers, participants, setStream, dispatchPeers } = useContext(RoomContext);

  const { roomId } = useParams()
  const navigate = useNavigate()
   const [isScreenShared, setIsScreenShared] = useState(false)

  const participantName = localStorage.getItem("participantName");

  const switchStream = () => {
      if(isScreenShared) {
        shareCamera();
      }else {
        shareScreen();
      }
      setIsScreenShared((prev) => !prev);
  }

  const shareCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => setStream(stream)).catch((error) => console.log(error));
  }

  const shareScreen = () => {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        setStream(stream);
        setIsScreenShared(true)
      }).catch((error) => console.log(error))
  }

  useEffect(() => {
    if (!participantName) {
      navigate(`/${roomId}`);
      return;
    }
    if(!userPeer || !stream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => setStream(stream))
      .catch((error) => console.log("error"))

    }
    if (!userPeer || !stream) return;
    const participant: Participant = {
      peerId: userPeer.id,
      name: participantName,
      isRoomOwner: false
    }
    ws.emit(SE.joinRoomSession, { roomId, participant: participant  })


    ws.on(SE.peerJoined, ({peerId}) => {
      const call = userPeer.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(peerId, peerStream))
      })
  })

    userPeer.on("call", (call) => {
      console.log("I was called");
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerAction(call.peer, peerStream))
      })
    })


  }, [userPeer, stream])

  



  return (
    <div className='conference-room'>
      {/* participants */}
      <Participants/>
      {/* comment */}
      <Comments/>
      {/* conf bos */}
      <div className='room-display'>
        <div className='room-title'>Room title</div>
        <div className="participant-grid">
          <VideoPlayer stream={stream} />
          {Object.values(peers as PeerState).map((peer, index) =>
            <VideoPlayer key={index} stream={peer.stream} />
          )}

        </div>

        {/* controls panel */}
        <div className='controls'>
          <button>Mic</button>
          <button>Camera</button>
          <button onClick={shareScreen} className={`${isScreenShared && 'active'}`}>{isScreenShared ? 'Stop sharing': 'Share Screen'}</button>
          <button>Leave</button>
        </div>

      </div>

    </div>
  )
}

export default RoomSession
