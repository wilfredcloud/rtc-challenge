import React from 'react'
import Navbar from '../components/Navbar'

const SignIn = () => {
  return (
    <div>
        <Navbar/>
        <br />
        <input placeholder='email'/>
        <br />
        <input type='password' placeholder='password' />
        <br />
        <button>Sign In</button>
    </div>
  )
}

export default SignIn
