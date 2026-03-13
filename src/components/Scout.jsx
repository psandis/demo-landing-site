import PersonBase from './PersonBase'
import { scoutPath } from './paths'

export default function Scout() {
  return (
    <PersonBase
      id="scout"
      skin="#e0ac69"
      shirt="#0891b2"
      pants="#1c1917"
      hat={{ type: 'cap', color: '#1d4ed8' }}
      speed={2.8}
      strideFreq={3.5}
      scale={0.9}
      path={scoutPath}
    />
  )
}
