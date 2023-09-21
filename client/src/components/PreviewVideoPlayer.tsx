import React, { useEffect, useRef } from 'react'

const PreviewVideoPlayer:React.FC<{stream: MediaStream | null}> = ({stream}) => {

    const videoRef =  useRef<HTMLVideoElement>(null);

    useEffect (() => {

        if(videoRef.current && stream){
          videoRef.current.srcObject = stream
          
        } 

    }, [stream])

    if (!stream) {
      return  <div >
        camera shows here
      </div>
    }
  return (
       <video className='preview-video' ref={videoRef} autoPlay muted/>
  )
}

export default PreviewVideoPlayer;
