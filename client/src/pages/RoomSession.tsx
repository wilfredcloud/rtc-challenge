import { useContext, useEffect, } from 'react'
import { v4 as uuidV4 } from 'uuid';
import { AuthContext } from '../context/AuthContext'
import { RoomContext } from '../context/RoomContext';
import { useParams } from 'react-router-dom';
import { SOCKETEVENTS as SE } from '../utils/constants';
import VideoPlayer from '../components/VideoPlayer';
import { PeerState, } from '../reducers/peerReducer';
import { addPeerAction } from '../reducers/peerActions';

const RoomSession = () => {
  const { user, } = useContext(AuthContext);
  const { ws, userPeer, stream, peers, setStream, dispatchPeers } = useContext(RoomContext);

  const { roomId } = useParams()



  // useEffect(() => {
  //   if (!userPeer) return;
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       setStream(stream);

  //       ws.emit(SE.joinRoomSession, { roomId, peerId: userPeer.id })

  //       ws.on(SE.peerJoined, ({ peerId }) => {
  //         // initiate call
  //         console.log("got peer streem");

  //         const call = userPeer.call(peerId, stream);
  //         call.on("stream", (peerStream) => {
  //           dispatchPeers(addPeerAction(peerId, peerStream))
  //         })
  //       });


  //       //    answering call
  //       userPeer.on("call", (call) => {
  //         console.log("I was called");
  //         call.answer(stream);
  //         call.on("stream", (peerStream) => {
  //           dispatchPeers(addPeerAction(call.peer, peerStream))
  //         })
  //       })
  //       ws.emit('ready')

  //     });



  // }, [userPeer])



  return (
    <div className='conference-room'>
      {/* participants */}
      <div className="participants-section">
        <div className='section-title'>Participants</div>
        <div className='participants-list'>
            {[1,2,35].map((item) =><div className='participant'>
              participant {item}
            </div>)}
        </div>
      </div>
      {/* comment */}
      <div className='comments-section'>
       <div className='section-title'>Comments</div>
       <div className='comments-list'>

       </div>

       <div className='comment-form'>
        <input /> <button>Send</button>
       </div>

      </div>
      {/* conf bos */}
      <div>
        <div>Room title</div>
        <div className="video-grid">
          {/* <VideoPlayer stream={stream} />
          {Object.values(peers as PeerState).map((peer, index) =>
            <VideoPlayer key={index} stream={peer.stream} />
          )} */}
        </div>

        {/* room footer */}
        <div></div>

      </div>

    </div>
  )
}

export default RoomSession
