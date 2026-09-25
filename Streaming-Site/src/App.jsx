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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const closeSearch = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsClosing(false);
    }, 250); // wait for CSS animation to finish before removing from DOM
  };


  // Listen for the Escape key to close the search overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    // Attach the event listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to prevent memory leaks
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then(res => res.json())
      .then(data => { setMovies(data) })
  }, []
  )
  return (

    < div className='app-container' >
      {/*     ------------------------------------------------------------------------------------------------------ */}
      {/* TOP PART */}
      <nav className='navbar'>
        {/* the Stream Dopamine Text */}
        <div className="nav-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Stream<span className="logo-highlight">Dopamine</span></span>
        </div>
        {/* the search bar */}
        <div className='nav-search'>
          <button className="search-icon-btn" onClick={() => setIsSearchOpen(true)}>🔍</button>
          <input type="text" placeholder="Search movies, series..." className="search-input desktop-search" onClick={() => setIsSearchOpen(true)} />
        </div>
        {/* profile and Notif */}
        <div className='nav-profile'>
          <button className='nav-btn'>Notification</button>
          <div className='avatar'>U</div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className={`search-overlay ${isClosing ? 'closing' : ''}`}>
          <button className="close-search-btn" onClick={closeSearch}>✕</button>
          <h1 className="search-overlay-title">Find your next favorite story</h1>
          <div className="search-overlay-input-container">
            <span className="search-overlay-icon">🔍</span>
            <input autoFocus type="text" placeholder="Search movies, TV shows & people..." className="search-overlay-input" />
          </div>
          <div className="search-overlay-tags">
            <button>Ghibli</button>
            <button>Action</button>
            <button>Fantasy</button>
            <button>Romance</button>
          </div>
        </div>
      )}

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
        {/* the whole container of the main part */}
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


    </div >
  )
}

export default App
