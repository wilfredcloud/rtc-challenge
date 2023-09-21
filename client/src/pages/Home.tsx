import { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getUserHomeRoom } from '../utils/helpers';

const Home = () => {
    const {user} = useContext(AuthContext);
    const {ws} = useContext(RoomContext);
    const navigate = useNavigate()
    const createMeeting = async () => {
       if (!user) {
        navigate("/signin");
        return;
       }
       try {
        const room = await getUserHomeRoom(user.data.id);
        navigate(`/${room.id}`)
       } catch (error) {
        console.log('Error occured')
       }
    }
  return (
    <div>
       <Navbar/>
        <h1>Welcome to ZarTech Video Conferencings</h1>

        <div><button onClick={createMeeting}>Start a meeting</button> <input placeholder='Enter meeting link'/> <button>Join </button></div>
    </div>
  )
}

export default Home
