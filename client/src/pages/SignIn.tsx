import { ChangeEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Axios from '../utils/Axios';
import { User } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import { getUserHomeRoom } from '../utils/helpers';


interface FormValues {
    email: string;
    password: string;
}
  
const SignIn = () => {
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate()
    const [inputValues, setInputValues] = useState<FormValues>({
        email: '',
        password: ''
    })

    const handleInputChange = ( e: ChangeEvent<HTMLInputElement> ) => {
        const  {name, value} = e.target
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }
 
    const handleSignIn = async  () => {
           try {
            const response = await Axios.post(`/auth/signin`, inputValues);
            const user: User = response.data;

            if(user && user.token) {
                setUser(user);
                const room = await getUserHomeRoom(user.data.id)
                navigate(`/${room.id}`)
            }else{
                console.log("Something went wrong");
            }
           } catch (error) {
            console.log(error);
           }
    }
  return (
    <div>
        <Navbar/>
        <form action="">
            
        </form>
        <br />
        <input type='email' name='email' placeholder='email' required
         value={inputValues.email} onChange={handleInputChange}/>
        <br />
        <input type='password' name='password' placeholder='password'  required
        value={inputValues.password} onChange={handleInputChange} />
        <br />
        <button onClick={handleSignIn}>Sign In</button>
    </div>
  )
}

export default SignIn
