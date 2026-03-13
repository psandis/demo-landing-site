export default function Hat({ type, color }) {
  if (type === 'cowboy') {
    return (
      <group position={[0, 2.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    )
  }

  if (type === 'beanie') {
    return (
      <group position={[0, 2.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 10]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    )
  }

  if (type === 'cap') {
    return (
      <group position={[0, 2.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.02, 0.2]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.03, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    )
  }

  return null
}
