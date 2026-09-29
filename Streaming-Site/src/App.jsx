import { useState, useEffect } from 'react'
import { Bell, Film, Search, Play, Home, Tv, Bookmark } from 'lucide-react'
import MovieDetails from './MovieDetails';
import MovieCard from './MovieCard';
import SearchOverlay from './SearchOverlay';
import WatchlistOverlay from './WatchlistOverlay';
import './App.css'
import SignupLogin from './Signup_Login';

function App() {
  const [movies, setMovies] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isClosing, setIsClosing] = useState(false)
  const [isSearchAnimating, setIsSearchAnimating] = useState(false)
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistOpen, setWatchlistOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const [user, setUser] = useState(localStorage.getItem("savedUser") || null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState("login")

  const triggerSearchOpen = () => {
    setSearchOpen(true)
    setIsSearchAnimating(true)
    setTimeout(() => {
      setIsSearchAnimating(false)
    }, 450)
  }

  const toggleWatchlist = (movie) => {
    if (!user) {
      alert("Login to add to watchlist!");
      setAuthModalOpen(true);
      return;
    }
    const clickedId = movie.id || movie.movieId;
    const isAlreadyIn = watchlist.some((m) => (m.id || m.movieId) === clickedId);

    if (isAlreadyIn) {
      fetch(`http://localhost:5000/api/watchlist/${user}/${clickedId}`, {
        method: "DELETE"
      });
      setWatchlist((prev) => prev.filter((m) => (m.id || m.movieId) !== clickedId));
    } else {
      const dbMovie = {
        username: user,
        movieId: movie.id || movie.movieId,
        title: movie.title,
        posterUrl: movie.image || movie.posterUrl,
        rating: movie.rt_score || movie.rating
      };

      fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbMovie)
      });
      setWatchlist((prev) => [...prev, dbMovie]);
    }
  };

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
        setWatchlistOpen(false);
        setSelectedMovie(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [search])

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/watchlist/${user}`)
        .then(res => res.json())
        .then(data => {
          setWatchlist(data);
        });
    } else {
      setWatchlist([]);
    }
  }, [user])

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
      <nav className='navbar'>
        <div className="nav-logo">
          <span className="logo-icon">
            <Film size={26} />
          </span>
          <span className="logo-text">
            <span className="desktop-logo">Stream<span className="logo-highlight">Dopamine</span></span>
            <span className="mobile-logo">S<span className="logo-highlight">D</span></span>
          </span>
        </div>

        <div className='nav-profile'>
          <button className={`search-icon-btn ${isSearchAnimating ? "animating" : ""}`} onClick={triggerSearchOpen} title="Search">
            <Search size={20} />
          </button>

          {user ? (
            <div style={{display: 'flex', gap: '10px'}}>
              <button className='login-btn logout' onClick={() => { setAuthModalMode("update"); setAuthModalOpen(true); }}>Change Password</button>
              <button className='login-btn logout' onClick={() => { setUser(null); localStorage.removeItem("savedUser"); setWatchlist([]); }}>Logout ({user})</button>
            </div>
          ) : (
            <button className='login-btn' onClick={() => { setAuthModalMode("login"); setAuthModalOpen(true); }}>Sign In</button>
          )}
        </div>
      </nav>
      {authModalOpen && (
        <SignupLogin setAuthModalOpen={setAuthModalOpen} setUser={setUser} user={user} initialMode={authModalMode} />
      )}

      {searchOpen && (
        <SearchOverlay
          search={search}
          setSearch={setSearch}
          isClosing={isClosing}
          closeSearch={closeSearch}
          filterMovies={filterMovies}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      {watchlistOpen && (
        <WatchlistOverlay
          watchlist={watchlist}
          setWatchlistOpen={setWatchlistOpen}
          toggleWatchlist={toggleWatchlist}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      <div className='app-body'>
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
          <button className="sidebar-item" onClick={() => setWatchlistOpen(true)}>
            <Bookmark size={22} />
            <span>Watchlist({watchlist.length})</span>
          </button>
        </aside>

        <main className='main-content'>
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
                  <button className={`btn-secondary ${watchlist.some((m) => (m.id || m.movieId) === (movies[0]?.id || movies[0]?.movieId)) ? 'in-watchlist' : ''}`}
                    onClick={() => toggleWatchlist(movies[0])}>
                    <Bookmark size={18} fill={watchlist.some((m) => (m.id || m.movieId) === (movies[0]?.id || movies[0]?.movieId)) ? "currentColor" : "none"} />
                    <span>{watchlist.some((m) => (m.id || m.movieId) === (movies[0]?.id || movies[0]?.movieId)) ? " In Watchlist" : " Watchlist"}</span>
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
      </div>
    </div>
  )
}

export default App;






