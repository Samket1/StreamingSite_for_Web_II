import { X, Search } from 'lucide-react';
import MovieCard from './MovieCard';

export default function SearchOverlay({
  search,
  setSearch,
  isClosing,
  closeSearch,
  filterMovies,
  watchlist,
  toggleWatchlist,
  setSelectedMovie
}) {
  return (
    <div className={`search-overlay ${isClosing ? 'closing' : ''}`}>
      <button className='close-search-btn' onClick={closeSearch}>
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
  );
}
