import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

    < div className='app-container' >
      {/* ------------------------------------------------------------------------------------------------------ */}
      {/* TOP PART */}
      <nav className='navbar'>
        {/* the Stream Dopamine Text */}
        <div className="nav-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Stream<span className="logo-highlight">Dopamine</span></span>
        </div>
        {/* the search bar */}
        <div className='nav-search'>
          <input type="text" placeholder='Search movies,series...' className='search-input' />
        </div>
        {/* profile and Notif */}
        <div className='nav-profile'>
          <button className='nav-btn'>Notification</button>
          <div className='avatar'>U</div>
        </div>
      </nav>

      {/* BODY PART */}
      <div className='app-body'>
        {/* left part */}
        {/* ------------------------------------------------------------------------------------------------------ */}

        <aside className="sidebar">
          <button className="sidebar-item active"> Home</button>
          <button className="sidebar-item"> Movies</button>
          <button className="sidebar-item"> Series</button>
          <button className="sidebar-item"> Watchlist</button>
        </aside>
        {/* main part */}
        {/* ------------------------------------------------------------------------------------------------------ */}
        <main className='main-content'>
          <div className='hero-banner'>
            <div className='hero-content'>
              <span className='hero-badge'>New Release</span>
              <h1 className="hero-title">The Matrix Resurrections</h1>
              <p className="hero-desc">Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Mr. Anderson will have to choose to follow the white rabbit once more.</p>
              <div className='hero-buttons'>
                <button className='btn-primary'>▶ Play Now</button>
                <button className="btn-secondary">＋ Watchlist</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* ------------------------------------------------------------------------------------------------------ */}


    </div >
  )
}

export default App
