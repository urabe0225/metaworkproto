import React, { useRef, useEffect } from 'react';

const VideoTexture = ({ onLoaded }) => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
      if (onLoaded) {
        onLoaded(video);
      }
    });
  }, [onLoaded]);

  return <video ref={videoRef} style={{ display: 'none' }} />;
};

export default VideoTexture;