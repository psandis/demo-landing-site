import { CharacterProvider } from './components/CharacterContext'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

export default function App() {
  return (
    <CharacterProvider>
      <Scene />
      <Overlay />
    </CharacterProvider>
  )
}
