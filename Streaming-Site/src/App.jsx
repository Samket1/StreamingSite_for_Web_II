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
      {/* ------------------------------------------------------------------------------------------------------ */}
      {/* BODY PART */}
      <div className='app-body'>
        {/* left part */}
        <aside className="sidebar">
          <button className="sidebar-item active"> Home</button>
          <button className="sidebar-item"> Movies</button>
          <button className="sidebar-item"> Series</button>
          <button className="sidebar-item"> Watchlist</button>
        </aside>
        {/* main part */}
        <main className='main-content'>
          <h2>Hero Banner and Movie Grid coming soon...</h2>
        </main>
      </div>
      {/* ------------------------------------------------------------------------------------------------------ */}


    </div >
  )
}

export default App
