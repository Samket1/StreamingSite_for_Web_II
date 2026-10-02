import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Film, Search, Play, Home, Tv, Bookmark, ChevronDown, ChevronUp, Loader, Sun, Moon } from 'lucide-react'
import MovieDetails from './MovieDetails';
import MovieCard from './MovieCard';
import SearchOverlay from './SearchOverlay';
import WatchlistOverlay from './WatchlistOverlay';
import './App.css'
import SignupLogin from './Signup_Login';

const TMDB_API_KEY = "969b4d22cf39488a0c72c57da978591a";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme])
  
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
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSearchAnimating, setIsSearchAnimating] = useState(false)
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistOpen, setWatchlistOpen] = useState(false)
  const [isWatchlistClosing, setIsWatchlistClosing] = useState(false)

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isMovieLoading, setIsMovieLoading] = useState(false)

  const [user, setUser] = useState(localStorage.getItem("savedUser") || null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState("login")

  const [showMoreTrending, setShowMoreTrending] = useState(false)
  const [showMoreTopRated, setShowMoreTopRated] = useState(false)
  const [showMoreAction, setShowMoreAction] = useState(false)
  const [showMoreComedy, setShowMoreComedy] = useState(false)
  const [showMoreHorror, setShowMoreHorror] = useState(false)
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false)

  // URL Route Parsing for /movies/:id/detail and /movies/:id/watch
  const movieRouteMatch = location.pathname.match(/\/movies\/([^\/]+)\/(detail|watch)/);
  const routeMovieId = movieRouteMatch ? movieRouteMatch[1] : null;
  const isWatchMode = movieRouteMatch ? movieRouteMatch[2] === 'watch' : false;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown-container")) {
        setSettingsDropdownOpen(false)
      }
    }
    if (settingsDropdownOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [settingsDropdownOpen])

  // Synchronize Tab & Overlays with URL Location
  useEffect(() => {
    if (location.pathname === '/movies') {
      setActiveTab('Movies');
      setSearchOpen(false);
      setWatchlistOpen(false);
    } else if (location.pathname === '/series') {
      setActiveTab('Series');
      setSearchOpen(false);
      setWatchlistOpen(false);
    } else if (location.pathname === '/home' || location.pathname === '/') {
      setActiveTab('Home');
      setSearchOpen(false);
      setWatchlistOpen(false);
    } else if (location.pathname === '/watchlist') {
      setWatchlistOpen(true);
      setSearchOpen(false);
    } else if (location.pathname === '/search') {
      setSearchOpen(true);
      setWatchlistOpen(false);
    }
  }, [location.pathname]);

  // Fetch movie data if direct URL visited or page refreshed on /movies/:id/(detail|watch)
  useEffect(() => {
    if (routeMovieId) {
      if (selectedMovie && ((selectedMovie.id == routeMovieId) || (selectedMovie.movieId == routeMovieId))) {
        return;
      }
      const allLoaded = [...movies, ...topRated, ...action, ...comedy, ...horror, ...watchlist];
      const found = allLoaded.find(m => (m.id || m.movieId) == routeMovieId);
      if (found) {
        setSelectedMovie(found);
      } else {
        setIsMovieLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${routeMovieId}?api_key=${TMDB_API_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.id) {
              setSelectedMovie(data);
              setIsMovieLoading(false);
            } else {
              fetch(`https://api.themoviedb.org/3/tv/${routeMovieId}?api_key=${TMDB_API_KEY}`)
                .then(res => res.json())
                .then(tvData => {
                  setSelectedMovie(tvData && tvData.id ? tvData : null);
                  setIsMovieLoading(false);
                })
                .catch(() => setIsMovieLoading(false));
            }
          })
          .catch(() => setIsMovieLoading(false));
      }
    } else {
      setSelectedMovie(null);
    }
  }, [routeMovieId, movies, topRated, action, comedy, horror, watchlist]);

  const movieLimit = isMobile ? 6 : 7

  const triggerSearchOpen = () => {
    setIsSearchAnimating(true);
    setTimeout(() => setIsSearchAnimating(false), 450);
    navigate('/search');
  }

  const closeSearch = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSearch("");
      setSearchResults([]);
      navigate(activeTab === 'Movies' ? '/movies' : (activeTab === 'Series' ? '/series' : '/home'));
    }, 220);
  }

  const closeWatchlist = () => {
    setWatchlistOpen(false);
    navigate(activeTab === 'Movies' ? '/movies' : (activeTab === 'Series' ? '/series' : '/home'));
  }

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    const id = movie.id || movie.movieId;
    navigate(`/movies/${id}/detail`);
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
        movieId: clickedId,
        title: movie.title || movie.name,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : (movie.posterUrl || movie.image),
        rating: movie.vote_average ? (movie.vote_average * 10).toFixed(0) : (movie.rating || "N/A"),
      };

      fetch("https://streamingsite-for-web-ii.onrender.com/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbMovie),
      }).then(() => {
        setWatchlist((prev) => [...prev, dbMovie]);
      });
    }
  };

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const allLocal = [...movies, ...topRated, ...action, ...comedy, ...horror];
    const localMatches = allLocal.filter(m => 
      (m.title || m.name || '').toLowerCase().includes(trimmed.toLowerCase())
    );
    if (localMatches.length > 0) {
      setSearchResults(localMatches);
    }

    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(trimmed)}`)
      .then(res => res.json())
      .then(data => {
        const tmdbResults = (data.results || []).filter(item => item.media_type !== 'person');
        if (tmdbResults.length > 0) {
          setSearchResults(tmdbResults);
        } else if (localMatches.length === 0) {
          setSearchResults([]);
        }
      })
      .catch(err => {
        console.error("Search fetch error:", err);
      });
  }, [search, movies, topRated, action, comedy, horror])

  useEffect(() => {
    const type = activeTab === "Series" ? "tv" : "movie";
    setIsPageLoading(true);

    const actionId = type === "tv" ? "10759" : "28";
    const horrorId = type === "tv" ? "9648" : "27";

    Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/${type}/day?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${actionId}`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=35`).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${horrorId}`).then(res => res.json())
    ]).then(([trending, top, act, com, hor]) => {
      setMovies(trending.results || []);
      setTopRated(top.results || []);
      setAction(act.results || []);
      setComedy(com.results || []);
      setHorror(hor.results || []);
      setIsPageLoading(false);
    });

  }, [activeTab])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (searchOpen) closeSearch();
        if (watchlistOpen) closeWatchlist();
        if (routeMovieId) navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [search, searchOpen, watchlistOpen, routeMovieId])

  useEffect(() => {
    if (user) {
      fetch(`https://streamingsite-for-web-ii.onrender.com/api/watchlist/${user}`)
        .then(res => res.json())
        .then(data => setWatchlist(Array.isArray(data) ? data : []));
    } else {
      setWatchlist([]);
    }
  }, [user])

  // If viewing a movie via URL: /movies/:id/detail or /movies/:id/watch
  if (routeMovieId) {
    if (isMovieLoading || !selectedMovie) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px', backgroundColor: '#0b0c10' }}>
          <Loader size={48} color="#e50914" className="spinner" />
          <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>Loading Movie...</h2>
        </div>
      );
    }
    const movieId = selectedMovie.id || selectedMovie.movieId;
    const isSaved = watchlist.some((m) => (m.id || m.movieId) == movieId);
    return (
      <MovieDetails
        movie={selectedMovie}
        onBack={() => navigate(-1)}
        isWatched={isSaved}
        onToggleWatch={() => toggleWatchlist(selectedMovie)}
        initialPlaying={isWatchMode}
        onPlayToggle={(playing) => {
          if (playing) {
            navigate(`/movies/${movieIdw}/watch`);
          } else {
            navigate(`/movies/${movieId}/detail`);
          }
        }}
      />
    );
  }

  const renderSection = (title, items, isExpanded, toggleExpand, defaultLimit = movieLimit) => {
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
                onCardClick={() => openMovieDetails(movie)}
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
        <div className="nav-logo" onClick={() => { setActiveTab('Home'); navigate('/home'); }} style={{ cursor: 'pointer' }}>
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

          {/* Light / Dark Mode Toggle */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} className="theme-sun-icon" />}
          </button>

          {user ? (
            <div className="user-dropdown-container" style={{ position: 'relative' }}>
              <button 
                className='login-btn logout' 
                onClick={() => setSettingsDropdownOpen(prev => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px' }}
              >
                <span>{user}</span>
                <ChevronDown size={16} style={{ transform: settingsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {settingsDropdownOpen && (
                <div 
                  className="user-settings-dropdown"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    backgroundColor: theme === 'light' ? '#ffffff' : '#161922',
                    border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '6px',
                    minWidth: '180px',
                    boxShadow: theme === 'light' ? '0 12px 30px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <button 
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: theme === 'light' ? '#0f172a' : '#e2e8f0',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => { 
                      setSettingsDropdownOpen(false);
                      setAuthModalMode("update"); 
                      setAuthModalOpen(true); 
                    }}
                  >
                    Change Password
                  </button>

                  <div style={{ height: '1px', backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)', margin: '2px 0' }} />

                  <button 
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4d4d',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 77, 77, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => { 
                      setSettingsDropdownOpen(false);
                      setUser(null); 
                      localStorage.removeItem("savedUser"); 
                      setWatchlist([]); 
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
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
          filterMovies={search.trim() === "" ? movies : searchResults}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          setSelectedMovie={openMovieDetails}
        />
      )}

      {watchlistOpen && (
        <WatchlistOverlay
          watchlist={watchlist}
          setWatchlistOpen={closeWatchlist}
          toggleWatchlist={toggleWatchlist}
          setSelectedMovie={openMovieDetails}
          isClosing={isWatchlistClosing}
        />
      )}

      <div className='app-body'>
        <aside className="sidebar">
          <button className={`sidebar-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => { setActiveTab('Home'); navigate('/home'); }}>
            <Home size={22} /><span>Home</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'Movies' ? 'active' : ''}`} onClick={() => { setActiveTab('Movies'); navigate('/movies'); }}>
            <Film size={22} /><span>Movies</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'Series' ? 'active' : ''}`} onClick={() => { setActiveTab('Series'); navigate('/series'); }}>
            <Tv size={22} /><span>Series</span>
          </button>
          <button className="sidebar-item" onClick={() => { setWatchlistOpen(true); navigate('/watchlist'); }}>
            <Bookmark size={22} /><span>Watchlist({watchlist.length})</span>
          </button>
        </aside>

        <main className='main-content'>
          {isPageLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
              <Loader size={48} color="#e50914" className="spinner" />
              <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>Loading {activeTab}...</h2>
            </div>
          ) : (
            <>
              {movies.length > 0 && (
                <div
                  className='hero-banner'
                  style={{ backgroundImage: `linear-gradient(to top, ${theme === 'light' ? 'rgba(248, 250, 252, 0.95)' : '#0b0c10'} 0%, ${theme === 'light' ? 'rgba(248, 250, 252, 0.4)' : 'rgba(11, 12, 16, 0.2)'} 60%, transparent 100%), url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path || movies[0].poster_path})` }}
                >
                  <div className='hero-content'>
                    <span className='hero-badge'>Featured</span>
                    <h1 className="hero-title">{movies[0].title || movies[0].name}</h1>
                    <p className="hero-desc">{movies[0].overview}</p>
                    <div className='hero-buttons'>
                      <button className='btn-primary' onClick={() => openMovieDetails(movies[0])}>
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

              {renderSection("Trending Now", movies, showMoreTrending, () => setShowMoreTrending(!showMoreTrending), movieLimit)}
              {renderSection("Critically Acclaimed", topRated, showMoreTopRated, () => setShowMoreTopRated(!showMoreTopRated), movieLimit)}
              {renderSection("Epic Action", action, showMoreAction, () => setShowMoreAction(!showMoreAction), movieLimit)}
              {renderSection("Laugh Out Loud", comedy, showMoreComedy, () => setShowMoreComedy(!showMoreComedy), movieLimit)}
              {renderSection(activeTab === "Series" ? "Unsolved Mysteries" : "Terrifying Horror", horror, showMoreHorror, () => setShowMoreHorror(!showMoreHorror), movieLimit)}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App;
