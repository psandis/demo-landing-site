import { useState, useRef, useEffect, useCallback } from 'react'
import { useCharacter, characterBios } from './CharacterContext'
import './TrackerHUD.css'

function PulseBar({ bpm }) {
  return (
    <div className="pulse-container">
      <svg viewBox="0 0 200 40" className="pulse-svg">
        <polyline
          className="pulse-line"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points="0,20 20,20 30,20 35,5 40,35 45,15 50,25 55,20 80,20 100,20 110,20 115,5 120,35 125,15 130,25 135,20 160,20 180,20 185,5 190,35 195,15 200,20"
          style={{ animationDuration: `${60 / bpm}s` }}
        />
      </svg>
      <span className="pulse-bpm">{bpm} BPM</span>
    </div>
  )
}

export default function TrackerHUD({ onClose }) {
  const { selected, selectCharacter, positions, povMode, togglePov, resetCamera } = useCharacter()
  const [pos, setPos] = useState({ x: 20, y: 80 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const hudRef = useRef()

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('.hud-close') || e.target.closest('.tracker-char-btn') || e.target.closest('.tracker-action-btn')) return
    setDragging(true)
    const rect = hudRef.current.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      const rect = hudRef.current.getBoundingClientRect()
      setPos({
        x: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - rect.width),
        y: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - rect.height),
      })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const bio = selected ? characterBios[selected] : null
  const coords = selected ? positions[selected] : null

  // Simulated pulse based on character speed
  const pulseMap = { explorer: 72, hiker: 65, jogger: 142, wanderer: 58, scout: 95 }
  const bpm = selected ? pulseMap[selected] : 0

  return (
    <div
      ref={hudRef}
      className={`tracker-hud ${dragging ? 'dragging' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
    >
      <div className="tracker-header">
        <div className="tracker-title">
          <span className="tracker-icon">&#9678;</span>
          GPS TRACKER
        </div>
        <button className="hud-close" onClick={onClose} title="Close tracker">&#10005;</button>
      </div>

      {/* Character selector */}
      <div className="tracker-chars">
        {Object.entries(characterBios).map(([id, info]) => (
          <button
            key={id}
            className={`tracker-char-btn ${selected === id ? 'active' : ''}`}
            style={{ borderColor: selected === id ? info.color : 'transparent' }}
            onClick={() => selectCharacter(id)}
          >
            <span className="char-dot" style={{ background: info.color }} />
            {info.name}
          </button>
        ))}
      </div>

      {/* Selected character info */}
      {bio && (
        <div className="tracker-info">
          <div className="tracker-profile">
            <div className="profile-name" style={{ color: bio.color }}>{bio.name}</div>
            <div className="profile-role">{bio.role}</div>
            <div className="profile-bio">{bio.bio}</div>
          </div>

          <div className="tracker-coords">
            <div className="coord-section-label">GPS</div>
            <div className="coord-row">
              <span className="coord-label">LAT</span>
              <span className="coord-value">{coords ? (coords.x * 0.001 + 61.4978).toFixed(4) : '--'}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">LNG</span>
              <span className="coord-value">{coords ? (coords.z * 0.001 + 23.7610).toFixed(4) : '--'}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">ALT</span>
              <span className="coord-value">{coords ? (coords.y * 10 + 120).toFixed(1) + 'm' : '--'}</span>
            </div>
            <div className="coord-divider" />
            <div className="coord-section-label">WORLD</div>
            <div className="coord-row">
              <span className="coord-label">X</span>
              <span className="coord-value world">{coords ? coords.x.toFixed(2) : '--'}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">Y</span>
              <span className="coord-value world">{coords ? coords.y.toFixed(2) : '--'}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">Z</span>
              <span className="coord-value world">{coords ? coords.z.toFixed(2) : '--'}</span>
            </div>
          </div>

          <PulseBar bpm={bpm} />

          {/* Camera actions */}
          <div className="tracker-actions">
            <button
              className={`tracker-action-btn ${povMode ? 'active' : ''}`}
              onClick={togglePov}
            >
              &#9673; {povMode ? 'EXIT POV' : 'POV CAM'}
            </button>
            <button
              className="tracker-action-btn"
              onClick={resetCamera}
            >
              &#8634; RESET CAM
            </button>
          </div>

          <div className="tracker-status">
            <span className={`status-dot ${povMode ? 'pov' : 'live'}`} />
            <span className="status-text">{povMode ? 'POV MODE' : 'LIVE TRACKING'}</span>
          </div>
        </div>
      )}

      {!selected && (
        <div className="tracker-empty">
          Click a character to track
        </div>
      )}
    </div>
  )
}
