import PersonBase from './PersonBase'
import { joggerPath } from './paths'

export default function Jogger() {
  return (
    <PersonBase
      id="jogger"
      skin="#c68642"
      shirt="#16a34a"
      pants="#1e293b"
      speed={3.5}
      strideFreq={4.5}
      scale={0.95}
      path={joggerPath}
    />
  )
}
