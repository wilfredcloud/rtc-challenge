import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserRooms, } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE } from '../utils/constants';
import VideoPlayer from '../components/PeerDisplayer';
import PreviewVideoPlayer from '../components/PreviewVideoPlayer';
import Peer from 'peerjs';

const Room = () => {
  const { user } = useContext(AuthContext);
  const { ws, stream, setStream, setUserPeer } = useContext(RoomContext);
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink = `${baseUrl}/${room?.id}`;
  const navigate = useNavigate();



  useEffect(() => {
    const getRooms = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);
      } catch (error) {
        console.log("Something went wrong");
      } finally {
        setLoading(false);
      }

    }

    getRooms();
  }, [roomId, user])


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitLink);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000)
    } catch (error) {
      console.log("Unable to copy", error)
    }
  }

  const startMeeting = () => {
    if (!user) return;
  
    const data = {
      roomId,
      userId: user.data.id,
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => setStream(stream))

    ws.emit(SE.startRoomSession, data);

  }
  const joinMeeting = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => setStream(stream))
    navigate(`/${roomId}/join`)
  }


  if (loading) {
    return <h6>Loading</h6>
  }
  if (!loading && !room) {
    return <>Invalid room</>
  }


  return (
    <div>
      <Navbar />
      <h1>{room?.name}</h1>
      <p>Invite participant</p>
      <input readOnly value={invitLink} /> <button onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy'}</button>
      <br />
      <button onClick={startMeeting}>Start Meeting</button>
   
    </div>
  )
}

export default Room
