import  { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'
import { Room as RoomValue } from '../utils/types';
import { getRoomById, getUserRooms,  } from '../utils/helpers';
import Navbar from '../components/Navbar';

const Room = () => {
  const {user} = useContext(AuthContext);
  const {roomId} = useParams();
  const [room, setRoom] = useState<RoomValue>()
  const [userRooms, setUserRooms] = useState<RoomValue[]>([])
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const baseUrl = window.location.origin;
  const invitLink =  `${baseUrl}/${room?.id}`;
 

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

    </div>
  )
}

export default Room
