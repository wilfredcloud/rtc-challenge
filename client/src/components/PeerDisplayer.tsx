import { useContext, useEffect, useRef } from 'react'

import { Participant } from '../utils/types';
import { RoomContext } from '../context/RoomContext';

interface PeerDisplayerProps {
  stream: MediaStream | null,
  metadata?: Participant,
  muted?: boolean
}
const PeerDisplayer: React.FC<PeerDisplayerProps> = ({ stream, metadata, muted=false }) => {
  const { userPeer } = useContext(RoomContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }

  }, [stream])

  if (!stream) {
    return <div className='participant-grid-item'>
      <div className='participant-content'>
        {`${metadata?.name || '...'} ${metadata?.peerId === userPeer?.id ? '(Me)' : ''} ${metadata?.isRoomOwner ? '[HOST]' : ''}`}
      </div>
    </div>
  }
  return (
    <div className='participant-grid-item'>
      <video className='participant-video' ref={videoRef} autoPlay muted={muted} />
      {`${metadata?.name || '...'} ${metadata?.peerId === userPeer?.id ? '(Me)' : ''} ${metadata?.isRoomOwner ? '[HOST]' : ''}`}
    </div>
  )
}

export default PeerDisplayer;
