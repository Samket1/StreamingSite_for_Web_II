import React from 'react';
import { ArrowLeft, Play, Plus, Download, EyeOff, Star, ThumbsUp, ThumbsDown, Clapperboard } from 'lucide-react';
import './MovieDetails.css';

export default function MovieDetails({ movie, onBack }) {
  if (!movie) return null;

  return (
    <div className="movie-details-container">
      {/* Background Banner */}
      <div 
        className="movie-details-banner" 
        style={{ backgroundImage: `url(${movie.movie_banner || movie.image})` }}
      >
        <div className="banner-gradient"></div>
      </div>

      {/* Top Bar */}
      <div className="movie-details-topbar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={28} />
        </button>
        <div className="topbar-logo">
          <Clapperboard size={32} />
        </div>
      </div>

      {/* Main Content */}
      <div className="movie-details-content">
        <h1 className="movie-details-title">{movie.title}</h1>
        
        <div className="movie-details-genres">
          Animation &bull; Adventure &bull; Family
        </div>

        <div className="movie-details-actions">
          <button className="action-play">
            <Play size={20} fill="currentColor" /> Play
          </button>
          <button className="action-circle">
            <Plus size={20} />
          </button>
          <button className="action-circle">
            <Download size={20} />
          </button>
          <button className="action-circle">
            <EyeOff size={20} />
          </button>
        </div>

        <div className="movie-details-meta">
          <span>{movie.release_date}</span>
          <span>{movie.running_time}m</span>
          <span className="rating-badge">G</span>
          <span className="rating-score">
            <Star size={16} fill="#f5c518" color="#f5c518" /> {movie.rt_score / 10}
          </span>
          <span className="likes">
            <ThumbsUp size={16} /> 1
          </span>
          <span className="dislikes">
            <ThumbsDown size={16} /> 1
          </span>
        </div>

        <div className="movie-details-director">
          <span className="label">Director:</span> {movie.director}
        </div>

        <div className="movie-details-description">
          {movie.description}
          {/* A simple fade out or read more could go here if text is too long, but we'll show it whole for now */}
        </div>

        {/* Bottom Info Card */}
        <div className="movie-details-bottom-sheet">
          <div className="sheet-row">
            <span className="sheet-label">Runtime</span>
            <span className="sheet-value">{movie.running_time}m &bull; Ends {new Date(Date.now() + movie.running_time * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="sheet-row">
            <span className="sheet-label">Language</span>
            <span className="sheet-value">EN, JP</span>
          </div>
          <div className="sheet-row">
            <span className="sheet-label">Budget</span>
            <span className="sheet-value">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
