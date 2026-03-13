import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { getTerrainHeight } from './terrainHeight'
import { getAvoidanceForce, isInsideAnyTree, clampBounds, personPositions } from './navigation'
import { useCharacter } from './CharacterContext'
import Limb from './Limb'
import Hat from './Hat'

const WAYPOINT_REACH = 2
const STUCK_THRESHOLD = 0.5
const STUCK_TIME = 0.8

export default function PersonBase({ id, skin, shirt, pants, hat, speed, strideFreq, scale = 1, path }) {
  const groupRef = useRef()
  const bodyBobRef = useRef()
  const posRef = useRef({ x: path[0].x, z: path[0].z })
  const facingRef = useRef({ x: 0, z: 1 })
  const stuckTimerRef = useRef(0)
  const lastPosRef = useRef({ x: path[0].x, z: path[0].z })
  const waypointIndexRef = useRef(0)
  const frameCountRef = useRef(0)

  const { selected, selectCharacter, updatePosition } = useCharacter()
  const isSelected = selected === id

  useMemo(() => {
    personPositions[id] = { x: path[0].x, z: path[0].z }
  }, [id, path])

  const phase = useMemo(() => id.charCodeAt(0) * 1.7, [id])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !bodyBobRef.current) return

    const dt = Math.min(delta, 0.05)
    const pos = posRef.current
    const facing = facingRef.current
    const waypoint = path[waypointIndexRef.current]

    let toX = waypoint.x - pos.x
    let toZ = waypoint.z - pos.z
    const distToWaypoint = Math.sqrt(toX * toX + toZ * toZ)

    if (distToWaypoint < WAYPOINT_REACH) {
      waypointIndexRef.current = (waypointIndexRef.current + 1) % path.length
      return
    }

    toX /= distToWaypoint
    toZ /= distToWaypoint

    const avoidance = getAvoidanceForce(pos.x, pos.z, id)
    let moveX = toX + avoidance.x
    let moveZ = toZ + avoidance.z

    const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ)
    if (moveLen > 0) {
      moveX /= moveLen
      moveZ /= moveLen
    }

    const newX = pos.x + moveX * speed * dt
    const newZ = pos.z + moveZ * speed * dt

    if (!isInsideAnyTree(newX, newZ)) {
      pos.x = newX
      pos.z = newZ
    }

    clampBounds(pos)
    personPositions[id] = { x: pos.x, z: pos.z }

    const movedDist = Math.sqrt(
      (pos.x - lastPosRef.current.x) ** 2 + (pos.z - lastPosRef.current.z) ** 2
    )
    lastPosRef.current = { x: pos.x, z: pos.z }

    if (movedDist / dt < STUCK_THRESHOLD) {
      stuckTimerRef.current += dt
      if (stuckTimerRef.current > STUCK_TIME) {
        stuckTimerRef.current = 0
        waypointIndexRef.current = (waypointIndexRef.current + 1) % path.length
        return
      }
    } else {
      stuckTimerRef.current = 0
    }

    facing.x += (moveX - facing.x) * 0.1
    facing.z += (moveZ - facing.z) * 0.1

    const terrainY = getTerrainHeight(pos.x, pos.z)
    groupRef.current.position.set(pos.x, terrainY, pos.z)

    const lookX = pos.x + facing.x
    const lookZ = pos.z + facing.z
    const lookY = getTerrainHeight(lookX, lookZ)
    groupRef.current.lookAt(lookX, lookY, lookZ)

    bodyBobRef.current.position.y = Math.abs(Math.sin(clock.getElapsedTime() * strideFreq)) * 0.06

    // Report position every 6 frames to avoid excessive state updates
    frameCountRef.current++
    if (frameCountRef.current % 6 === 0) {
      updatePosition(id, pos.x, pos.z, terrainY)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    selectCharacter(id)
  }

  return (
    <group ref={groupRef} scale={scale} onClick={handleClick}>
      <group ref={bodyBobRef}>
        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, 3.2, 0]}>
            <coneGeometry args={[0.15, 0.3, 4]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        )}

        <mesh position={[0, 2.1, 0]} castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color={skin} />
        </mesh>

        {hat && <Hat type={hat.type} color={hat.color} />}

        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[0.6, 1, 0.3]} />
          <meshStandardMaterial color={shirt} />
        </mesh>

        <Limb pivot={[-0.4, 1.7, 0]} size={[0.15, 0.6, 0.15]} color={skin} offsetAngle={0} swingAmplitude={0.4} strideFreq={strideFreq} phaseOffset={phase} />
        <Limb pivot={[0.4, 1.7, 0]} size={[0.15, 0.6, 0.15]} color={skin} offsetAngle={Math.PI} swingAmplitude={0.4} strideFreq={strideFreq} phaseOffset={phase} />
        <Limb pivot={[-0.15, 0.7, 0]} size={[0.2, 0.7, 0.2]} color={pants} offsetAngle={Math.PI} swingAmplitude={0.4} strideFreq={strideFreq} phaseOffset={phase} />
        <Limb pivot={[0.15, 0.7, 0]} size={[0.2, 0.7, 0.2]} color={pants} offsetAngle={0} swingAmplitude={0.4} strideFreq={strideFreq} phaseOffset={phase} />
      </group>
    </group>
  )
}
