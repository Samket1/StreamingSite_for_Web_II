import { X, Search } from 'lucide-react';
import MovieCard from './MovieCard';

export default function SearchOverlay({
  search,
  setSearch,
  isClosing,
  closeSearch,
  filterMovies = [],
  watchlist = [],
  toggleWatchlist,
  setSelectedMovie
}) {
  const isPreSearch = !search || search.trim() === '';

  return (
    <div className={`search-overlay ${isClosing ? 'closing' : ''}`}>
      <button className='close-search-btn' onClick={closeSearch} title="Close search">
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
          autoFocus
        />
      </div>

      {isPreSearch && (
        <h2 style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '20px', fontWeight: '600', marginBottom: '16px', width: '90%', maxWidth: '1200px' }}>
          Trending & Popular Searches
        </h2>
      )}

      {filterMovies.length === 0 && !isPreSearch ? (
        <div className='no-results' style={{ marginTop: '40px', fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)' }}>
          No movies or TV shows found matching "{search}"
        </div>
      ) : (
        <div className='search-results-grid'>
          {filterMovies.map((movie) => {
            const movieId = movie.id || movie.movieId;
            const isInWatchlist = watchlist.some((m) => (m.id || m.movieId) == movieId);
            const poster = movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : (movie.posterUrl || (movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'));

            return (
              <MovieCard
                key={movieId}
                id={movieId}
                title={movie.title || movie.name}
                rating={movie.vote_average ? (movie.vote_average * 10).toFixed(0) : (movie.rating || 'N/A')}
                posterUrl={poster}
                isWatched={isInWatchlist}
                onToggleWatch={() => toggleWatchlist(movie)}
                onCardClick={() => setSelectedMovie(movie)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
