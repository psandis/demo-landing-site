import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Limb({ pivot, size, color, offsetAngle, swingAmplitude, strideFreq, phaseOffset = 0 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * strideFreq + phaseOffset
    ref.current.rotation.x = Math.sin(t + offsetAngle) * swingAmplitude
  })

  return (
    <group position={pivot}>
      <group ref={ref}>
        <mesh position={[0, -size[1] / 2, 0]} castShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}
