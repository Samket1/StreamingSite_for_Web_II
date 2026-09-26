import { useState, useEffect } from 'react'

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function MovieCard({ title, rating, posterUrl }) {
  return (
    <div className='movie-card'>
      <img src={posterUrl} alt={title} className='movie-poster' />
      <div className='movie-info'>
        <h3>{title}</h3>
        <p>⭐ {rating}</p>
      </div>
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then(res => res.json())
      .then(data => { setMovies(data) })
  }, [])

  return (
    <div className='app-container'>
      {/*     ------------------------------------------------------------------------------------------------------ */}
      {/* TOP PART */}
      <nav className='navbar'>
        {/* the Stream Dopamine Text */}
        <div className="nav-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">
            <span className="desktop-logo">Stream<span className="logo-highlight">Dopamine</span></span>
            <span className="mobile-logo">S<span className="logo-highlight">D</span></span>
          </span>
        </div>
        {/* the search bar */}
        <div className='nav-search'>
          <button className="search-icon-btn">🔍</button>
          <input type="text" placeholder="Search movies, series..." className="search-input desktop-search" />
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
          {/* the whole container of the hero part*/}
          {movies.length > 0 && (
            <div
              className='hero-banner'
              style={{ backgroundImage: `linear-gradient(to top, #0b0c10 0%, rgba(11, 12, 16, 0.2) 100%), url(${movies[0].movie_banner})` }}
            >
              <div className='hero-content'>
                <span className='hero-badge'>Featured</span>
                <h1 className="hero-title">{movies[0].title}</h1>
                <p className="hero-desc">{movies[0].description}</p>
                <div className='hero-buttons'>
                  <button className='btn-primary'>▶ Play Now</button>
                  <button className="btn-secondary">＋ Watchlist</button>
                </div>
              </div>
            </div>
          )}

          <section className='movies-section'>
            <h2 className='section-title'>Trending Now</h2>
            <div className='movies-grid'>
              {movies.map((movie) => (
                <MovieCard key={movie.id} title={movie.title} rating={movie.rt_score} posterUrl={movie.image} />
              ))}
            </div>
          </section>
        </main>
      </div>
      {/* ------------------------------------------------------------------------------------------------------ */}
    </div>
  )
}

export default App
