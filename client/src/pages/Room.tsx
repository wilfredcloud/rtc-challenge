import  { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserRooms,  } from '../utils/helpers';
import Navbar from '../components/Navbar';
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE} from '../utils/constants';

const Room = () => {
  const {user} = useContext(AuthContext);
  const {ws} = useContext(RoomContext);
  const {roomId} = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [userRooms, setUserRooms] = useState<RoomValue[]>([])
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink =  `${baseUrl}/${room?.id}`;
  const navigate = useNavigate();

 

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



  const startMeeting = () => {
    if (!user) return;
    const data = {
      roomId,
      userId: user.data.id,
    }
    ws.emit(SE.startRoomSession, data);

  }
  const joinMeeting = () => {
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
        <p>Your name</p>
        <input placeholder='Fullname' /> <button onClick={joinMeeting}>Join</button>
        <br />

      </div>
    )
  }

  return (
    <div>
      <Navbar/>
      <h1>{room?.name}</h1>
      <p>Invite participant</p>
      <input readOnly value={invitLink}/> <button onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy'}</button>
      <br />
      <button onClick={startMeeting}>Start Meeting</button>

      <h5>Rooms</h5>
      <hr />
      {userRooms.map((room) => <Link key={room.id} to={`/${room.id}`}><div>{room.name}</div></Link>)}
          <button>Create a Room</button>
    </div>
  )
}

export default Room
