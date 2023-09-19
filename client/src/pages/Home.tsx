import { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'

const Home = () => {
    const {ws} = useContext(RoomContext);
    const createMeeting = () => {
        ws.emit("create-meeting", {name: "User"})
    }
  return (
    <div><button onClick={createMeeting}>Create meeting</button></div>
  )
}

export default Home
