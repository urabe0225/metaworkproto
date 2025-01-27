import React, { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

export default function SampleBox() {
    const ref = useRef({} as Mesh)
    useFrame(() => (ref.current.rotation.z += 0.01))

    return (
      <mesh ref={ref}>
         <boxGeometry  attach='geometry' />
         <meshBasicMaterial attach='material' color='hotpink' opacity={0.5} transparent />
      </mesh>
    )
}