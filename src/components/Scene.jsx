import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { useCharacter } from './CharacterContext'
import Terrain from './Terrain'
import Explorer from './Explorer'
import Hiker from './Hiker'
import Jogger from './Jogger'
import Wanderer from './Wanderer'
import Scout from './Scout'
import FollowCamera from './FollowCamera'

function SoftCloud({ position, scale = 1, speed = 0.1 }) {
  const groupRef = useRef()
  const puffs = useMemo(() => {
    const arr = []
    for (let i = 0; i < 6; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 4 * scale,
          (Math.random() - 0.5) * 1.2 * scale,
          (Math.random() - 0.5) * 2 * scale,
        ],
        s: (0.8 + Math.random() * 1.2) * scale,
      })
    }
    return arr
  }, [scale])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += speed * delta
      if (groupRef.current.position.x > 70) groupRef.current.position.x = -70
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {puffs.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.s, 8, 8]} />
          <meshStandardMaterial
            color="#fff"
            transparent
            opacity={0.35}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function SceneContent() {
  const orbitRef = useRef()
  const { povMode, selected } = useCharacter()

  return (
    <>
      {/* Sky fills entire background */}
      <Sky
        distance={450000}
        sunPosition={[100, 40, 100]}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49}
        azimuth={0.25}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#4a8c3f"
        intensity={0.3}
      />

      {/* Clouds */}
      <SoftCloud position={[-35, 22, -30]} scale={2.5} speed={0.3} />
      <SoftCloud position={[15, 26, -35]} scale={2} speed={0.4} />
      <SoftCloud position={[35, 20, 15]} scale={2.2} speed={0.2} />
      <SoftCloud position={[-25, 28, 20]} scale={2.8} speed={0.35} />
      <SoftCloud position={[5, 24, -45]} scale={2} speed={0.3} />
      <SoftCloud position={[45, 21, -20]} scale={2.5} speed={0.15} />

      {/* World */}
      <Terrain />

      {/* Characters */}
      <Explorer />
      <Hiker />
      <Jogger />
      <Wanderer />
      <Scout />

      {/* POV Camera */}
      <FollowCamera enabled={povMode && !!selected} orbitControlsRef={orbitRef} />

      {/* Controls */}
      <OrbitControls
        ref={orbitRef}
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={60}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
        enabled={!povMode}
      />

      {/* Fog */}
      <fog attach="fog" args={['#87CEEB', 40, 120]} />
    </>
  )
}

export default function Scene() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas
        shadows
        camera={{ position: [20, 15, 25], fov: 50 }}
        gl={{ antialias: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
