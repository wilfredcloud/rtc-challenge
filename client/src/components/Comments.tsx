import React, { ChangeEvent, useContext, useState } from 'react'
import { RoomContext } from '../context/RoomContext';
import { SOCKETEVENTS as SE} from '../utils/constants';

interface CommentItemProps {
  name: string;
  message: string;
}
const CommentItem: React.FC<CommentItemProps> = ({ name, message }) => {
  return (
    <div className='comment-item'>
      <div>Name</div>
      <div>comment dfdf</div>
    </div>
  )
}

const Comments = () => {
  const {ws} = useContext(RoomContext)
  const [message, setMessage] = useState("");


  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const sendMessage = () => {
    if (message.trim() === "") return;
    ws.emit(SE.sendMessage, {})
  }

  return (
    <div className='comments-section'>
      <div className='section-title'>Comments</div>
      <div className='comments-list'>
        {[1, 2, 35].map((item) => <CommentItem name='name' message='messaage' />)}
      </div>

      <div className='comment-form'>
        <input className='comment-input' onChange={handleMessageChange} placeholder='Chat here' value={message} /> <button onClick={sendMessage} className='comment-send'>Send</button>
      </div>

    </div>
  )
}

export default Comments
