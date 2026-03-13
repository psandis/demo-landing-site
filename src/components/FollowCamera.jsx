import { useFrame, useThree } from '@react-three/fiber'
import { useCharacter } from './CharacterContext'
import { personPositions } from './navigation'
import { getTerrainHeight } from './terrainHeight'
import { useRef } from 'react'
import * as THREE from 'three'

const DEFAULT_POS = new THREE.Vector3(20, 15, 25)

export default function FollowCamera({ enabled }) {
  const { selected, povMode } = useCharacter()
  const { camera } = useThree()
  const prevPos = useRef({ x: 0, z: 0 })
  const smoothCamPos = useRef(new THREE.Vector3(20, 15, 25))
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const facingDir = useRef({ x: 0, z: 1 })

  useFrame(() => {
    if (!enabled || !selected) {
      // When POV is off, smoothly return to default position
      if (!povMode) {
        smoothCamPos.current.lerp(DEFAULT_POS, 0.02)
      }
      return
    }

    const pos = personPositions[selected]
    if (!pos) return

    const terrainY = getTerrainHeight(pos.x, pos.z)

    // Calculate facing direction from movement
    const dx = pos.x - prevPos.current.x
    const dz = pos.z - prevPos.current.z
    const moveDist = Math.sqrt(dx * dx + dz * dz)

    if (moveDist > 0.001) {
      facingDir.current.x += (dx / moveDist - facingDir.current.x) * 0.05
      facingDir.current.z += (dz / moveDist - facingDir.current.z) * 0.05
    }

    prevPos.current = { x: pos.x, z: pos.z }

    // Camera at eye level, slightly behind character
    const behindDist = 0.3
    const eyeHeight = 2.3
    const camTarget = new THREE.Vector3(
      pos.x - facingDir.current.x * behindDist,
      terrainY + eyeHeight,
      pos.z - facingDir.current.z * behindDist
    )

    // Look ahead in facing direction
    const lookAhead = 15
    const lookTarget = new THREE.Vector3(
      pos.x + facingDir.current.x * lookAhead,
      terrainY + 1.5,
      pos.z + facingDir.current.z * lookAhead
    )

    smoothCamPos.current.lerp(camTarget, 0.08)
    smoothLookAt.current.lerp(lookTarget, 0.06)

    camera.position.copy(smoothCamPos.current)
    camera.lookAt(smoothLookAt.current)
  })

  return null
}
