import { createContext, useContext, useState, useCallback } from 'react'

const CharacterContext = createContext()

// Bios for each character
export const characterBios = {
  explorer: {
    name: 'Alex',
    role: 'Explorer',
    bio: 'Mapping uncharted terrain since 2019. Prefers the scenic route.',
    color: '#2563eb',
  },
  hiker: {
    name: 'Rosa',
    role: 'Hiker',
    bio: 'Veteran trail walker. Has crossed 3 continents on foot.',
    color: '#dc2626',
  },
  jogger: {
    name: 'Kai',
    role: 'Jogger',
    bio: 'Morning runner. Believes every hill is just a speed bump.',
    color: '#16a34a',
  },
  wanderer: {
    name: 'Milo',
    role: 'Wanderer',
    bio: 'No destination, no deadline. Enjoys the slow life.',
    color: '#7c3aed',
  },
  scout: {
    name: 'Nia',
    role: 'Scout',
    bio: 'Always ahead of the group. Never gets lost. Mostly.',
    color: '#0891b2',
  },
}

export function CharacterProvider({ children }) {
  const [selected, setSelected] = useState(null)
  const [positions, setPositions] = useState({})
  const [povMode, setPovMode] = useState(false)

  const selectCharacter = useCallback((id) => {
    setSelected(prev => {
      if (prev === id) {
        setPovMode(false)
        return null
      }
      return id
    })
  }, [])

  const togglePov = useCallback(() => {
    setPovMode(prev => !prev)
  }, [])

  const resetCamera = useCallback(() => {
    setPovMode(false)
  }, [])

  const updatePosition = useCallback((id, x, z, terrainY) => {
    setPositions(prev => {
      const p = prev[id]
      if (p && Math.abs(p.x - x) < 0.01 && Math.abs(p.z - z) < 0.01) return prev
      return { ...prev, [id]: { x, z, y: terrainY } }
    })
  }, [])

  return (
    <CharacterContext.Provider value={{ selected, selectCharacter, positions, updatePosition, povMode, togglePov, resetCamera }}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  return useContext(CharacterContext)
}
