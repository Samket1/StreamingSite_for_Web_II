import { useState } from 'react'
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
        {/* the whole container of the main part */}
        <main className='main-content'>
          {/* the whole container of the hero part*/}
          <div className='hero-banner'>
            {/* the container for the movie and the desc */}
            <div className='hero-content'>
              {/* the red thingy that says new Release */}
              <span className='hero-badge'>New Release</span>
              <h1 className="hero-title">The Matrix Resurrections</h1>
              <p className="hero-desc">Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Mr. Anderson will have to choose to follow the white rabbit once more.</p>
              <div className='hero-buttons'>
                <button className='btn-primary'>▶ Play Now</button>
                <button className="btn-secondary">＋ Watchlist</button>
              </div>
            </div>
          </div>
          <section className='movies-section'>
            <h2 className='section-title'>Trending Now</h2>
            <div className='movies-grid'>
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />
              <MovieCard title="The Matrix" rating="6.5" posterUrl="https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" />

            </div>
          </section>
        </main>
      </div>
      {/* ------------------------------------------------------------------------------------------------------ */}


    </div >
  )
}

export default App
