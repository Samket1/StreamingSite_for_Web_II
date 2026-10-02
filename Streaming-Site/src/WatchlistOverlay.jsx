import { X } from 'lucide-react';
import MovieCard from './MovieCard';

export default function WatchlistOverlay({
  watchlist,
  setWatchlistOpen,
  toggleWatchlist,
  setSelectedMovie,
  isClosing = false
}) {
  return (
    <div className={`search-overlay ${isClosing ? "closing" : ""}`}>
      <button className='close-search-btn' onClick={() => setWatchlistOpen(false)} title="Close watchlist">
        <X size={22} />
      </button>
      <h1 className='search-overlay-title'>Your Watchlist has {watchlist.length} movies/shows</h1>
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
          })}
        </div>
      )}
    </div>
  );
}
