import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (<div className='app-container'>
    <nav className='navbar'>

      {/* the Stream Dopamine Text */}
      <div className="nav-logo">
        <span className="logo-icon">🎬</span>
        <span className="logo-text">Stream<span className="logo-highlight">Dopamine</span></span>

        {/* the search bar */}
        <div className='nav-search'>
          <input type="text" placeholder='Search movies,series...' className='search-input' />
        </div>

        {/* profile and Notif */}
        <div className='nav-profile'>
          <button className='nav-btn'>Notification</button>
          <div className='avatar'>U</div>
        </div>

      </div>

    </nav>
  </div>
  )
}

export default App
