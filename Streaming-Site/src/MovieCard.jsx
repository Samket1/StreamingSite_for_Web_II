import { Bookmark, Star } from 'lucide-react';

export default function MovieCard({ id, title, rating, posterUrl, isWatched, onToggleWatch, onCardClick }) {
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
