import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import React, { useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'

extend({ PlaneGeometry: THREE.PlaneGeometry })

interface CameraProps {
  video: HTMLVideoElement;
  position: [number, number, number];
  rotation: [number, number, number];
}

const Camera: React.FC<CameraProps> = ({ video, position, rotation }) => {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    const detectFaces = async () => {
      if (video) {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight
        });

        resizedDetections.forEach(detection => {
          const landmarks = detection.landmarks;
          const nose = landmarks.getNose();
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          const dx = rightEye[0].x - leftEye[0].x;
          const dy = rightEye[0].y - leftEye[0].y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          console.log(`Face angle: ${angle} degrees`);
        });
      }
    };
  
    if (video) {
      const videoTexture = new THREE.VideoTexture(video);
      setTexture(videoTexture);
      loadModels();
      video.addEventListener('play', () => {
        setInterval(detectFaces, 100);
      });
    }
  }, [video]);

  return (
    <>
    <mesh position={position} rotation={rotation} >
      <planeGeometry args={[2, 2]} />
      {texture && <meshBasicMaterial map={texture} />}
    </mesh>
    </>
  );
};

export default Camera
