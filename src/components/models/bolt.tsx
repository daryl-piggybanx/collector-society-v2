
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

type ModelProps = ThreeElements['group'] & {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Bolt(props: ModelProps) {
  const { nodes, materials } = useGLTF('/assets/BoltLogo_Concrete3.glb') as any
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bolt.geometry}
        material={materials['Concrete material']}
        position={[0, 3.216, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.446}
      />
    </group>
  )
}

useGLTF.preload('/assets/BoltLogo_Concrete3.glb')