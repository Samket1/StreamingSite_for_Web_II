import { useState, useEffect } from 'react'
// import { useParams, Link, Routes, Route, useNavigate } from 'react-router-dom'
import { 
  Bell,
  Film, 
  Search, 
  X, 
  Play, 
  Plus, 
  Star, 
  Eye, 
  EyeOff, 
  Home, 
  Tv, 
  Bookmark 
} from 'lucide-react'
import './App.css'

function MovieCard({ id, title, rating, posterUrl, isWatched, onToggleWatch }) {
  return (
    <div className='movie-card'>
      <button 
        className={`card-eye-btn ${isWatched ? 'watched' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatch(id);
        }}
        title={isWatched ? "Mark as unwatched" : "Mark as watched"}
      >
        {isWatched ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>

      <img src={posterUrl} alt={title} className='movie-poster' />
      <div className='movie-info'>
        <h3>{title}</h3>
        <p className='rating-container'>
          <Star size={14} fill="#f5c518" color="#f5c518" /> 
          <span>{rating}</span>
        </p>
      </div>
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState([])
    const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isClosing, setIsClosing] = useState(false)
  const [isSearchAnimating, setIsSearchAnimating] = useState(false)

  const triggerSearchOpen = () => {
    // Open the search page immediately without waiting!
    setSearchOpen(true)
    setIsSearchAnimating(true)
    setTimeout(() => {
      setIsSearchAnimating(false)
    }, 450)
  }
  
  // Track watched movie IDs: { [movieId]: true/false }
  const [watchedMovies, setWatchedMovies] = useState({})

  const toggleWatch = (movieId) => {
    setWatchedMovies((prev) => ({
      ...prev,
      [movieId]: !prev[movieId]
    }))
  }

  const filterMovies = movies.filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase()))
  
  const closeSearch = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSearchOpen(false)
      setIsClosing(false)
    }, 220)
  }

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then(res => res.json())
      .then(data => { setMovies(data) })
  }, [])
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [search])

  return (
    <div className='app-container'>
      {/*     ------------------------------------------------------------------------------------------------------ */}
      {/* TOP PART */}
      <nav className='navbar'>
        {/* the Stream Dopamine Text */}
        <div className="nav-logo">
          <span className="logo-icon">
            <Film size={26} />
          </span>
          <span className="logo-text">
            <span className="desktop-logo">Stream<span className="logo-highlight">Dopamine</span></span>
            <span className="mobile-logo">S<span className="logo-highlight">D</span></span>
          </span>
        </div>

        {/* the search button */}
        {/* Actions & Profile */}
        <div className='nav-profile'>
          <button className={`search-icon-btn ${isSearchAnimating ? "animating" : ""}`} onClick={triggerSearchOpen} title="Search">
            <Search size={20} />
          </button>
          <button className='nav-btn notif-btn' title="Notifications">
            <Bell size={20} />
          </button>
          <div className='avatar'>U</div>
        </div>

      </nav>

      {searchOpen && (
        <div className={`search-overlay ${isClosing ? 'closing' : ''}`}>
          <button className='close-search-btn' onClick={() => closeSearch()}>
            <X size={22} />
          </button>
          <h1 className='search-overlay-title'>Find your next favorite story</h1>
          <div className='search-overlay-input-container'> 
            <span className='search-overlay-icon'>
              <Search size={20} />
            </span>
            <input 
              type='text' 
              placeholder='Search movies, series...' 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className='search-overlay-input' 
            />
          </div>
          <div className='search-results-grid'>
            {filterMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title}
                rating={movie.rt_score}
                posterUrl={movie.image}
                isWatched={!!watchedMovies[movie.id]}
                onToggleWatch={toggleWatch}
              />
            ))}
          </div>
        </div>
      )}

      {/* BODY PART */}
      <div className='app-body'>
        {/* left part */}
        {/* ------------------------------------------------------------------------------------------------------ */}
        <aside className="sidebar">
          <button className="sidebar-item active">
            <Home size={22} />
            <span>Home</span>
          </button>
          <button className="sidebar-item">
            <Film size={22} />
            <span>Movies</span>
          </button>
          <button className="sidebar-item">
            <Tv size={22} />
            <span>Series</span>
          </button>
          <button className="sidebar-item">
            <Bookmark size={22} />
            <span>Watchlist</span>
          </button>
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
                  <button className='btn-primary'>
                    <Play size={18} fill="currentColor" /> Play Now
                  </button>
                  <button className="btn-secondary">
                    <Plus size={18} /> Watchlist
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className='movies-section'>
            <h2 className='section-title'>Trending Now</h2>
            <div className='movies-grid'>
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  id={movie.id}
                  title={movie.title} 
                  rating={movie.rt_score} 
                  posterUrl={movie.image} 
                  isWatched={!!watchedMovies[movie.id]}
                  onToggleWatch={toggleWatch}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
      {/* ------------------------------------------------------------------------------------------------------ */}
    </div>
  )
}

export default App;
