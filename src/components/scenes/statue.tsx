import { Suspense, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { useGLTF, SoftShadows, Html, CameraControls, RoundedBox } from '@react-three/drei'
import { easing } from 'maath'
import { Group, SpotLight, Mesh } from 'three'
import { useNavigate } from '@tanstack/react-router'            

export default function StatueScene() {
  
  return (
      <Canvas shadows="basic" eventSource={document.getElementById('root') || undefined} eventPrefix="client" camera={{ position: [0, -8, 20], fov: 45, rotation: [Math.PI / 12, 0, 0] }}>
      {/* <fog attach="fog" args={['black', 0, 20]} /> */}
      {/* <ambientLight intensity={1} /> */}
      <directionalLight position={[10, 15, 10]} intensity={10} />
      {/* <pointLight position={[0, 20, 10]} intensity={0.8} /> */}
      {/* <pointLight position={[8, 12, 8]} intensity={12} />
      <pointLight position={[-8, 12, 8]} intensity={12} />   */}
      {/* <pointLight position={[0, 20, 0]} intensity={15} color="#ffffff" />
      <pointLight position={[5, 15, -5]} intensity={10} color="#ffffff" />
      <pointLight position={[-5, 15, -5]} intensity={10} color="#ffffff" /> */}
      <Model position={[0, 2, 3]} rotation={[0, -0.2, 0]} />
      <SoftShadows samples={25} />
      <CameraControls 
        minPolarAngle={Math.PI / 8} 
        maxPolarAngle={Math.PI / 2} 
        minAzimuthAngle={-Math.PI / 4} 
        maxAzimuthAngle={Math.PI / 4} 
      />
    </Canvas>
  )
}

type ModelProps = ThreeElements['group'] & {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Model(props: ModelProps) {
  const group = useRef<Group>(null!)
  const light = useRef<SpotLight>(null!)
  const { nodes, materials } = useGLTF('/assets/BoltLogo_Concrete3.glb') as any

  const navItems = [
    { name: "New Collector Application", image: "/assets/landing_hover_black-white_1.jpg", link: "/collector/new" },
    { name: "1000% Waitlist", image: "/assets/landing_hover_black-white_4.jpg", link: "/collector/waitlist" },
    { name: "Discord Verification", image: "/assets/landing_hover_black-white_1.jpg", link: "/collector/discord" },
    { name: "OG Collector Profile", image: "/assets/landing_hover_black-white_3.jpg", link: "/collector/og" },
  ]
  
  useFrame((state, delta) => {
    easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 10), 0], 1.5, delta)
    easing.damp3(group.current.position, [0, -1, 1 - Math.abs(state.pointer.x)], 1, delta)
    // easing.damp3(light.current.position, [state.pointer.x * 12, 0, 8 + state.pointer.y * 4], 0.2, delta) // with cursor
    easing.damp3(light.current.position, [0, 0, 8], 0.2, delta) // Fixed position
  })
  
  return (
    <group ref={group} {...props}>
      <mesh 
        castShadow 
        receiveShadow 
        geometry={(nodes.Bolt as any).geometry} 
        material={materials['Concrete material']}
        rotation={[Math.PI / 2, 0, 0]} 
        scale={0.7} 
        dispose={null} 
      />
      <Annotation position={[1.75, 4, 2.5]} href={navItems[0].link}>
        {navItems[0].name}
      </Annotation>
      <Annotation position={[2.5, -2, 3]} href={navItems[1].link}>
        {navItems[1].name}
      </Annotation>
      <Annotation position={[-2.5, -1, 4]} href={navItems[2].link}>
        {navItems[2].name}
      </Annotation>
      <Annotation position={[-2, 2, 3]} href={navItems[3].link}>
        {navItems[3].name}
      </Annotation>
      <spotLight angle={0.5} penumbra={0.5} ref={light} castShadow intensity={5} shadow-mapSize={1024} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

type AnnotationProps = {
  children: React.ReactNode
  position: [number, number, number]
  href: string
}

function Annotation({ children, ...props }: AnnotationProps) {
  const navigate = useNavigate()
  
  return (
    <Html
      {...props}
      transform
      occlude={false}
      castShadow
      receiveShadow
      geometry={
        /** Using roundedBoxGeometry to create 3D depth instead of a flat plane */
        <RoundedBox args={[1.66, 0.47, 2]} />
      }>
      <div 
        className="cursor-pointer outline-none border-none text-[8px] font-light bg-black text-white px-2.5 py-0.5 rounded-3xl tracking-wide flex justify-center items-center gap-1.5 opacity-100 overflow-hidden w-full annotation-hover" 
      onClick={() => navigate({ to: props.href })}
      style={{
        textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
      >
        {children}
      </div>
    </Html>
  )
}
