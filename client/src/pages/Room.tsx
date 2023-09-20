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
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <h6>Loading</h6>
  }
  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Room
