import  { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserRooms,  } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE} from '../utils/constants';
import Peer from 'peerjs';
import Participants from '../components/Participants';

const Room = () => {
  const {user} = useContext(AuthContext);
  const {ws} = useContext(RoomContext);
  const {roomId} = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [userRooms, setUserRooms] = useState<RoomValue[]>([])
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRoomInSession, setIsRoomInSession ] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink =  `${baseUrl}/${room?.id}`;
  const navigate = useNavigate();
  const [inviteeName, setInviteeName] = useState(user?.data.name || "")

  const handleRoomSessionState = ({roomState}: {roomState:boolean}) => { 
      setIsRoomInSession(roomState);
  }

  useEffect(()=> {
    const getRooms = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);

        if(user) {
          const userRooms = await getUserRooms(user.data.id);
          setUserRooms(userRooms);
        }
      } catch (error) {
        console.log("Something went wrong");
      }finally{
        setLoading(false);
      }
      
    }
    getRooms();

    ws.emit(SE.isRoomInSession, {roomId})
    ws.on(SE.roomSessionState, handleRoomSessionState)

  }, [roomId, user])

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

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInviteeName(e.target.value)
  }


  const startMeeting = () => {
    if (!user) return;
    localStorage.setItem("participantName", user.data.name)
    const data = {
      roomId,
      userId: user.data.id,
    }
    ws.emit(SE.startRoomSession, data);

  }
  const joinMeeting = () => {
    if (inviteeName.trim() === "") return;
    localStorage.setItem("participantName", inviteeName)
    navigate(`/${roomId}/join`)
  }



  if (loading) {
    return <h6>Loading</h6>
  }
  if (!loading && !room) {
    return <>Invalid room</>
  }

  if (!user || user.data.id !== room?.userId) {
    return (
      <div>
        <Navbar />
        <h1>{room?.name}</h1>
        <p>Name *</p>
        <input placeholder='Enter your name ' onChange={handleNameChange} value={inviteeName} /> <button onClick={joinMeeting}>Join</button>
        <br />

      </div>
    )
  }

  return (
    <div>
      <Navbar/>
      <div className='container'>
      <h1>{room?.name}</h1>
      <span>Invite participant</span>
      <div >
      <input readOnly value={invitLink}/> <button onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy'}</button>

<button onClick={isRoomInSession? joinMeeting : startMeeting}> {isRoomInSession? 'Join Meeting' : 'Start Meeting' }</button>

      </div>
      <h5>Rooms</h5>
      <hr />
      <div className='room-grid'>
      {userRooms.map((room) => <Link className='room-item' key={room.id} to={`/${room.id}`}><div>{room.name}</div></Link>)}
      </div>
          <button>Create a Room</button>
      </div>
    </div>
  )
}

export default Room
