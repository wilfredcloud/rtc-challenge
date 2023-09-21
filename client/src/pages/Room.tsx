import  { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserRooms,  } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE} from '../utils/constants';
import VideoPlayer from '../components/VideoPlayer';
import PreviewVideoPlayer from '../components/PreviewVideoPlayer';

const Room = () => {
  const {user} = useContext(AuthContext);
  const {ws, stream, setStream} = useContext(RoomContext);
  const {roomId} = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink =  `${baseUrl}/${room?.id}`;



  useEffect(()=> {
    const getRooms = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);
      } catch (error) {
        console.log("Something went wrong");
      }finally{
        setLoading(false);
      }
      
    }

    getRooms();
  }, [roomId, user])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => setStream(stream))

  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitLink);
      setIsCopied(true);

      setTimeout(()=> {
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
    ws.emit(SE.startRoomSession, data);

  } 


  if (loading) {
    return <h6>Loading</h6>
  }
  if (!loading && !room) {
    return <>Invalid room</>
  }
  return (
    <div>
      <Navbar/>
      <h1>{room?.name}</h1>
      <p>Invite participant</p>
      <input readOnly value={invitLink}/> <button onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy'}</button>
      <br />
      <button onClick={startMeeting}>Start Meeting</button>
      <hr />
      <PreviewVideoPlayer stream={stream}/>
    </div>
  )
}

export default Room
