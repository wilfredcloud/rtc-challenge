import { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const {user} = useContext(AuthContext);
    const {ws} = useContext(RoomContext);

    const createMeeting = () => {
        ws.emit("create-meeting", {name: "User"})
    }
  return (
    <div>
        <h1>Welcome to ZarTech Video Conferencings</h1>

        <div><button onClick={createMeeting}>Start a meeting</button> <input placeholder='Enter meeting link'/> <button>Join </button></div>
    </div>
  )
}

export default Home
