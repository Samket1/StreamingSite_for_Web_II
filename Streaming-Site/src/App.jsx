import { useState, useEffect } from 'react'
// import { useParams, Link, Routes, Route, useNavigate } from 'react-router-dom'
import { Bell, Film, Search, X, Play, Plus, Eye, EyeOff, Star, Home, Tv, Bookmark } from 'lucide-react'
import MovieDetails from './MovieDetails';
import './App.css'

function MovieCard({ id, title, rating, posterUrl, isWatched, onToggleWatch, onCardClick }) {
  return (
    <div className={`movie-card ${isWatched ? 'is-in-watchlist' : ''}`} onClick={onCardClick} style={{ cursor: "pointer" }}>
      <button
        className={`card-eye-btn ${isWatched ? 'watched' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatch();
        }}
        title={isWatched ? "Mark as unwatched" : "Mark as watched"}
      >
        <Bookmark size={18} fill={isWatched ? "currentColor" : "none"} />
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
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistOpen, setWachlistOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState("login")
  const [authForm, setAuthForm] = useState({ username: "", password: "", newPassword: "" });
  const [authMessage, setAuthMessage] = useState("");

  const triggerSearchOpen = () => {
    // Open the search page immediately without waiting!
    setSearchOpen(true)
    setIsSearchAnimating(true)
    setTimeout(() => {
      setIsSearchAnimating(false)
    }, 450)
  }
  const toggleWatchlist = (movie) => {
    const clickedId = movie.id || movie.movieId;
    const isAlreadyIn = watchlist.some((m) => (m.id || m.movieId) === clickedId);

    if (isAlreadyIn) {
      fetch(`https://streamingsite-for-web-ii.onrender.com/api/watchlist/${clickedId}`, {
        method: "DELETE"
      });
      setWatchlist((prev) => prev.filter((m) => (m.id || m.movieId) !== clickedId));
    } else {
      const dbMovie = {
        movieId: movie.id || movie.movieId,
        title: movie.title,
        posterUrl: movie.image || movie.posterUrl,
        rating: movie.rt_score || movie.rating
      };

      fetch("https://streamingsite-for-web-ii.onrender.com/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbMovie)
      });
      setWatchlist((prev) => [...prev, dbMovie]);
    }
  };


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
        setWachlistOpen(false);
        setSelectedMovie(null)

      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [search])
  const isSaved = watchlist.some((m) => (m.id || m.movieId) === (movies[0]?.id || movies[0]?.movieId))
  useEffect(() => {
    fetch("https://streamingsite-for-web-ii.onrender.com/api/watchlist")
      .then(res => res.json())
      .then(data => {
        setWatchlist(data);
      });
  }, [])
  if (selectedMovie) {
    const movieId = selectedMovie.id || selectedMovie.movieId;
    const isSaved = watchlist.some((m) => (m.id || m.movieId) === movieId);
    return (
      <MovieDetails
        movie={selectedMovie}
        onBack={() => setSelectedMovie(null)}
        isWatched={isSaved}
        onToggleWatch={() => toggleWatchlist(selectedMovie)}
      />
    );
  }
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
            {filterMovies.map((movie) => {
              const movieId = movie.id || movie.movieId;
              const isInWatchlist = watchlist.some((m) => (m.id || m.movieId) === movieId);
              return (
                <MovieCard
                  key={movieId}
                  id={movieId}
                  title={movie.title}
                  rating={movie.rt_score || movie.rating}
                  posterUrl={movie.image || movie.posterUrl}
                  isWatched={isInWatchlist}
                  onToggleWatch={() => toggleWatchlist(movie)}
                  onCardClick={() => setSelectedMovie(movie)}
                />
              );
            })}
          </div>
        </div>
      )}
      {watchlistOpen && (
        <div className='search-overlay'>
          <button className='close-search-btn' onClick={() => setWachlistOpen(false)}><X size={22} /></button>
          <h1 className='search-overlay-title'>Your Watchlist has {watchlist.length} movies/shows  </h1>
          {watchlist.length === 0 ? (
            <p className='no-results'>Your watchlist is empty. Add some movies/series!</p>
          ) : (
            <div className='search-results-grid'>
              {watchlist.map((movie) => {
                const movieId = movie.movieId || movie.id;
                return (
                  <MovieCard
                    key={movieId}
                    id={movieId}
                    title={movie.title}
                    rating={movie.rating || movie.rt_score}
                    posterUrl={movie.posterUrl || movie.image}
                    isWatched={true}
                    onToggleWatch={() => toggleWatchlist(movie)}
                    onCardClick={() => setSelectedMovie(movie)}
                  />
                );
              })}</div>
          )}
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
          <button className="sidebar-item" onClick={() => setWachlistOpen(true)}>
            <Bookmark size={22} />
            <span>Watchlist({watchlist.length})</span>
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
                  <button className={`btn-secondary ${isSaved ? 'in-watchlist' : ''}`}
                    onClick={() => toggleWatchlist(movies[0])}>
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    <span>{isSaved ? " In Watchlist" : " Watchlist"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className='movies-section'>
            <h2 className='section-title'>Trending Now</h2>
            <div className='movies-grid'>
              {movies.map((movie) => {
                const movieId = movie.id || movie.movieId;
                const isInWatchlist = watchlist.some((m) => (m.id || m.movieId) === movieId);
                return (
                  <MovieCard
                    key={movieId}
                    id={movieId}
                    title={movie.title}
                    rating={movie.rt_score || movie.rating}
                    posterUrl={movie.image || movie.posterUrl}
                    isWatched={isInWatchlist}
                    onToggleWatch={() => toggleWatchlist(movie)}
                    onCardClick={() => setSelectedMovie(movie)}
                  />
                );
              })}
            </div>
          </section>
        </main>
      </div >
      {/* ------------------------------------------------------------------------------------------------------ */}
    </div >
  )
}

export default App;
