import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (<div className='app-container'>
    <nav className='navbar'>
      <div className="nav-logo">
        <span className="logo-icon">🎬</span>
        <span className="logo-text">Stream<span className="logo-highlight">Git</span></span>
      </div>

    </nav>
  </div>
  )
}

export default App
