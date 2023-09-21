import React, { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'

const Participants = () => {
  const {participants} = useContext(RoomContext);
  return (
    <div className="participants-section">
    <div className='section-title'>Participants</div>
    <div className='participants-list'>
        {participants.map((pt) =><div className='participant'>
        { pt.name}
        </div>)}
    </div>
  </div>
  )
}

export default Participants
