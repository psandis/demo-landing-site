import { useState } from 'react'
import TrackerHUD from './TrackerHUD'
import './Overlay.css'

export default function Overlay() {
  const [exploring, setExploring] = useState(false)
  const [trackerOpen, setTrackerOpen] = useState(true)

  return (
    <>
      {/* Intro screen */}
      <div className={`intro ${exploring ? 'intro-hidden' : ''}`}>
        <div className="intro-content">
          <div className="intro-badge">3D EXPERIENCE</div>
          <h1 className="intro-title">
            The
            <span className="intro-accent"> Landscape</span>
          </h1>
          <p className="intro-subtitle">
            A living world. Five explorers. One terrain.
            <br />Watch them navigate, or track their journey.
          </p>
          <button
            className="intro-enter"
            onClick={() => setExploring(true)}
          >
            <span className="enter-icon">&#9655;</span>
            Enter World
          </button>
        </div>
        <div className="intro-footer">
          <p>&copy; 2026 Petri Sandholm. All rights reserved.</p>
        </div>
      </div>

      {/* Exploring mode */}
      {exploring && (
        <>
          {/* Top bar */}
          <div className="topbar">
            <span className="topbar-logo">LANDSCAPE</span>
            <div className="topbar-center">
              <span className="topbar-dot live" />
              <span className="topbar-live">LIVE</span>
            </div>
            <div className="topbar-right">
              <button
                className={`topbar-btn ${trackerOpen ? 'active' : ''}`}
                onClick={() => setTrackerOpen(!trackerOpen)}
              >
                &#9678; Tracker
              </button>
              <button
                className="topbar-btn"
                onClick={() => setExploring(false)}
              >
                Exit
              </button>
            </div>
          </div>

          {/* Tracker HUD */}
          {trackerOpen && <TrackerHUD onClose={() => setTrackerOpen(false)} />}

          {/* Bottom copyright */}
          <div className="bottombar">
            <p>&copy; 2026 Petri Sandholm &middot; 3D Landscape Experience</p>
          </div>
        </>
      )}
    </>
  )
}
