import PersonBase from './PersonBase'
import { explorerPath } from './paths'

export default function Explorer() {
  return (
    <PersonBase
      id="explorer"
      skin="#e8b88a"
      shirt="#2563eb"
      pants="#1e3a5f"
      speed={2.5}
      strideFreq={3}
      scale={1}
      path={explorerPath}
    />
  )
}
