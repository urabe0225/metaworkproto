'use client'
import React, { Suspense, useRef, useEffect, useLayoutEffect  } from 'react'
import { useState } from 'react';
import { Canvas, MeshProps, useFrame, ThreeEvent } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import styled from 'styled-components'

import SampleBox from '@/components/SampleBox'

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
              -3//z座標
            ] 
          } 
        }>
        <ambientLight intensity={0.65} />
        <spotLight position={[0, 2, -1]} intensity={0.4} />
        <SampleBox />
        <OrbitControls />
        <gridHelper />
      </Canvas>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export default App;