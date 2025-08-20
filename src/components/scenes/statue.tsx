import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { useGLTF, SoftShadows, Html, CameraControls, RoundedBox } from '@react-three/drei'
import { easing } from 'maath'
import { Group, SpotLight, Mesh } from 'three'
import { useNavigate } from '@tanstack/react-router'            
import { useDeviceOrientation, type DeviceOrientationData } from '~/hooks/use-device-orientation'

// Convert orientation angles to model rotation
function orientationToRotation(orientation: DeviceOrientationData) {
  const { alpha, beta, gamma } = orientation
  
  if (alpha === null || beta === null || gamma === null) {
    return [Math.PI / 2, 0, 0] // Default rotation
  }


  // Normalize and scale the orientation values
  const normalizedBeta = Math.max(-45, Math.min(45, beta || 0)) // Limit range to prevent over-rotation
  const normalizedGamma = Math.max(-45, Math.min(45, gamma || 0))
  
  // Convert to radians and scale for model rotation
  const betaRad = (normalizedBeta * Math.PI) / 180
  const gammaRad = (normalizedGamma * Math.PI) / 180
  
  // Calculate rotation: base rotation + device orientation
  const rotationX = Math.PI / 2 + (betaRad * 0.5) // Forward/backward tilt
  const rotationY = gammaRad * 0.5 // Left/right tilt  
  const rotationZ = 0
  
  return [rotationX, rotationY, rotationZ]
}

export default function StatueScene() {
  const { isSupported, hasPermission, requestPermission, orientation, error } = useDeviceOrientation()
  const [manualPermissionRequested, setManualPermissionRequested] = useState(false)
  
  // Auto-enable device control when available
  useEffect(() => {
    const enableDeviceControl = async () => {
      if (isSupported) {
        try {
          await requestPermission()
          // Permission is handled automatically by the hook
        } catch (error) {
          // Silently fail for background animation
          console.log('Device orientation not available:', error)
        }
      }
    }
    
    enableDeviceControl()
  }, [isSupported, requestPermission])

  const handleManualPermissionRequest = async () => {
    setManualPermissionRequested(true)
    await requestPermission()
  }
  return (
    <div className="relative w-full h-full">
      <Canvas 
        shadows="basic" 
        eventSource={document.getElementById('root') || undefined} 
        eventPrefix="client" 
        camera={{ position: [0, -8, 20], fov: 45, rotation: [Math.PI / 12, 0, 0] }}
        onCreated={({ gl }) => {
          gl.setAnimationLoop(null) // Disable animation loop
        }}
      >
      {/* <fog attach="fog" args={['black', 0, 20]} /> */}
      {/* <ambientLight intensity={1} /> */}
      <directionalLight position={[10, 15, 10]} intensity={10} />
      {/* <pointLight position={[0, 20, 10]} intensity={0.8} /> */}
      {/* <pointLight position={[8, 12, 8]} intensity={12} />
      <pointLight position={[-8, 12, 8]} intensity={12} />   */}
      {/* <pointLight position={[0, 20, 0]} intensity={15} color="#ffffff" />
      <pointLight position={[5, 15, -5]} intensity={10} color="#ffffff" />
      <pointLight position={[-5, 15, -5]} intensity={10} color="#ffffff" /> */}
      <Model 
        position={[0, 2, 3]} 
        rotation={[0, -0.2, 0]} 
        useDeviceControl={hasPermission || false}
      />
      <SoftShadows samples={25} />
      <CameraControls 
        minPolarAngle={Math.PI / 8} 
        maxPolarAngle={Math.PI / 2} 
        minAzimuthAngle={-Math.PI / 4} 
        maxAzimuthAngle={Math.PI / 4} 
      />
      </Canvas>

            {/* iOS Permission Button */}
            {isSupported && hasPermission === null && !manualPermissionRequested && (
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleManualPermissionRequest}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Enable Tilt
          </button>
        </div>
      )}
      
      {/* Debug Panel - Remove this after debugging */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs">
        <div className="mb-2 font-bold">Device Orientation Debug</div>
        <div>Supported: {isSupported ? '✅' : '❌'}</div>
        <div>Permission: {hasPermission === null ? '⏳' : hasPermission ? '✅' : '❌'}</div>
        <div>Active: {(hasPermission && isSupported) ? '✅' : '❌'}</div>
        {error && <div className="text-red-300">Error: {error}</div>}
        <hr className="my-2 border-gray-500" />
        <div>Alpha: {orientation.alpha?.toFixed(1) ?? 'null'}°</div>
        <div>Beta: {orientation.beta?.toFixed(1) ?? 'null'}°</div>
        <div>Gamma: {orientation.gamma?.toFixed(1) ?? 'null'}°</div>
        <hr className="my-2 border-gray-500" />
        <div className="text-xs text-gray-300 mt-2">
          Tilt your device to see values change
        </div>
      </div>
    </div>
  )
}

type ModelProps = ThreeElements['group'] & {
  position?: [number, number, number]
  rotation?: [number, number, number]
  useDeviceControl?: boolean
}

function Model(props: ModelProps) {
  const group = useRef<Group>(null!)
  const light = useRef<SpotLight>(null!)
  const mesh = useRef<Mesh>(null!)
  const { orientation } = useDeviceOrientation()
  
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


    // handle mesh rotation based on device orientation or default
    if (mesh.current) {
      const targetRotation = props.useDeviceControl 
        ? orientationToRotation(orientation)
        : [Math.PI / 2, 0, 0] // Default rotation
      
      easing.dampE(mesh.current.rotation, targetRotation as [number, number, number], 0.8, delta)
    }
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
