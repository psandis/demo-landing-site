import PersonBase from './PersonBase'
import { wandererPath } from './paths'

export default function Wanderer() {
  return (
    <PersonBase
      id="wanderer"
      skin="#f5d0a9"
      shirt="#7c3aed"
      pants="#374151"
      hat={{ type: 'beanie', color: '#f59e0b' }}
      speed={1.8}
      strideFreq={2.2}
      scale={1.1}
      path={wandererPath}
    />
  )
}
