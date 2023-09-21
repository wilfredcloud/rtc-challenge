import React from 'react'

const Participants = () => {
  return (
    <div className="participants-section">
    <div className='section-title'>Participants</div>
    <div className='participants-list'>
        {[1,2,35].map((item) =><div className='participant'>
          participant {item}
        </div>)}
    </div>
  </div>
  )
}

export default Participants
