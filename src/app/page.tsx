'use client'
import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls } from '@react-three/drei'
import styled from 'styled-components'
import Avatar from '@/components/SittingAvatar'
import Camera from '@/components/Camera'
import VideoTexture from '@/components/VideoTexture'

const App = () => {
  const [video, setVideo] = useState(null);
  return (
    <Container>
      <Canvas 
        camera={
          { 
            fov: 75,//カメラの錐台の垂直視野, 
            near: 0.1,//平面近くのカメラ錐台, 
            far: 1000,//カメラの錐台の遠方平面, 
            position: [
              0,//x座標, 
              2,//y座標, 
              2//z座標
            ] 
          } 
        }>
        <ambientLight intensity={0.65} />
        <spotLight position={[0, 2, -1]} intensity={0.4} />
        <OrbitControls />
        <gridHelper />
        <Suspense fallback={null}>
          <Avatar position={[-1, 0, 0]} vrm={'/AliciaSolid.vrm'} rotation={[0, -Math.PI/2, 0]} />
          <Avatar position={[0, 0, -1]} vrm={'/bot-male.vrm'} scale={0.7} />
          <Avatar position={[1, 0, 0]} vrm={'/three-vrm-girl.vrm'} rotation={[0, Math.PI/2, 0]} />
          <Box args={[0.5, 0.5, 0.5]} position={[1, 0.5, 0]} />
          <Box args={[0.5, 0.5, 0.5]} position={[-1, 0.5, 0]} />
          <Box args={[0.5, 0.3, 0.5]} position={[0, 0.4, -1]} />
          <Camera video={video} position={[0, 2, -2]} rotation={[0, 0, 0]} />
        </Suspense>
      </Canvas>
      <VideoTexture onLoaded={setVideo} />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`


export default App
