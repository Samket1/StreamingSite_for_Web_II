import React, { useState } from 'react';
import { ArrowLeft, Play, Bookmark, Star, Clapperboard, X, Server } from 'lucide-react';
import './MovieDetails.css';

export default function MovieDetails({ movie, onBack, isWatched, onToggleWatch }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSource, setVideoSource] = useState('VidSrc');

  if (!movie) return null;

  const bgImage = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : (movie.movie_banner || movie.posterUrl || movie.image);

  const movieId = movie.id || movie.movieId;

  // This is the dynamic URL builder architecture your friend used.
  // I have replaced the real domains with soda brands.
  let embedUrl = "";

  if (videoSource === 'VidSrc') {
    // VidSrc represents the first API in your friend's switch statement
    embedUrl = `https://vidsrc.to/embed/movie/${movieId}`;
  } else if (videoSource === 'embed') {
    // embed represents the second API in your friend's switch statement
    embedUrl = `https://moviesapi.club/movie/${movieId}`;
  } else if (videoSource === 'moviesapi') {
    // moviesapi represents the third API
    embedUrl = `https://www.2embed.cc/embed/${movieId}`;
  }

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
          <button className="btn-primary" onClick={() => setIsPlaying(true)}>
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

      {/* IN-APP VIDEO PLAYER MODAL */}
      {isPlaying && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column'
        }}>
          {/* Player Controls Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '15px 20px',
            backgroundColor: '#111', alignItems: 'center'
          }}>

            {/* Server Selection Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={20} color="#00d4aa" />
              <select
                value={videoSource}
                onChange={(e) => setVideoSource(e.target.value)}
                style={{
                  backgroundColor: '#222', color: 'white', padding: '8px',
                  borderRadius: '5px', border: '1px solid #333', outline: 'none'
                }}
              >
                <option value="VidSrc">Server 1 (VidSrc)</option>
                <option value="embed">Server 2 (embed)</option>
                <option value="moviesapi">Server 3 (moviesapi)</option>
              </select>
            </div>


            {/* Close Button */}
            <button
              onClick={() => setIsPlaying(false)}
              style={{
                background: 'transparent', border: 'none', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <X size={24} /> Close
            </button>
          </div>

          {/* IFRAME VIDEO PLAYER */}
          <div style={{ flex: 1, backgroundColor: '#000' }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
