'use client'
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import styled from 'styled-components'

import Avatar from '@/components/Avatar'

const App = () => {
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
          <Avatar position={[0, 0, 0]} vrm={'/AliciaSolid.vrm'}/>
          <Avatar position={[0, 0, -1]} vrm={'/bot-male.vrm'} scale={0.5} />
          <Avatar position={[1, 0, 0]} vrm={'/three-vrm-girl.vrm'} />
        </Suspense>
      </Canvas>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export default App;