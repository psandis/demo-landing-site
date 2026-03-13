import PersonBase from './PersonBase'
import { hikerPath } from './paths'

export default function Hiker() {
  return (
    <PersonBase
      id="hiker"
      skin="#d4a574"
      shirt="#dc2626"
      pants="#44403c"
      hat={{ type: 'cowboy', color: '#8B4513' }}
      speed={2.0}
      strideFreq={2.5}
      scale={1.05}
      path={hikerPath}
    />
  )
}
