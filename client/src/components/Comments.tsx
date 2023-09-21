import React from 'react'

const Comments = () => {
  return (
    <div className='comments-section'>
    <div className='section-title'>Comments</div>
    <div className='comments-list'>
    {[1,2,35].map((item) =><div className='comment-item'>
               <div>Name</div>
               <div>comment dfdf</div>
         </div>)}
    </div>

    <div className='comment-form'>
     <input className='comment-input' placeholder='Chat here' /> <button className='comment-send'>Send</button>
    </div>

   </div>
  )
}

export default Comments
