import React, { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'

const Home = () => {
    const {ws} = useContext(RoomContext);
  return (
    <div><button>Create meeting</button></div>
  )
}

export default Home
