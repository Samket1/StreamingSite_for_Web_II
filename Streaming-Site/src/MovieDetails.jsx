import React, { useState } from 'react';
import { ArrowLeft, Play, Bookmark, Star, Clapperboard, X, Server } from 'lucide-react';
import './MovieDetails.css';

export default function MovieDetails({ movie, onBack, isWatched, onToggleWatch, initialPlaying = false, onPlayToggle }) {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);

  React.useEffect(() => {
    setIsPlaying(initialPlaying);
  }, [initialPlaying]);
  const [videoSource, setVideoSource] = useState('vidsrc');

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  if (!movie) return null;

  const isTV = !!movie.first_air_date;
  const bgImage = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : (movie.movie_banner || movie.posterUrl || movie.image);

  const movieId = movie.id || movie.movieId;

  // --- START OF URL BUILDER ---
  // Replace this entire switch statement with the one you just pasted!
  let embedUrl = "";

  switch (videoSource) {
    case 'vidsrc':
      embedUrl = isTV
        ? `https://vidsrc.to/embed/tv/${movieId}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${movieId}`;
      break;
    case 'vidsrc2':
      embedUrl = isTV
        ? `https://vidsrc.me/embed/tv/${movieId}/${season}/${episode}`
        : `https://vidsrc.me/embed/movie/${movieId}`;
      break;
    case '2embed':
      embedUrl = isTV
        ? `https://www.2embed.cc/embedtv/${movieId}?s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${movieId}`;
      break;
    case 'moviesapi':
      embedUrl = isTV
        ? `https://moviesapi.club/tv/${movieId}-${season}-${episode}`
        : `https://moviesapi.club/movie/${movieId}`;
      break;
    default:
      embedUrl = isTV
        ? `https://vidsrc.to/embed/tv/${movieId}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${movieId}`;
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
          <button className="btn-primary" onClick={() => { setIsPlaying(true); if (onPlayToggle) onPlayToggle(true); }}>
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
          backgroundColor: '#0b0c10', zIndex: 9999, display: 'flex', flexDirection: 'column', overflowY: 'auto'
        }}>
          {/* Player Controls Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '15px 20px',
            backgroundColor: '#111', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: '10px'
          }}>
            {/* Left Side: Server and Episodes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={20} color="#e50914" />
                <select
                  value={videoSource}
                  onChange={(e) => setVideoSource(e.target.value)}
                  style={{
                    backgroundColor: '#222', color: 'white', padding: '8px',
                    borderRadius: '5px', border: '1px solid #333', outline: 'none'
                  }}
                >
                  <option value="vidsrc">Server 1 (VidSrc)</option>
                  <option value="vidsrc2">Server 2 (VidSrc2)</option>
                  <option value="2embed">Server 3 (2Embed)</option>
                  <option value="moviesapi">Server 4 (MoviesAPI)</option>
                </select>
              </div>

              {isTV && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    style={{ backgroundColor: '#222', color: 'white', padding: '8px', borderRadius: '5px', border: '1px solid #333', outline: 'none' }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                    ))}
                  </select>
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                    style={{ backgroundColor: '#222', color: 'white', padding: '8px', borderRadius: '5px', border: '1px solid #333', outline: 'none' }}
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => { setIsPlaying(false); if (onPlayToggle) onPlayToggle(false); }}
              style={{
                background: 'transparent', border: 'none', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={28} />
            </button>
          </div>

          {/* IFRAME VIDEO PLAYER */}
          <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '75vh', backgroundColor: '#000', flexShrink: 0 }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            ></iframe>
          </div>

          {/* BELOW PLAYER DETAILS */}
          <div style={{ padding: '30px 40px', color: 'white', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#fff' }}>{movie.title || movie.name}</h1>

            <div style={{ display: 'flex', gap: '15px', color: '#e50914', fontWeight: 'bold', marginBottom: '20px', fontSize: '15px' }}>
              <span>⭐ {movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A'} Rating</span>
              <span>&bull;</span>
              <span>{movie.release_date || movie.first_air_date || "N/A"}</span>
              <span>&bull;</span>

              <span style={{ border: '1px solid #e50914', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>HD</span>
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#a0a5b5', maxWidth: '800px' }}>
              {movie.overview || movie.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}








