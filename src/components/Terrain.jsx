import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getTerrainHeight } from './terrainHeight'
import { treePositions } from './worldData'

function createTerrainGeometry(width, depth, widthSegments, depthSegments) {
  const geometry = new THREE.PlaneGeometry(width, depth, widthSegments, depthSegments)
  const positions = geometry.attributes.position.array

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    // Use raw plane coords directly (not world coords)
    positions[i + 2] =
      Math.sin(x * 0.3) * 0.8 +
      Math.cos(y * 0.2) * 0.6 +
      Math.sin(x * 0.1 + y * 0.1) * 1.5 +
      Math.cos(x * 0.5) * Math.sin(y * 0.4) * 0.4
  }

  geometry.computeVertexNormals()
  return geometry
}

function Grass({ count = 5000 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { matrices, swayOffsets } = useMemo(() => {
    const m = []
    const offsets = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 150
      const z = (Math.random() - 0.5) * 150
      const terrainY = getTerrainHeight(x, z)

      dummy.position.set(x, terrainY, z)
      dummy.rotation.set(0, Math.random() * Math.PI, 0)
      dummy.scale.setScalar(0.3 + Math.random() * 0.5)
      dummy.updateMatrix()
      m.push(dummy.matrix.clone())
      offsets.push(Math.random() * Math.PI * 2)
    }
    return { matrices: m, swayOffsets: offsets }
  }, [count, dummy])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      dummy.matrix.copy(matrices[i])
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      dummy.rotation.z = Math.sin(t * 1.5 + swayOffsets[i]) * 0.1
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <coneGeometry args={[0.05, 0.6, 4]} />
      <meshStandardMaterial color="#3a7d44" />
    </instancedMesh>
  )
}

function Trees() {
  const positions = useMemo(() => {
    return treePositions.map(t => ({
      x: t.x,
      y: getTerrainHeight(t.x, t.z),
      z: t.z,
      scale: t.radius / 1.8 // reverse the scale from worldData
    }))
  }, [])

  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]} scale={p.scale}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 2, 6]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <coneGeometry args={[1.2, 2.5, 8]} />
            <meshStandardMaterial color="#2d5a27" />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#347a2e" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Terrain() {
  const geometry = useMemo(
    () => createTerrainGeometry(200, 200, 200, 200),
    []
  )

  return (
    <group>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#4a8c3f"
          flatShading
          roughness={0.9}
        />
      </mesh>
      <Grass />
      <Trees />
    </group>
  )
}
