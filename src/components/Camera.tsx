import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import React, { useState, useEffect } from 'react'

extend({ PlaneGeometry: THREE.PlaneGeometry })

interface CameraProps {
  video: HTMLVideoElement;
  position: [number, number, number];
  rotation: [number, number, number];
}

const Camera: React.FC<CameraProps> = ({ video, position, rotation }) => {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (video) {
      const videoTexture = new THREE.VideoTexture(video);
      setTexture(videoTexture);
    }
  }, [video]);

  return (
    <mesh position={position} rotation={rotation} >
      <planeGeometry args={[2, 2]} />
      {texture && <meshBasicMaterial map={texture} />}
    </mesh>
  );
};

export default Camera
