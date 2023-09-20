import  { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
    const {user, setUser} = useContext(AuthContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        setUser(null);
        navigate("/");
    }
  return (
    <div>
        <span>Logo</span>

       {!user && <> <Link to="/signin"><button>SignIn</button></Link>
        <Link to="/signup"><button>Signup</button></Link>
        </>}

        {user && <span>{user.data.name}</span> }
        
        <button onClick={handleLogout}>Logout</button>  
    </div>
  )
}

export default Navbar
