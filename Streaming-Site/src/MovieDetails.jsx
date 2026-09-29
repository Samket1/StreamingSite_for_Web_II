import React from 'react';
import { ArrowLeft, Play, Bookmark, Star, Clapperboard } from 'lucide-react';
import './MovieDetails.css';

export default function MovieDetails({ movie, onBack, isWatched, onToggleWatch, onPlay }) {
  if (!movie) return null;

  const bgImage = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : (movie.movie_banner || movie.posterUrl || movie.image);
    
  return (
    <div className="movie-details-container">
      <div 
        className="movie-details-banner" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="banner-gradient"></div>
      </div>

      <div className="movie-details-topbar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={28} />
        </button>
        <div className="topbar-logo">
          <Clapperboard size={32} />
        </div>
      </div>

      <div className="movie-details-content">
        <h1 className="movie-details-title">{movie.title || movie.name}</h1>
        
        <div className="movie-details-genres">
          HD &bull; StreamDopamine
        </div>

        <div className="movie-details-actions">
          <button className="btn-primary" onClick={onPlay}>
            <Play size={20} fill="currentColor" /> Play Now
          </button>
          <button className={`btn-secondary ${isWatched ? 'in-watchlist' : ''}`} onClick={onToggleWatch}>
            <Bookmark size={20} fill={isWatched ? "currentColor" : "none"} />
            <span>{isWatched ? " In Watchlist" : " Watchlist"}</span>
          </button>
        </div>

        <div className="movie-details-meta">
          <span>{movie.release_date || movie.first_air_date || "N/A"}</span>
          <span className="rating-score">
            <Star size={16} fill="#f5c518" color="#f5c518" /> {movie.vote_average ? (movie.vote_average * 10).toFixed(0) : (movie.rt_score || movie.rating)}% Match
          </span>
        </div>

        <div className="movie-details-description">
          {movie.overview || movie.description}
        </div>
      </div>
    </div>
  );
}
