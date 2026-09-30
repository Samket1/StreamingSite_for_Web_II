import { useState, useEffect } from 'react'
import { Bell, Film, Search, Play, Home, Tv, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import MovieDetails from './MovieDetails';
import MovieCard from './MovieCard';
import SearchOverlay from './SearchOverlay';
import WatchlistOverlay from './WatchlistOverlay';
import './App.css'
import SignupLogin from './Signup_Login';

const TMDB_API_KEY = "969b4d22cf39488a0c72c57da978591a";

function App() {
  const [activeTab, setActiveTab] = useState("Home")
  const [movies, setMovies] = useState([])
  const [topRated, setTopRated] = useState([])
  const [action, setAction] = useState([])
  const [comedy, setComedy] = useState([])
  const [horror, setHorror] = useState([])
  
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isClosing, setIsClosing] = useState(false)
  const [isSearchAnimating, setIsSearchAnimating] = useState(false)
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistOpen, setWatchlistOpen] = useState(false)
  
  const [selectedMovie, setSelectedMovie] = useState(null)
  
  const [user, setUser] = useState(localStorage.getItem("savedUser") || null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState("login")

  const [showMoreTrending, setShowMoreTrending] = useState(false)
  const [showMoreTopRated, setShowMoreTopRated] = useState(false)
  const [showMoreAction, setShowMoreAction] = useState(false)
  const [showMoreComedy, setShowMoreComedy] = useState(false)
  const [showMoreHorror, setShowMoreHorror] = useState(false)

  const triggerSearchOpen = () => {
    setSearchOpen(true)
    setIsSearchAnimating(true)
    setTimeout(() => setIsSearchAnimating(false), 450)
  }

  const toggleWatchlist = (movie) => {
    if (!user) {
      alert("Login to add to watchlist!");
      setAuthModalOpen(true);
      return;
    }
    const clickedId = movie.id || movie.movieId;
    const isAlreadyIn = watchlist.some((m) => (m.id || m.movieId) == clickedId);

    if (isAlreadyIn) {
      fetch(`https://streamingsite-for-web-ii.onrender.com/api/watchlist/${user}/${clickedId}`, { method: "DELETE" });
      setWatchlist((prev) => prev.filter((m) => (m.id || m.movieId) != clickedId));
    } else {
      const dbMovie = {
        username: user,
        movieId: (movie.id || movie.movieId).toString(),
        title: movie.title || movie.name,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.posterUrl,
        rating: movie.vote_average ? (movie.vote_average * 10).toFixed(0).toString() : movie.rating
      };

      fetch("https://streamingsite-for-web-ii.onrender.com/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbMovie)
      });
      setWatchlist((prev) => [...prev, dbMovie]);
    }
  };

  const closeSearch = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSearchOpen(false)
      setIsClosing(false)
      setSearch("")
      setSearchResults([])
    }, 220)
  }

  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${search}`)
        .then(res => res.json())
        .then(data => {
            setSearchResults((data.results || []).filter(item => item.media_type !== 'person'))
        })
    } else {
      setSearchResults([])
    }
  }, [search])

  useEffect(() => {
    const type = activeTab === "Series" ? "tv" : "movie";

    fetch(`https://api.themoviedb.org/3/trending/${type}/day?api_key=${TMDB_API_KEY}`)
      .then(res => res.json()).then(data => setMovies(data.results || []))

    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${TMDB_API_KEY}`)
      .then(res => res.json()).then(data => setTopRated(data.results || []))

    const actionId = type === "tv" ? "10759" : "28";
    fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${actionId}`)
      .then(res => res.json()).then(data => setAction(data.results || []))

    fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=35`)
      .then(res => res.json()).then(data => setComedy(data.results || []))

    const horrorId = type === "tv" ? "9648" : "27"; 
    fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${horrorId}`)
      .then(res => res.json()).then(data => setHorror(data.results || []))

  }, [activeTab])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
        setWatchlistOpen(false);
        setSelectedMovie(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [search])

  useEffect(() => {
    if (user) {
      fetch(`https://streamingsite-for-web-ii.onrender.com/api/watchlist/${user}`)
        .then(res => res.json())
        .then(data => setWatchlist(Array.isArray(data) ? data : []));
    } else {
      setWatchlist([]);
    }
  }, [user])

  if (selectedMovie) {
    const movieId = selectedMovie.id || selectedMovie.movieId;
    const isSaved = watchlist.some((m) => (m.id || m.movieId) == movieId);
    return (
      <MovieDetails
        movie={selectedMovie}
        onBack={() => setSelectedMovie(null)}
        isWatched={isSaved}
        onToggleWatch={() => toggleWatchlist(selectedMovie)}
      />
    );
  }

  const renderSection = (title, items, isExpanded, toggleExpand, defaultLimit = 7) => {
    if (items.length === 0) return null;
    const itemsToShow = isExpanded ? items : items.slice(0, defaultLimit);
    
    return (
      <section className='movies-section' style={{ marginTop: '40px' }}>
        <h2 className='section-title'>{title}</h2>
        <div className='movies-grid'>
          {itemsToShow.map((movie) => {
            const movieId = movie.id || movie.movieId;
            const isInWatchlist = watchlist.some((m) => (m.id || m.movieId) == movieId);
            return (
              <MovieCard
                key={movieId}
                id={movieId}
                title={movie.title || movie.name}
                rating={movie.vote_average ? (movie.vote_average * 10).toFixed(0) : movie.rating}
                posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.posterUrl}
                isWatched={isInWatchlist}
                onToggleWatch={() => toggleWatchlist(movie)}
                onCardClick={() => setSelectedMovie(movie)}
              />
            );
          })}
        </div>
        {items.length > defaultLimit && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={toggleExpand}
              >
                  {isExpanded ? "Show Less" : "See More"} 
                  {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className='app-container'>
      <nav className='navbar'>
        <div className="nav-logo">
          <span className="logo-icon"><Film size={26} /></span>
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
            <div style={{ display: 'flex', gap: '10px' }}>
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
          filterMovies={searchResults}
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
          <button className={`sidebar-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => setActiveTab('Home')}>
            <Home size={22} /><span>Home</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'Movies' ? 'active' : ''}`} onClick={() => setActiveTab('Movies')}>
            <Film size={22} /><span>Movies</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'Series' ? 'active' : ''}`} onClick={() => setActiveTab('Series')}>
            <Tv size={22} /><span>Series</span>
          </button>
          <button className="sidebar-item" onClick={() => setWatchlistOpen(true)}>
            <Bookmark size={22} /><span>Watchlist({watchlist.length})</span>
          </button>
        </aside>

        <main className='main-content'>
          {movies.length > 0 && (
            <div
              className='hero-banner'
              style={{ backgroundImage: `linear-gradient(to top, #0b0c10 0%, rgba(11, 12, 16, 0.2) 100%), url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path || movies[0].poster_path})` }}
            >
              <div className='hero-content'>
                <span className='hero-badge'>Featured</span>
                <h1 className="hero-title">{movies[0].title || movies[0].name}</h1>
                <p className="hero-desc">{movies[0].overview}</p>
                <div className='hero-buttons'>
                  <button className='btn-primary' onClick={() => setSelectedMovie(movies[0])}>
                    <Play size={18} fill="currentColor" /> Play Now
                  </button>
                  <button className={`btn-secondary ${watchlist.some((m) => (m.id || m.movieId) == (movies[0]?.id || movies[0]?.movieId)) ? 'in-watchlist' : ''}`}
                    onClick={() => toggleWatchlist(movies[0])}>
                    <Bookmark size={18} fill={watchlist.some((m) => (m.id || m.movieId) == (movies[0]?.id || movies[0]?.movieId)) ? "currentColor" : "none"} />
                    <span>{watchlist.some((m) => (m.id || m.movieId) == (movies[0]?.id || movies[0]?.movieId)) ? " In Watchlist" : " Watchlist"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {renderSection("Trending Now", movies, showMoreTrending, () => setShowMoreTrending(!showMoreTrending), 7)}
          {renderSection("Critically Acclaimed", topRated, showMoreTopRated, () => setShowMoreTopRated(!showMoreTopRated), 7)}
          {renderSection("Epic Action", action, showMoreAction, () => setShowMoreAction(!showMoreAction), 7)}
          {renderSection("Laugh Out Loud", comedy, showMoreComedy, () => setShowMoreComedy(!showMoreComedy), 7)}
          {renderSection(activeTab === "Series" ? "Unsolved Mysteries" : "Terrifying Horror", horror, showMoreHorror, () => setShowMoreHorror(!showMoreHorror), 7)}

        </main>
      </div>
    </div>
  )
}

export default App;




